/**
 * The glowProgram data - uniforms, vertexShader, fragmentShader
 */

const glowProgram = {

		uniforms: {

			tInput: {
				value: null
			},
			fStepSize: {
				value: 1.0
			},
			iResolution: {
				value: new THREE.Vector2(window.innerwidth, window.innerheight)
			},
			direction: {
				value: new THREE.Vector2(8.0, 0.0)
			}

		},
		vertexShader: require("./glowShader.vert"),
		fragmentShader: require("./glowShader.frag")

};

class GlowProgram{
	constructor() {
		this.glowProgramUniforms = THREE.UniformsUtils.clone( glowProgram.uniforms );
		this.glowProgramMaterial = new THREE.ShaderMaterial( {
			uniforms: this.glowProgramUniforms,
			vertexShader: glowProgram.vertexShader,
			fragmentShader: glowProgram.fragmentShader
		});
	}
}

export {GlowProgram}
