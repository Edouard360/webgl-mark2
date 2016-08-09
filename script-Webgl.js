'use strict';
/** @var {object} gui - A global variable for user interface */
var gui;

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
  function JellyfishText(){
      this.class = "Single";
  }
  var text = new JellyfishText();
  gui = new dat.GUI();

  gui
  .add(text, 'class', ["Single","Instanced"])
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
      case "Instanced":
        jellyfishCount = 3;
        refresh(InstancedJellyfish,jellyfishCount);
        break;
      default:
       throw 'dont know option ' + value
    }
  });

  refresh(SingleJellyfish,1); // Launch the initial benchmark with a single jellyfish

  /**
   * The refresh function. It gets a context from the current canvas of the main scope.
   * @param {class} BenchmarkClass - The class to instantiate and benchmark.
   * @param {int} jellyfishCount - The number of jellyfish to be displayed. 
   */
  function refresh(BenchmarkClass,jellyfishCount) {
    var GL = canvas.getContext("webgl", {antialias: true,alpha:false});
    GL.getExtension("OES_element_index_uint");
    GL.disable(GL.DEPTH_TEST);
    GL.disable(GL.CULL_FACE);
    //GL.enable(GL.BLEND);
    //GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
    GL.frontFace(GL.CW);

    var gradient = new Gradient(GL,data.gradient);
    var benchmark = new BenchmarkClass(GL,data.jellyfish);
    benchmark.jellyfishCount = jellyfishCount;

    handle.jellyfishCount = gui.add(benchmark, 'jellyfishCount',1,MAX_NUMBER).name("Number").step(1);
    handle.averageFPS = gui.add(benchmark, 'averageFPS').name("Average FPS");

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
    shaders:{VS: undefined,FS: undefined}
  },
  jellyfish:{
    shaders:{VS: undefined,FS: undefined},
    position: undefined,
    normal: undefined,
    texture: undefined,
    color: undefined,
    index: undefined,
    images: undefined,
    offset: undefined
  }
}

var array_promise =[
getText('./shaders/jellyfish/jellyfish.vert').then(function(value){object_promise.jellyfish.shaders.VS = value}),
getText('./shaders/jellyfish/jellyfish.frag').then(function(value){object_promise.jellyfish.shaders.FS = value}),
getText('./shaders/gradient/gradient.vert').then(function(value){object_promise.gradient.shaders.VS = value}),
getText('./shaders/gradient/gradient.frag').then(function(value){object_promise.gradient.shaders.FS = value}),
getText('./data/attributes/jellyfish_position.json').then(JSON.parse).then(function(value){object_promise.jellyfish.position = value}),
getText('./data/attributes/jellyfish_normal.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normal = value}),
getText('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getText('./data/attributes/jellyfish_color.json').then(JSON.parse).then(function(value){object_promise.jellyfish.color = value}),
getText('./data/attributes/jellyfish_index.json').then(JSON.parse).then(function(value){object_promise.jellyfish.index = value}),
getText('./data/img/list.json').then(JSON.parse).then(getImages).then(function(value){object_promise.jellyfish.images = value}),
getText('./data/group/offset.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset = value;})
]

Promise.all(array_promise).then(function(){
    main(object_promise);
});
