'use strict';
var sky = {
	schema: {
		colorTop: { type: 'color', default: '#5C95FF', is: 'uniform' },
		colorBottom: { type: 'color', default: '#182FA4', is: 'uniform' }
	},
	vertexShader: require('../../shaders/gradient/sky.vert'),
	fragmentShader:require('../../shaders/gradient/sky.frag')
}

export {sky};