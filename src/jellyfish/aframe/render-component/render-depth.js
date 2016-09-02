'use strict';
import {DEPTH_MAP} from '../../../data/const.js'

var computeDepthMap = {
	computeDepthMap(){
		let renderer = this.el.renderer;
		this.scene.overrideMaterial = this.depthMapProgram.depthMapProgramMaterial;

		this.depthMapProgram.depthMapProgramUniforms["smoothstepHigh"].value = DEPTH_MAP.smoothstepHigh
		this.depthMapProgram.depthMapProgramUniforms["smoothstepLow"].value = DEPTH_MAP.smoothstepLow
		this.depthMapProgram.depthMapProgramUniforms["near"].value = DEPTH_MAP.near
		this.depthMapProgram.depthMapProgramUniforms["far"].value = DEPTH_MAP.far

		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = this.rtLeft.depthTexture;
		renderer.render( this.scene, this.camera, this.rtLeft.rtDepthMap,true );

		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = this.rtRight.depthTexture;
		renderer.render( this.scene, this.camera, this.rtRight.rtDepthMap,true ); 
	}
}

export {computeDepthMap};