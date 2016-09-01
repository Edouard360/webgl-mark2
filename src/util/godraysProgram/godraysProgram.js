/**
 * The godraysProgram data - uniforms, vertexShader, fragmentShader
 */

const godraysProgram = {

		uniforms: {

			tInput: {
				value: null
			},
			fStepSize: {
				value: 1.0
			},
			vSunPositionScreenSpace: {
				value: new THREE.Vector2( 0.5, 0.5 )
			},
			firstPass:{
				value:true
			}

		},
		vertexShader: require("./godraysShader.vert"),
		fragmentShader: require("./godraysShader2.frag")

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
