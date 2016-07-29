



var main=function(data) {

  canvas=document.getElementById("canvas_webgl");

  try {
    GL = canvas.getContext("webgl", {antialias: true,alpha:false});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  GL.getExtension("OES_element_index_uint");

  GL.disable(GL.DEPTH_TEST);
  GL.disable(GL.CULL_FACE);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
  GL.frontFace(GL.CW);

  //var jellyfish = new SingleJellyfish(GL, data);
  //var jellyfish = new InstancedJellyfish(GL, data);
  var jellyfish = new InstancedJellyfish(GL, data);

  var gradient = new Gradient(data.gradient);

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    gradient.render();
    jellyfish.render();
  }

  function onResize () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    jellyfish.updateViewport(canvas.width,canvas.height);
  }
  window.addEventListener("resize", onResize, false);
  onResize();

  var animate=function() {
    GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
    drawing();
    requestAnimationFrame(animate);
  };
  animate(0);
}

var object_promise = {
  shaders:{VS: undefined,FS: undefined},
  gradient:{VS: undefined,FS: undefined},
  jellyfish:{
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
getText('./shaders/jellyfish/jellyfish.vert').then(function(value){object_promise.shaders.VS = value}),
getText('./shaders/jellyfish/jellyfish.frag').then(function(value){object_promise.shaders.FS = value}),
getText('./shaders/gradient/gradient.vert').then(function(value){object_promise.gradient.VS = value}),
getText('./shaders/gradient/gradient.frag').then(function(value){object_promise.gradient.FS = value}),
getText('./data/attributes/jellyfish_position.json').then(JSON.parse).then(function(value){object_promise.jellyfish.position = value}),
getText('./data/attributes/jellyfish_normal.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normal = value}),
getText('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getText('./data/attributes/jellyfish_color.json').then(JSON.parse).then(function(value){object_promise.jellyfish.color = value}),
getText('./data/attributes/jellyfish_index.json').then(JSON.parse).then(function(value){object_promise.jellyfish.index = value}),
getText('./data/img/list.json').then(JSON.parse).then(getImages).then(function(value){object_promise.jellyfish.images = value}),
getText('./data/group/offset.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset= value;})
]

Promise.all(array_promise).then(function(){
    main(object_promise);
});
