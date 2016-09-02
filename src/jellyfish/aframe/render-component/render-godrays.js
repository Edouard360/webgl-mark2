'use strict';
import {SKY,GODRAYS} from '../../../data/const.js'

var computeGodRays = {
	computeGodRays(){
		let renderer = this.el.renderer;	
		this.scene.overrideMaterial = this.godraysProgram.godraysProgramMaterial;
		this.godraysProgram.godraysProgramUniforms["smoothstepHigh"].value = GODRAYS.smoothstepHigh
		this.godraysProgram.godraysProgramUniforms["smoothstepLow"].value = GODRAYS.smoothstepLow
		this.godraysProgram.godraysProgramUniforms["density"].value = GODRAYS.density
		this.godraysProgram.godraysProgramUniforms["weight"].value = GODRAYS.weight
		this.godraysProgram.godraysProgramUniforms["decay"].value = GODRAYS.decay
		this.godraysProgram.godraysProgramUniforms["exposure"].value = GODRAYS.exposure
		this.godraysProgram.godraysProgramUniforms["numSamples"].value = GODRAYS.numSamples
		
		if(this.positionSun(this.cameraL)){ //this.el.camera : Otherwise not updated !
			this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtLeft.rtDepthMap;
			renderer.render( this.scene, this.camera, this.rtLeft.rtGodrays );
		}else{
			renderer.clearTarget( this.rtLeft.rtGodrays, true,true,true );
		}
	
		if(this.positionSun(this.cameraR)){
			this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtRight.rtDepthMap;
			renderer.render( this.scene, this.camera, this.rtRight.rtGodrays ); 
		}else{
			renderer.clearTarget( this.rtRight.rtGodrays, true,true,true );
		}
	},
	positionSun(camera){
		let sunPosition = new THREE.Vector3(
				SKY.distance * Math.cos( SKY.phi ),
				SKY.distance * Math.sin( SKY.phi ) * Math.sin( SKY.theta ),
				SKY.distance * Math.sin( SKY.phi ) * Math.cos( SKY.theta )
			)
		let screenSpacePosition = new THREE.Vector3();
		
		screenSpacePosition.copy(sunPosition).project(camera);

		screenSpacePosition.x = ( screenSpacePosition.x + 1 ) / 2;
		screenSpacePosition.y = ( screenSpacePosition.y + 1 ) / 2;

		this.godraysProgram.godraysProgramUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
		this.godraysProgram.godraysProgramUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;
		return screenSpacePosition.x > 0 && screenSpacePosition.y > 0

	}
}

export {computeGodRays};