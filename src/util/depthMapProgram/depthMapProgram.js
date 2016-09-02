/**
 * The depthMapProgram data - uniforms, vertexShader, fragmentShader
 */

const depthMapProgram = {

	/**
	 * Additively applies god rays from texture tEffect to a background (tColors).
	 * fIntensity attenuates the god rays.
	 */

		uniforms: {

			tInput: {
				value: null
			},
			near:{
				value: 50.0
			},
			far:{
				value: 0.1
			},
			/*
			 * smoothstepHigh and smoothstepLow help constrasting the depthMap
			 * 0.2 -> 0
			 * 0.8 -> 1
			 */
			smoothstepHigh:{
				value: 0.8
			},
			smoothstepLow:{
				value: 0.2
			}
		},

		vertexShader: require("./depthMapShader.vert"),
		fragmentShader: require("./depthMapShader.frag")

};

class DepthMapProgram{
	constructor() {
		this.depthMapProgramUniforms = THREE.UniformsUtils.clone( depthMapProgram.uniforms );
		this.depthMapProgramMaterial = new THREE.ShaderMaterial( {
			uniforms: this.depthMapProgramUniforms,
			vertexShader: depthMapProgram.vertexShader,
			fragmentShader: depthMapProgram.fragmentShader
		});
	}
}

export {DepthMapProgram}
