import ThreeGradient from '../ThreeJS/ThreeGradient.js'

'use strict';
var gradient = {
  init(){
    var shaders = {
      VS:require('../../shaders/gradient/gradient-Three.vert'),
      FS:require('../../shaders/gradient/gradient-Three.frag')
    }
    var gradient = new ThreeGradient({shaders:shaders});
    this.el.setObject3D('mesh',gradient.mesh);
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




