'use strict';
var sky = {
	schema: {
		colorTop: { type: 'color', default: '#5C95FF', is: 'uniform' },
		colorBottom: { type: 'color', default: '#182FA4', is: 'uniform' },
		sunColor: {type: 'color', default: 'yellow', is: 'uniform'},
		vSunPosition: {default:{x:0,y:10,z:-4}, is: 'uniform'}
	},
	vertexShader: require('../../shaders/gradient/sky.vert'),
	fragmentShader:require('../../shaders/gradient/sky.frag')
}

export {sky};