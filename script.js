var getXHR = function(url){
    return new Promise(function(resolve,reject){
      loadTextResource(url, function (err, data) {
          if (err) {
            reject(err);
          }else{
            resolve(data);
          }
      })
  })
}

var getImages = function(list){
  return Promise.all(list.map(
    function(url){return getImage("./data/img/" + url )}
    ));

  function getImage(url){
    return new Promise(function(resolve,reject){
      var image = new Image();
      image.onload = function(){
        resolve(image);
      }
      image.src = url
    })
  }
}

var main=function(data) {

  canvas=document.getElementById("canvas_webgl");

  try {
    GL = canvas.getContext("webgl", {antialias: true,alpha:false,preserveDrawingBuffer:true});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  GLext = GL.getExtension("ANGLE_instanced_arrays");
  GL.getExtension("OES_element_index_uint");

  GL.disable(GL.DEPTH_TEST);
  GL.disable(GL.CULL_FACE);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
  GL.frontFace(GL.CW);

  var jellyfish = new JellyfishGroup(GL, data);

  var gradient = new Gradient(GL,data.gradient);

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    GL.clearColor(1.,1.,1.,1.);
    gradient.render();
    jellyfish.render();
  }

  function onResize () {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    jellyfish.updateViewport(canvas);
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
    vertices: undefined,
    normals: undefined,
    texture: undefined,
    colors: undefined,
    faces: undefined,
    images: undefined,
    offset: undefined
  }
}

var array_promise =[
getXHR('./shaders/jellyfish/jellyfish.vert').then(function(value){object_promise.shaders.VS = value}),
getXHR('./shaders/jellyfish/jellyfish.frag').then(function(value){object_promise.shaders.FS = value}),
getXHR('./shaders/gradient/gradient.vert').then(function(value){object_promise.gradient.VS = value}),
getXHR('./shaders/gradient/gradient.frag').then(function(value){object_promise.gradient.FS = value}),
getXHR('./data/attributes/jellyfish_vertices.json').then(JSON.parse).then(function(value){object_promise.jellyfish.vertices = value}),
getXHR('./data/attributes/jellyfish_normals.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normals = value}),
getXHR('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getXHR('./data/attributes/jellyfish_colors.json').then(JSON.parse).then(function(value){object_promise.jellyfish.colors = value}),
getXHR('./data/attributes/jellyfish_ifaces.json').then(JSON.parse).then(function(value){object_promise.jellyfish.faces = value}),
getXHR('./data/img/list.json').then(JSON.parse).then(getImages).then(function(value){object_promise.jellyfish.images = value}),
getXHR('./data/group/jellyfish_army_coordinates.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset= value;})
]

Promise.all(array_promise).then(function(){
    main(object_promise);
});
