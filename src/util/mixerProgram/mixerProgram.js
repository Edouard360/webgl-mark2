/**
 * The mixerProgram data - uniforms, vertexShader, fragmentShader
 */

const mixerProgram = {

	/**
	 * Additively applies god rays from texture tEffect to a background (tColors).
	 * fIntensity attenuates the god rays.
	 */

		uniforms: {

			tColors: {
				value: null
			},

			tGodrays: {
				value: null
			},

			tGlow: {
				value: null
			},

			fGodraysIntensity: {
				value: 0.69
			},

			fGodraysAmbient: {
				value: 0.8
			},

			fGlowIntensity:{
				value: 0.5
			}

		},

		vertexShader: require("./mixerShader.vert"),
		fragmentShader: require("./mixerShader.frag")

};

class MixerProgram{
	constructor() {
		this.mixerProgramUniforms = THREE.UniformsUtils.clone( mixerProgram.uniforms );
		this.mixerProgramMaterial = new THREE.ShaderMaterial( {
			uniforms: this.mixerProgramUniforms,
			vertexShader: mixerProgram.vertexShader,
			fragmentShader: mixerProgram.fragmentShader
		});
	}
}

export {MixerProgram}
