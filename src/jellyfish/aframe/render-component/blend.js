'use strict';
import {MixerProgram} from '../../../util/util.js'
import {BLEND} from '../../../data/const.js'
import {Program} from './program'

class Blend extends Program{
	constructor(renderer,scene,camera){
		super(renderer,scene,camera)
		this.mixerProgram = new MixerProgram();
		this.mixerProgram.mixerProgramUniforms.fGodraysIntensity.value = BLEND.fGodraysIntensity;
		this.mixerProgram.mixerProgramUniforms.fGlowIntensity.value = BLEND.fGlowIntensity;

	}
	computeBlend(rtLeft,rtRight){
		this.scene.overrideMaterial = this.mixerProgram.mixerProgramMaterial;
		this.computeBlendSide(rtLeft)
		this.computeBlendSide(rtRight)
	}
	computeBlendSide(target){
		let renderer = this.renderer;
		this.mixerProgram.mixerProgramUniforms["tColors"].value = target.texture;
		this.mixerProgram.mixerProgramUniforms["tGodrays"].value = target.rtGodrays.texture;
		this.mixerProgram.mixerProgramUniforms["tGlow"].value = target.rtGlow.texture;
		renderer.render( this.scene, this.camera, target.rtBlend );
	}
}

export {Blend};
