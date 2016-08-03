'use strict';
/**
 * The main function. It creates an new canvas and prepare listeners for changing benchmarks.
 * The structure of the 'data' parameter is at the end of this script: object_promise.
 * @param {Object} data - The data asynchronously loaded for running the benchmark.
 */ 
var main=function(data) {
  var container = document.getElementById("canvas_container");

  var scene = new THREE.Scene(); // position initialized at 0,0,0
  var camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 20.0, 120.0); //In degrees not radians
  var jellyfish = new ThreeInstancedJellyfish(data.jellyfish);
  var gradient = new ThreeGradient(data.gradient); 

  scene.add(jellyfish.mesh);
  scene.add(gradient.mesh);

  var renderer = new THREE.WebGLRenderer({canvas:document.getElementById("my_canvas")});
  renderer.setClearColor( 0xFFFFFF );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === false ) {
    document.getElementById( "notSupported" ).style.display = "";
    return;
  }

  function animate() {
    jellyfish.update();
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
  }
  animate();
}

var object_promise = {
  gradient:{
    shaders:{VS: undefined,FS: undefined}
  },
  jellyfish:{
    shaders:{VS: undefined,FS: undefined},
    position: undefined,
    normal: undefined,
    texture: undefined,
    color: undefined,
    index: undefined,
    imagesList: undefined,
    offset: undefined
  }
}

var array_promise =[
getText('./shaders/jellyfish/jellyfish-Three.vert').then(function(value){object_promise.jellyfish.shaders.VS = value}),
getText('./shaders/jellyfish/jellyfish-Three.frag').then(function(value){object_promise.jellyfish.shaders.FS = value}),
getText('./shaders/gradient/gradient-Three.vert').then(function(value){object_promise.gradient.shaders.VS = value}),
getText('./shaders/gradient/gradient-Three.frag').then(function(value){object_promise.gradient.shaders.FS = value}),
getText('./data/attributes/jellyfish_position.json').then(JSON.parse).then(function(value){object_promise.jellyfish.position = value}),
getText('./data/attributes/jellyfish_normal.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normal = value}),
getText('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getText('./data/attributes/jellyfish_color.json').then(JSON.parse).then(function(value){object_promise.jellyfish.color = value}),
getText('./data/attributes/jellyfish_index.json').then(JSON.parse).then(function(value){object_promise.jellyfish.index = value}),
getText('./data/img/list.json').then(JSON.parse).then(function(value){object_promise.jellyfish.imagesList = value}),
getText('./data/group/offset.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset = value;})
]

Promise.all(array_promise).then(function(){
    main(object_promise);
});
