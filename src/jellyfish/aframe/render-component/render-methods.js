'use strict';
import {MixerProgram,GodraysProgram,GlowProgram,DepthMapProgram,fovToProjection} from '../../../util/util.js'
import {BLEND,SKY} from '../../../data/const.js'
import dat from '../../../../node_modules/dat.gui/build/dat.gui'

var methods = {
	/** The initializeMerge function - Sets a simple scene for post-processing
	 */
	initializeSceneMerge: function(){
		let width = 400;
		let height = 400;

		this.sceneMerge = new THREE.Scene();

		this.cameraMerge = new THREE.OrthographicCamera( width / - 2, width / 2,  height / 2, height / - 2, -10000, 10000 );
		this.cameraMerge.position.z = 100;

		this.sceneMerge.add( this.cameraMerge );
		this.material = new THREE.MeshBasicMaterial();

		let quad = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( width, height ),
			this.material
		);

		quad.position.z = -9900;

		this.sceneMerge.add( quad );
		this.sceneMerge.overrideMaterial = this.material;

	},
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
	/** The renderMerge function - 
	 * @param {WebGLRenderTarget} renderTargetL - Size renderRectL.width * renderRectL.height
	 * @param {Object} renderRectL - x,y,width,height
	 * @param {WebGLRenderTarget} renderTargetR - Size renderRectR.width * renderRectR.height
	 * @param {Object} renderRectR - x,y,width,height
	 */
	renderMerge:function(renderTargetL, renderRectL, renderTargetR, renderRectR){
		let renderer = this.el.renderer;

		if(this.sceneMerge == undefined){this.initializeSceneMerge();}
		renderer.setScissorTest( true );

		// Left Render
		this.material.map = renderTargetL.texture;
		renderer.setViewport( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
		renderer.setScissor( renderRectL.x, renderRectL.y, renderRectL.width, renderRectL.height );
		renderer.render( this.sceneMerge, this.cameraMerge);

		// Right Render
		this.material.map = renderTargetR.texture;
		renderer.setViewport( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
		renderer.setScissor( renderRectR.x, renderRectR.y, renderRectR.width, renderRectR.height );
		renderer.render( this.sceneMerge, this.cameraMerge);
	},
	initializeCameras:function(){
		this.cameraL = new THREE.PerspectiveCamera();
		this.cameraL.layers.enable( 1 );
		this.cameraR = new THREE.PerspectiveCamera();
		this.cameraR.layers.enable( 2 );
		this.eyeTranslationL = new THREE.Vector3();
		this.eyeTranslationR = new THREE.Vector3();
	},
	renderRight:function(scene, camera, renderTargetR, forceClear){
		let renderer = this.el.renderer;
		let vrDisplay = this.el.effect.getVRDisplay();
		if(vrDisplay==undefined){renderer.render( scene, camera, renderTargetR, forceClear );return;}
		let eyeParamsR = vrDisplay.getEyeParameters( 'right' );
		let eyeTranslationR = this.eyeTranslationR

		let cameraR = this.cameraR;
		let scale = 1, isWebVR1 = true;

		if ( isWebVR1 ) {
			eyeTranslationR.fromArray( eyeParamsR.offset );
			this.eyeFOVR = eyeParamsR.fieldOfView;
		} else {
			eyeTranslationR.copy( eyeParamsR.eyeTranslation );
			this.eyeFOVR = eyeParamsR.recommendedFieldOfView;
		}

		if ( camera.parent === null ) camera.updateMatrixWorld();

		cameraR.projectionMatrix = fovToProjection( this.eyeFOVR, true, camera.near, camera.far );
		camera.matrixWorld.decompose( cameraR.position, cameraR.quaternion, cameraR.scale );
		cameraR.translateOnAxis( eyeTranslationR, scale );

		renderer.render( scene, cameraR, renderTargetR, forceClear );
	},
	renderLeft:function(scene, camera, renderTargetL, forceClear){
		let renderer = this.el.renderer;
		let vrDisplay = this.el.effect.getVRDisplay();
		if(vrDisplay==undefined){renderer.render( scene, camera, renderTargetL, true );return;}
		let eyeParamsL = vrDisplay.getEyeParameters( 'left' );
		let eyeTranslationL = this.eyeTranslationL

		let cameraL = this.cameraL;
		let scale = 1, isWebVR1 = true;

		if ( isWebVR1 ) {
			eyeTranslationL.fromArray( eyeParamsL.offset );
			this.eyeFOVL = eyeParamsL.fieldOfView;
		} else {
			eyeTranslationL.copy( eyeParamsL.eyeTranslation );
			this.eyeFOVL = eyeParamsL.recommendedFieldOfView;
		}

		if ( camera.parent === null ) camera.updateMatrixWorld();

		cameraL.projectionMatrix = fovToProjection( this.eyeFOVL, true, camera.near, camera.far );
		camera.matrixWorld.decompose( cameraL.position, cameraL.quaternion, cameraL.scale );
		cameraL.translateOnAxis( eyeTranslationL, scale );

		renderer.render( scene, cameraL, renderTargetL, forceClear );
	},
	renderToTargets(scene,camera){
		this.renderLeft(scene,camera,this.rtLeft, true);
		this.renderRight(scene,camera,this.rtRight, true);
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
	}
}

export {methods};