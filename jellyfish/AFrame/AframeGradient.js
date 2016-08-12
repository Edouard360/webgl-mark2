'use strict';
var gradient = {
  schema:{
    topColor:{type:'vec3',default:{x:0.360784314, y:0.584313725, z:1.0}},
    bottomColor:{type:'vec3',default:{x:0.074509804, y: 0.156862745, z:0.619607843}}
  },
  init(){
    var geometry = new THREE.PlaneBufferGeometry(2,2,0,0);

    var uv = new THREE.BufferAttribute(new Float32Array(8),2);
    uv.setXY(0,0,0);
    uv.setXY(1,0,0);
    uv.setXY(2,1,1);
    uv.setXY(3,1,1);
    geometry.addAttribute( 'uv',uv )
    
    var topColor = this.data.topColor
    var bottomColor = this.data.bottomColor
    var material = new THREE.ShaderMaterial({
      vertexShader:   require('../../shaders/gradient/gradient.vert'),
      fragmentShader: require('../../shaders/gradient/gradient.frag'),
      defines:{THREE_JS:true},
      uniforms:{
        color1: {value: new THREE.Vector3(topColor.x,topColor.y,topColor.z)},
        color2: {value: new THREE.Vector3(bottomColor.x,bottomColor.y,bottomColor.z)}
      }
    });

    this.el.setObject3D('mesh',new THREE.Mesh(geometry, material));
  }
}

export {gradient};
