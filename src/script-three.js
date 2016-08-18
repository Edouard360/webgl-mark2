'use strict';
import THREE from 'three'  
import ThreeAbstractJellyfish from './jellyfish/threejs/three-abstract-jellyfish'
import ThreeSingleJellyfish from './jellyfish/threejs/three-single-jellyfish'
import ThreeInstancedJellyfish from './jellyfish/threejs/three-instanced-jellyfish'
import ThreeMultipleJellyfish from './jellyfish/threejs/three-multiple-jellyfish'
import ThreeGradient from './jellyfish/threejs/three-gradient'
import {getImages, getNewCanvas,getThreeTextures} from './util/util'
import {CAMERA,MAX_NUMBER} from './data/const.js';
import {gui, text} from './data/gui.js'

/**
 * @var {object} handle - A global variable to hold handles
 * @property {int} handle.animation      - for cancelling the requestAnimationFrame
 * @property {int} handle.jellyfishCount - for changing the jellyfish count display between ≠ instances
 * @property {int} handle.averageFPS     - for changing the average FPS display between ≠ instances.
 */
var handle = {};

/**
 * The main function. It creates an new canvas and prepare listeners for changing benchmarks.
 * The structure of the 'data' parameter is at the end of this script: object_promise.
 * @param {Object} data - The data asynchronously loaded for running the benchmark.
 */ 
 var main=function(data) {
  var container = document.getElementById("canvas_container");
  var canvas = getNewCanvas(canvas_container);

  var jellyfishCount = 1; // The initial count of jellyfish

  /**
   * The code bellow simply sets the user interface for changing parameters
   */
  gui
  .add(text, 'class', ["Single","Instanced",'Multiple'])
  .name("Class")
  .onChange((value)=>{
    canvas = getNewCanvas(canvas_container);
    cancelAnimationFrame(handle.animation);
    gui.remove(handle.jellyfishCount);
    gui.remove(handle.averageFPS);
    switch(value){
      case "Single":
      jellyfishCount = 1;
      refresh(ThreeSingleJellyfish,jellyfishCount);
      break;
      case "Instanced":
      jellyfishCount = 3;
      refresh(ThreeInstancedJellyfish,jellyfishCount);
      break;
      case "Multiple":
      jellyfishCount = 3;
      refresh(ThreeMultipleJellyfish,jellyfishCount);
      break;
      default:
      throw 'dont know option ' + value
    }
  });
  gui
  .add(text, 'loadingTime', ["Single","Instanced","Multiple"])
  .name("Loading Time").domElement.id = 'loadingTime';

  refresh(ThreeSingleJellyfish,1); // Launch the initial benchmark with a single jellyfish

  /**
   * The refresh function. It gets a context from the current canvas of the main scope.
   * @param {class} BenchmarkClass - The class to instantiate and benchmark.
   * @param {int} jellyfishCount - The number of jellyfish to be displayed. 
   */
   function refresh(BenchmarkClass,jellyfishCount) {
    var scene = new THREE.Scene(); // position initialized at 0,0,0
    var camera = new THREE.PerspectiveCamera(CAMERA.ANGLE, window.innerWidth / window.innerHeight, CAMERA.NEAR, CAMERA.FAR); //In degrees not radians

    var benchmark = new BenchmarkClass(data.jellyfish,scene);
    var gradient = new ThreeGradient(data.gradient,scene); 

    benchmark.geometry.maxInstancedCount = jellyfishCount;
    handle.jellyfishCount = gui.add(benchmark.geometry, 'maxInstancedCount',1,MAX_NUMBER).name("Number").step(1);
    handle.jellyfishCount.onChange(()=>{benchmark.resetTimer()})
    handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
    handle.averageFPS.domElement.id = 'averageFPS';
    
    var renderer = new THREE.WebGLRenderer({canvas:canvas,antialias:true});
    renderer.setClearColor( 0xFFFFFF );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === false ) {
      alert('ANGLE_instanced_arrays not supported'); 
    }

    function animate() {
      benchmark.update();
      renderer.render( scene, camera );
      handle.animation = requestAnimationFrame( animate );
    }
    animate(0);
  }
}

var object_promise = {
  gradient:{
    shaders:{VS: require('./shaders/gradient/gradient.vert'),FS: require('./shaders/gradient/gradient.frag')}
  },
  jellyfish:{
    shaders:{VS: require('./shaders/jellyfish/jellyfish.vert'),FS: require('./shaders/jellyfish/jellyfish.frag')},
    position: require('./data/attributes/jellyfish_position.json'),
    normal: require('./data/attributes/jellyfish_normal.json'),
    texture: require('./data/attributes/jellyfish_texture.json'),
    color: require('./data/attributes/jellyfish_color.json'),
    index: require('./data/attributes/jellyfish_index.json'),
    images: undefined
  }
}

getThreeTextures(require('./data/img/list.json')).then(function(value){object_promise.jellyfish.images = value})
.then(function(){
    main(object_promise);
});

