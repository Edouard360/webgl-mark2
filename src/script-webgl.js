'use strict';
import AbstractJellyfish from './jellyfish/webgl/abstract-jellyfish'
import SingleJellyfish from './jellyfish/webgl/single-jellyfish'
import InstancedJellyfish from './jellyfish/webgl/instanced-jellyfish'
import MultipleJellyfish from './jellyfish/webgl/multiple-jellyfish'
import Gradient from './jellyfish/webgl/gradient'
import {getImages, getNewCanvas} from './util/util'
import {CAMERA, MAX_NUMBER} from './data/const.js'
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
  var canvas_container = document.getElementById("canvas_container");
  var canvas = getNewCanvas(canvas_container);

  var jellyfishCount = 1; // The initial count of jellyfish

  /**
   * The code bellow simply sets the user interface for changing parameters
   */
  gui
  .add(text, 'class', ["Single","Instanced","Multiple"])
  .name("Class")
  .onChange((value)=>{
    canvas = getNewCanvas(canvas_container);
    cancelAnimationFrame(handle.animation);
    gui.remove(handle.jellyfishCount);
    gui.remove(handle.averageFPS);
    switch(value){
      case "Single":
        jellyfishCount = 1;
        refresh(SingleJellyfish,jellyfishCount);
        break;
      case "Multiple":
        jellyfishCount = 3;
        refresh(MultipleJellyfish,jellyfishCount);
        break;
      case "Instanced":
        jellyfishCount = 3;
        refresh(InstancedJellyfish,jellyfishCount);
        break;
      default:
       throw 'dont know option ' + value
    }
  });
  gui
  .add(text, 'loadingTime', ["Single","Instanced","Multiple"])
  .name("Loading Time").domElement.id = 'loadingTime';

  refresh(SingleJellyfish,1); // Launch the initial benchmark with a single jellyfish

  /**
   * The refresh function. It gets a context from the current canvas of the main scope.
   * @param {class} BenchmarkClass - The class to instantiate and benchmark.
   * @param {int} jellyfishCount - The number of jellyfish to be displayed. 
   */
  function refresh(BenchmarkClass,jellyfishCount) {
    var GL = canvas.getContext("webgl", {antialias: true,alpha:false});
    GL.getExtension("OES_element_index_uint");
    //GL.disable(GL.DEPTH_TEST);
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);

    GL.disable(GL.CULL_FACE);
    //GL.enable(GL.BLEND);
    //GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    GL.frontFace(GL.CW);

    var gradient = new Gradient(GL,data.gradient);
    var benchmark = new BenchmarkClass(GL,data.jellyfish);
    benchmark.jellyfishCount = jellyfishCount;

    handle.jellyfishCount = gui.add(benchmark, 'jellyfishCount',1,MAX_NUMBER).name("Number").step(1);
    handle.jellyfishCount.onChange(()=>{benchmark.resetTimer()})
    handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
    handle.averageFPS.domElement.id = 'averageFPS';

    var drawing = function(){
      GL.viewport(0, 0, canvas.width, canvas.height);
      gradient.render();
      benchmark.render();
    }

    function onResize () {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      benchmark.updateViewport(canvas.width,canvas.height);
    }
    window.addEventListener("resize",onResize, false);
    onResize();

    var animate=function(){
      GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
      drawing();
      handle.animation = requestAnimationFrame(animate);
    };
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

getImages(require('./data/img/list.json')).then(function(value){object_promise.jellyfish.images = value})
.then(function(){
    main(object_promise);
});
