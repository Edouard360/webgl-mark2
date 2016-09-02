'use strict';
var computeBlend = {
	computeBlend(){
		this.scene.overrideMaterial = this.mixerProgram.mixerProgramMaterial;
		this.computeBlendSide(this.rtLeft)
		this.computeBlendSide(this.rtRight)
	},
	computeBlendSide(side){
		let renderer = this.el.renderer;
		this.mixerProgram.mixerProgramUniforms["tColors"].value = side.texture;
		this.mixerProgram.mixerProgramUniforms["tGodrays"].value = side.rtGodrays.texture;
		this.mixerProgram.mixerProgramUniforms["tGlow"].value = side.rtGlow.texture;
		renderer.render( this.scene, this.camera, side.rtBlend );
	}
}

export {computeBlend};