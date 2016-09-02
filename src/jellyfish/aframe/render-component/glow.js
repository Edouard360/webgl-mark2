'use strict';
import {GlowProgram} from '../../../util/util.js'

class Glow{
	constructor(renderer,scene,camera){
		this.glowProgram = new GlowProgram();
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
	}
	computeGlow(rtLeft,rtRigth){
		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.computeGlowSide(rtLeft);
		this.computeGlowSide(rtRigth);
	}
	computeGlowSide(target){
		let renderer = this.renderer;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = target.rtDepthMap.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(8.0, 0.0)

		renderer.render( this.scene, this.camera, target.rtGlow  );

		this.computeGlowWithUniforms(target, new THREE.Vector2(4.0, 0.0), 2)
		this.computeGlowWithUniforms(target, new THREE.Vector2(0.0, 2.0), 3)
		this.computeGlowWithUniforms(target, new THREE.Vector2(0.0, 8.0), 4)
		this.computeGlowWithUniforms(target, new THREE.Vector2(0.0, 4.0), 5)
	}
	computeGlowWithUniforms(target, direction, passNumber){
		let renderer = this.renderer;
		let txt = (passNumber%2==0)? target.rtGlow.texture : target.rtGlowTmp.texture;
		let rt = (passNumber%2==0)? target.rtGlowTmp : target.rtGlow;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = txt;
		this.glowProgram.glowProgramUniforms["direction"].value = direction;
		renderer.render( this.scene, this.camera, rt);
	}
}

export {Glow};