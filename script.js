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
  stats = new Stats();
  container.appendChild( stats.dom );

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

  function moveDataJellyfish(x,y,z){
    var data_tmp = JSON.parse(JSON.stringify(data));
    data_tmp.jellyfish.vertices = data_tmp.jellyfish.vertices.map((coord,i)=>{
      return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
    });
    console.log("OK")
    return data_tmp
  }
  console.log(moveDataJellyfish(0,1,1));

  var jellyfish_army = data.army_coordinates.map((coord)=>{
    var data_tmp = moveDataJellyfish(coord[0],coord[1],coord[2]);
    data_tmp.jellyfish.images = data.jellyfish.images
    return new Jellyfish(GL,data_tmp);
  });
  //var data = JSON.parse(JSON.stringify(data))
  //console.log(data);
  //console.log(data);



  // data.jellyfish.vertices = data.jellyfish.vertices.map((coord,i)=>{
  //   return ((i%3)==0)?(coord+6):coord;
  // })
  //var jellyfish = new Jellyfish(GL,data);
  var gradient = new Gradient(GL,data.gradient);

  var drawing = function(){
    GL.viewport(0, 0, canvas.width, canvas.height);
    GL.clearColor(1.,1.,1.,1.);
    gradient.render();
    jellyfish_army.map((jellyfish)=>{
      jellyfish.render();
    })

  }

  function onResize () {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight;
    jellyfish_army.map((jellyfish)=>{
      jellyfish.updateViewport(canvas);
    })
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
  getXHR('./shaders/gradient.frag'),
  getXHR('./shaders/debug.vert'),
  getXHR('./shaders/debug.frag'),
  getXHR('./data/jellyfish_army_coordinates.json').then(JSON.parse)
];

Promise.all(array_promise).then(function(values){
    main({
      shaders:{VS:values[0],FS:values[1]},
      gradient:{VS:values[8],FS:values[9]},
      debug:{VS:values[10],FS:values[11]},
      jellyfish:{vertices:values[2],normals:values[3],texture:values[4],colors:values[5],faces:values[6],images:values[7]},
      army_coordinates: values[12]
    });
});
