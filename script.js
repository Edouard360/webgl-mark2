VR = !!navigator.getVRDisplays;
useInstantiation = false;

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
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  stats = new Stats();
  container.appendChild( stats.dom );

  try {
    GL = canvas.getContext("webgl", {antialias: true,alpha:false,preserveDrawingBuffer:true});//||canvas.getContext("experimental-webgl", {antialias: true,alpha:false});
  } catch (e) {
    alert("You are not webgl compatible :(") ;
    return false;
  }

  var vrDisplay = data.vrDisplay;
  if(vrDisplay){
    vrDisplay.requestPresent([{source:canvas}]);
  }

  GLext = GL.getExtension("ANGLE_instanced_arrays");
  GL.getExtension("OES_element_index_uint");

  GL.disable(GL.DEPTH_TEST);
  GL.disable(GL.CULL_FACE);
  GL.enable(GL.BLEND);
  GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
  GL.frontFace(GL.CW);


    if(!useInstantiation){
        var jellyfishGroup = new JellyfishGroup(GL, data);
    }else{
        var jellyfishGroup = new InstancedJellyfish(GL,GLext,data);
    }



  var gradient = new Gradient(GL,data.gradient);

  var drawing = function(){
    if(!vrDisplay || !vrDisplay.isPresenting){
      GL.viewport(0, 0, canvas.width, canvas.height);
      GL.clearColor(1.,1.,1.,1.);
      gradient.render();
      jellyfishGroup.render();
    }else{
        pose = vrDisplay.getPose();
        GL.viewport(0, 0, canvas.width * 0.5, canvas.height);
        //jellyfishGroup.render("left");
        gradient.render();
        jellyfishGroup.render();
        GL.viewport(canvas.width * 0.5, 0, canvas.width * 0.5, canvas.height);
        //jellyfishGroup.render("right");
        gradient.render();
        jellyfishGroup.render();

    }
  }

  function onResize () {
    if (vrDisplay && vrDisplay.isPresenting) {
      var leftEye = vrDisplay.getEyeParameters("left");
      var rightEye = vrDisplay.getEyeParameters("right");
      canvas.width = Math.max(leftEye.renderWidth, rightEye.renderWidth) * 2;
      canvas.height = Math.max(leftEye.renderHeight, rightEye.renderHeight);
    }
    else{
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    jellyfishGroup.updateViewport(canvas);
  }
  window.addEventListener("resize", onResize, false);
  onResize();

  var animate=function() {
    GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
    drawing();

    if(vrDisplay){
      vrDisplay.submitFrame(pose);
      vrDisplay.requestAnimationFrame(animate);
    }else{
      requestAnimationFrame(animate);
    }

    stats.update();
  };
  animate(0);
}

var object_promise = {
  shaders:{VS: undefined,FS: undefined},
  gradient:{VS: undefined,FS: undefined},
  debug:{VS: undefined,FS: undefined},
  jellyfish:{
    vertices: undefined,
    normals: undefined,
    texture: undefined,
    colors: undefined,
    faces: undefined,
    images: undefined,
    offset: undefined
  },
  vrDisplay:undefined
}

var array_promise =[
getXHR('./shaders/jellyfish/instanced_jellyfish.vert').then(function(value){object_promise.shaders.VS = value}),
getXHR('./shaders/jellyfish/jellyfish.frag').then(function(value){object_promise.shaders.FS = value}),
getXHR('./shaders/gradient/gradient.vert').then(function(value){object_promise.gradient.VS = value}),
getXHR('./shaders/gradient/gradient.frag').then(function(value){object_promise.gradient.FS = value}),
getXHR('./shaders/debug/debug.vert').then(function(value){object_promise.debug.VS = value}),
getXHR('./shaders/debug/debug.frag').then(function(value){object_promise.debug.FS = value}),
getXHR('./data/attributes/jellyfish_vertices.json').then(JSON.parse).then(function(value){object_promise.jellyfish.vertices = value}),
getXHR('./data/attributes/jellyfish_normals.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normals = value}),
getXHR('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getXHR('./data/attributes/jellyfish_colors.json').then(JSON.parse).then(function(value){object_promise.jellyfish.colors = value}),
getXHR('./data/attributes/jellyfish_ifaces.json').then(JSON.parse).then(function(value){object_promise.jellyfish.faces = value}),
getXHR('./data/img/list.json').then(JSON.parse).then(getImages).then(function(value){object_promise.jellyfish.images = value}),
getXHR('./data/group/jellyfish_army_coordinates.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset= value;}),
//navigator.getVRDisplays().then(function(value){object_promise.vrDisplay=value[0]})
]


Promise.all(array_promise).then(function(){
    main(object_promise);
});
