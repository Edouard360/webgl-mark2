'use strict';
var gradient = {
  init(){
    var geometry = new THREE.PlaneBufferGeometry(2,2,0,0);

    var uv = new THREE.BufferAttribute(new Float32Array(8),2);
    uv.setXY(0,0,0);
    uv.setXY(1,0,0);
    uv.setXY(2,1,1);
    uv.setXY(3,1,1);
    geometry.addAttribute( 'uv',uv )
    
    var material = new THREE.ShaderMaterial({
      vertexShader:   require('../../shaders/gradient/gradient.vert'),
      fragmentShader: require('../../shaders/gradient/gradient.frag'),
      defines:{THREE_JS:true},
      uniforms:{
        color1: {value: new THREE.Vector3(0.360784314, 0.584313725, 1.0)},
        color2: {value: new THREE.Vector3(0.074509804, 0.156862745, 0.619607843)}
      }
    });

    this.el.setObject3D('mesh',new THREE.Mesh(geometry, material));
  }
}

export {gradient};

/* global AFRAME */
/*
AFRAME.registerShader('skyGradient', {
  schema: {
    colorTop: { type: 'color', default: 'black', is: 'uniform' },
    colorBottom: { type: 'color', default: 'red', is: 'uniform' }
  },

  vertexShader: [
    'varying vec3 vWorldPosition;',

    'void main() {',

      'vec4 worldPosition = modelMatrix * vec4( position, 1.0 );',
      'vWorldPosition = worldPosition.xyz;',

      'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

    '}'

  ].join('\n'),

  fragmentShader: [
    'uniform vec3 colorTop;',
    'uniform vec3 colorBottom;',

    'varying vec3 vWorldPosition;',

    'void main()',

    '{',
      'vec3 pointOnSphere = normalize(vWorldPosition.xyz);',
      'float f = 1.0;',
      'if(pointOnSphere.y > - 0.2){',

        'f = sin(pointOnSphere.y * 2.0);',

      '}',
      'gl_FragColor = vec4(mix(colorBottom,colorTop, f ), 1.0);',

    '}'
  ].join('\n')
});


/* The original gradient 

var gradient = {
  init(){
    var shaders = {
      VS:[
      "varying vec2 uv2;",

      "void main()",
      "{",
          "uv2 = uv;",
          "gl_Position = vec4(position.x,position.y,1., 1.0);",
      "}"].join('\n'),
      FS:[
      "precision mediump float;",

      "uniform vec3 color1;",
      "uniform vec3 color2;",

      "varying vec2 uv2;",

      "void main()",
      "{",
          "vec3 color = mix(color1, color2, uv2.x * uv2.y);",
          "gl_FragColor = vec4(color,1.);",
      "}"].join('\n')
    }
    var gradient = new ThreeGradient({shaders:shaders});
    this.el.setObject3D('mesh',gradient.mesh);
  }
}
*/
/* This is a test */




