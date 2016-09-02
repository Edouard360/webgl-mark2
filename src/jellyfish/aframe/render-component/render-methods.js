'use strict';
import {fovToProjection} from '../../../util/util.js'

var methods = {
	initializeTargets:function(){
		let parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		this.rtLeft = new THREE.WebGLRenderTarget( 1, 1, parameters );
	
		this.rtLeft.texture.generateMipmaps = false;
        this.rtLeft.stencilBuffer = false;
        this.rtLeft.depthBuffer = true;
		this.rtLeft.depthTexture = new THREE.DepthTexture();
		this.rtLeft.depthTexture.type = THREE.UnsignedShortType;

		this.rtLeft.rtDepthMap = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtLeft.rtGodrays = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtLeft.rtGlow = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtLeft.rtGlowTmp = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtLeft.rtBlend = new THREE.WebGLRenderTarget( 1, 1, parameters );

		this.rtRight = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtRight.texture.generateMipmaps = false;
        this.rtRight.stencilBuffer = false;
        this.rtRight.depthBuffer = true;
		
		this.rtRight.depthTexture = new THREE.DepthTexture();
		this.rtRight.depthTexture.type = THREE.UnsignedShortType;
		this.rtRight.rtDepthMap = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtRight.rtGodrays = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtRight.rtGlow = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtRight.rtGlowTmp = new THREE.WebGLRenderTarget( 1, 1, parameters );
		this.rtRight.rtBlend = new THREE.WebGLRenderTarget( 1, 1, parameters );
	},
	/** The setTargetsSize function
	 */
	setTargetsSize(){
		let renderer = this.el.renderer;
		let dpr = this.dpr = renderer.getPixelRatio();
		renderer.setClearColor("#ffffff")
		
		let wL = this.renderRect.left.width*dpr
		let hL = this.renderRect.left.height*dpr
		let wR = this.renderRect.left.width*dpr
		let hR = this.renderRect.left.height*dpr

		this.rtLeft.setSize(wL,hL);
		this.rtLeft.rtDepthMap.setSize(wL,hL);
		this.rtLeft.rtGodrays.setSize(wL,hL);
		this.rtLeft.rtGlow.setSize(wL,hL);
		this.rtLeft.rtGlowTmp.setSize(wR,hR);
		this.rtLeft.rtBlend.setSize(wL,hL);

		this.rtRight.setSize(wR,hR);
		this.rtRight.rtDepthMap.setSize(wR,hR);
		this.rtRight.rtGodrays.setSize(wR,hR);
		this.rtRight.rtGlow.setSize(wR,hR);
		this.rtRight.rtGlowTmp.setSize(wR,hR);
		this.rtRight.rtBlend.setSize(wR,hR);

		renderer.setViewport(0,0,wL,hL);
		renderer.setScissorTest( false );
	},
	updateSize(){
		let leftBounds = [ 0.0, 0.0, 0.5, 1.0 ]; 
		let rightBounds = [ 0.5, 0.0, 0.5, 1.0 ];
		var size = this.el.renderer.getSize();

		this.renderRect = {
			left:{
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height:  Math.round(size.height * leftBounds[ 3 ] )
			},
			right:{
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height:  Math.round(size.height * rightBounds[ 3 ] )
			}
		}
	},
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