'use strict';
import {DEPTH_MAP} from '../../../data/const.js'
import {DepthMapProgram} from '../../../util/util.js'
import {Program} from './program'

class Depth extends Program{
	constructor(renderer,scene,camera){
		super(renderer,scene,camera)
		this.depthMapProgram = new DepthMapProgram();
	}
	compute(rt){
		this.scene.overrideMaterial = this.depthMapProgram.depthMapProgramMaterial;

		this.depthMapProgram.depthMapProgramUniforms["smoothstepHigh"].value = DEPTH_MAP.smoothstepHigh
		this.depthMapProgram.depthMapProgramUniforms["smoothstepLow"].value = DEPTH_MAP.smoothstepLow
		this.depthMapProgram.depthMapProgramUniforms["near"].value = DEPTH_MAP.near
		this.depthMapProgram.depthMapProgramUniforms["far"].value = DEPTH_MAP.far

		this.computeDepthMapSide(rt)
	}
	computeDepthMapSide(target){
		let renderer = this.renderer;
		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = target.depthTexture;
		renderer.render( this.scene, this.camera, target.rtDepthMap,true ); 
	}
	
}

export {Depth};