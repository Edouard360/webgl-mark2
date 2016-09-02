'use strict';
import {fovToProjection} from '../../../util/util.js'

var methods = {
	initializeCameras:function(){
		let camera = this.el.camera
		this.cameraL = camera.clone();
		this.cameraR = camera.clone();
		this.cameraL.layers.enable( 1 );
		this.cameraR.layers.enable( 2 );
		this.eyeTranslation = new THREE.Vector3();
	},
	updateCameras(){
		this.updateCamera('left');
		this.updateCamera('right');
	},
	updateCamera(side){
		let vrDisplay = this.el.effect.getVRDisplay();
		if(vrDisplay==undefined){return;}
		let eyeTranslation = this.eyeTranslation

		let scale = 1, isWebVR1 = true;
		let eyeParams = vrDisplay.getEyeParameters(side);
		if ( isWebVR1 ) {
			eyeTranslation.fromArray( eyeParams.offset );
			eyeFOV = eyeParams.fieldOfView;
		} else {
			eyeTranslation.copy( eyeParams.eyeTranslation );
			eyeFOV = eyeParams.recommendedFieldOfView;
		}

		if ( camera.parent === null ) camera.updateMatrixWorld();

		let cameraSide = (side == "left")?this.cameraL:this.cameraR;

		cameraSide.projectionMatrix = fovToProjection( eyeFOV, true, camera.near, camera.far );
		camera.matrixWorld.decompose( cameraSide.position, cameraSide.quaternion, cameraSide.scale );
		cameraSide.translateOnAxis( eyeTranslation, scale );
	}
}

export {methods};