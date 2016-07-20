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

var getImage = function(url){
  return new Promise(function(resolve,reject){
    var image = new Image();
    image.onload = function(){
      resolve(image);
    }
    image.src = url
  })
}

var getImages = function(list){
  return Promise.all(list.map(
    function(url){return getImage("./data/img/" + url )}
    ));
}

var main=function(data) {

  canvas=document.getElementById("canvas_webgl");
  container = document.createElement( 'div' );
  document.body.appendChild( container );

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

  var jellyfish = new Jellyfish(GL,data);
  var gradient = new Gradient(GL,data.gradient);

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    GL.clearColor(1.,1.,1.,1.);
    gradient.render();
    jellyfish.render();
  }

  function onResize () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight;
    jellyfish.updateViewport(canvas);
  }
  window.addEventListener("resize", onResize, false);
  onResize();

  var ref = 0;

  var animate=function() {
    GL.clear(GL.COLOR_BUFFER_BIT|GL.DEPTH_BUFFER_BIT);
    drawing();
    GL.flush();
    requestAnimationFrame(animate);
  };
  animate(0);
}

var promise_shader_vertex_source = getXHR('./shaders/jellyfish.vert')
var promise_shader_fragment_source = getXHR('./shaders/jellyfish.frag')

var jellyfish_vertices = getXHR('./data/jellyfish_vertices.json').then(JSON.parse)
var jellyfish_normals = getXHR('./data/jellyfish_normals.json').then(JSON.parse)
var jellyfish_texture = getXHR('./data/jellyfish_texture.json').then(JSON.parse)
var jellyfish_colors = getXHR('./data/jellyfish_colors.json').then(JSON.parse)
var jellyfish_ifaces = getXHR('./data/jellyfish_ifaces.json').then(JSON.parse)

var jellyfish_list = getXHR('./data/img/list.json').then(JSON.parse).then(getImages)

var array_promise = [
  promise_shader_vertex_source,
  promise_shader_fragment_source,
  jellyfish_vertices,
  jellyfish_normals,
  jellyfish_texture,
  jellyfish_colors,
  jellyfish_ifaces,
  jellyfish_list,
  getXHR('./shaders/gradient.vert'),
  getXHR('./shaders/gradient.frag')
];

Promise.all(array_promise).then(function(values){
    main({
      shaders:{VS:values[0],FS:values[1]},
      gradient:{VS:values[8],FS:values[9]},
      jellyfish:{vertices:values[2],normals:values[3],texture:values[4],colors:values[5],faces:values[6],images:values[7]}
    });
});
