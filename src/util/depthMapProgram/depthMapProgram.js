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
