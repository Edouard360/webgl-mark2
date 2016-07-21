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

<<<<<<< HEAD
  var useInstantiation = false;
=======
  var useInstantiation = true;
>>>>>>> origin/Removing-Utilities

  canvas=document.getElementById("canvas_webgl");
  container = document.createElement( 'div' );
  document.body.appendChild( container );
  stats = new Stats();
  container.appendChild( stats.dom );

  try {
    GL = canvas.getContext("webgl", {antialias: true,alpha:false});
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

  function moveDataJellyfish(x,y,z){
    var data_tmp = JSON.parse(JSON.stringify(data));
    data_tmp.jellyfish.vertices = data_tmp.jellyfish.vertices.map((coord,i)=>{
      return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
    });
    console.log("OK")
    return data_tmp
  }

  if(!useInstantiation){
<<<<<<< HEAD
      var jellyfish_army = data.army_coordinates.map((coord)=>{
=======
      var jellyfish_army = data.jellyfish.offset.map((coord)=>{
>>>>>>> origin/Removing-Utilities
      var data_tmp = moveDataJellyfish(coord[0],coord[1],coord[2]);
      data_tmp.jellyfish.images = data.jellyfish.images
      return new Jellyfish(GL,data_tmp);
    });
  }else{
      var instancedJellyfish = new InstancedJellyfish(GL,GLext,data);
  }


  //var gradient = new Gradient(GL,data.gradient);

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    GL.clearColor(1.,1.,1.,1.);
    //gradient.render();
    if(!useInstantiation){
      jellyfish_army.map((jellyfish)=>{
        jellyfish.render();
      })
    }else{
      instancedJellyfish.render();
    }

  }

  function onResize () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight;
    if(!useInstantiation){
      jellyfish_army.map((jellyfish)=>{
        jellyfish.updateViewport(canvas);
      })
    }else{
      instancedJellyfish.updateViewport(canvas);
    }
  }
  window.addEventListener("resize", onResize, false);
  onResize();

  var ref = 0;

  var animate=function() {
    GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
    drawing();
    GL.flush();
    stats.update();
    requestAnimationFrame(animate);
  };
  animate(0);
}

var object_promise = {
<<<<<<< HEAD
  shaders:{
    VS: undefined,
    FS: undefined
  },
  gradient:{
    VS: undefined,
    FS: undefined
  },
  debug:{
    VS: undefined,
    FS: undefined
  },
=======
  shaders:{VS: undefined,FS: undefined},
  gradient:{VS: undefined,FS: undefined},
  debug:{VS: undefined,FS: undefined},
>>>>>>> origin/Removing-Utilities
  jellyfish:{
    vertices: undefined,
    normals: undefined,
    texture: undefined,
    colors: undefined,
    faces: undefined,
    images: undefined,
    offset: undefined
<<<<<<< HEAD
  },
  army_coordinates: undefined
=======
  }
>>>>>>> origin/Removing-Utilities
}

var array_promise =[
getXHR('./shaders/jellyfish/instanced_jellyfish.vert').then(function(value){object_promise.shaders.VS = value}),
getXHR('./shaders/jellyfish/jellyfish.frag').then(function(value){object_promise.shaders.FS = value}),
getXHR('./shaders/gradient/gradient.vert').then(function(value){object_promise.gradient.FS = value}),
getXHR('./shaders/gradient/gradient.frag').then(function(value){object_promise.gradient.FS = value}),
getXHR('./shaders/debug/debug.vert').then(function(value){object_promise.debug.FS = value}),
getXHR('./shaders/debug/debug.frag').then(function(value){object_promise.debug.FS = value}),
getXHR('./data/attributes/jellyfish_vertices.json').then(JSON.parse).then(function(value){object_promise.jellyfish.vertices = value}),
getXHR('./data/attributes/jellyfish_normals.json').then(JSON.parse).then(function(value){object_promise.jellyfish.normals = value}),
getXHR('./data/attributes/jellyfish_texture.json').then(JSON.parse).then(function(value){object_promise.jellyfish.texture = value}),
getXHR('./data/attributes/jellyfish_colors.json').then(JSON.parse).then(function(value){object_promise.jellyfish.colors = value}),
getXHR('./data/attributes/jellyfish_ifaces.json').then(JSON.parse).then(function(value){object_promise.jellyfish.faces = value}),
getXHR('./data/img/list.json').then(JSON.parse).then(getImages).then(function(value){object_promise.jellyfish.images = value}),
getXHR('./data/group/jellyfish_army_coordinates_full.json').then(JSON.parse).then(function(value){object_promise.jellyfish.offset= value;object_promise.army_coordinates= value;})
]

<<<<<<< HEAD
Promise.all(array_promise).then(function(values){
=======
Promise.all(array_promise).then(function(){
>>>>>>> origin/Removing-Utilities
    main(object_promise);
});
