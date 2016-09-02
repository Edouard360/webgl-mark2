/**
 * The godraysProgram data - uniforms, vertexShader, fragmentShader
 */

const godraysProgram = {
		uniforms:{
			tInput:{
				value: null
			},
			vSunPositionScreenSpace:{
				type:"f",
				value: new THREE.Vector2( 0.5, 0.5 )
			},
			smoothstepHigh:{
				type:"f",
				value: 1.0
			},
			smoothstepLow:{
				type:"f",
				value: 0.0
			},
			density:{
				type:"f",
				value: 1.0
			},
			weight:{
				type:"f",
				value: 0.01
			},
			decay:{
				type:"f",
				value: 1.0
			},
			exposure:{
				type:"f",
				value: 1.0
			},
			numSamples:{
				type: "i",
				value: 200
			}
		},
		vertexShader: require("./godraysShader.vert"),
		fragmentShader: require("./godraysShader.frag")

};

class GodraysProgram{
	constructor() {
		this.godraysProgramUniforms = THREE.UniformsUtils.clone( godraysProgram.uniforms );
		this.godraysProgramMaterial = new THREE.ShaderMaterial( {
			uniforms: this.godraysProgramUniforms,
			vertexShader: godraysProgram.vertexShader,
			fragmentShader: godraysProgram.fragmentShader
		});
	}
}

export {GodraysProgram}
