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

			tEffect: {
				value: null
			},

			fIntensity: {
				value: 0.69
			},

			fAmbient: {
				value: 0.8
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
