'use strict';
import {SKY} from '../../data/const.js'
var sky = {
	schema: {
		colorTop: { type: 'color', default: '#5C95FF', is: 'uniform' },
		colorBottom: { type: 'color', default: '#182FA4', is: 'uniform' },
		sunColor: {type: 'color', default: '#FFFFB3', is: 'uniform'},
		sunPosition: {
			default:new THREE.Vector3(
				SKY.distance * Math.cos( SKY.phi ),
				SKY.distance * Math.sin( SKY.phi ) * Math.sin( SKY.theta ),
				SKY.distance * Math.sin( SKY.phi ) * Math.cos( SKY.theta )
			),
			is: 'uniform'},
		// New Uniforms
		luminance: { default: SKY.luminance, is: 'uniform' },
		turbidity: { default: SKY.turbidity, is: 'uniform' },
		reileigh: { default: SKY.reileigh, is: 'uniform' },
		mieCoefficient: { default: SKY.mieCoefficient, is: 'uniform' },
		mieDirectionalG: { default: SKY.mieDirectionalG, is: 'uniform' },
		sunSize: { default:SKY.sunSize, is: 'uniform'}
	},
	vertexShader: require('../../shaders/sky/sky.vert'),
	fragmentShader:require('../../shaders/sky/sky.frag')
}

export {sky};