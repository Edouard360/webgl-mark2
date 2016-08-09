'use strict';
/* global AFRAME */
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


/* The gradient shaders rearranged for VR - Attempt not finished */
/*
AFRAME.registerShader("gradient",{
	schema:{
		color1: {type: 'vec3', default: '1.0 0.0 0.0', is: 'uniform'},
		color2: {type: 'vec3', default: '0.0 0.0 0.0', is: 'uniform'}
	},
	vertexShader: [
	//'attribute vec2 uvIn;',
	'varying vec3 pos;',
	'void main()',
	'{',
	    'pos = position;',
	    'gl_Position =  projectionMatrix * modelViewMatrix * vec4(position,1.0);',
	'}'
	].join('\n'),
	fragmentShader: [
	'precision mediump float;',
	'uniform vec3 color1;',
	'uniform vec3 color2;',
	'varying vec3 pos;',
	'void main()',
	'{',
	    //'vec3 color = mix(color1, color2, uv2.x * uv2.y);',
	    'gl_FragColor = vec4(pos,1.);//vec4(color1 + color2,1.);',
	'}'].join('\n')
})
*/