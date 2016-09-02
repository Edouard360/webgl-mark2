'use strict';
import {MixerProgram,GodraysProgram,GlowProgram,DepthMapProgram,fovToProjection} from '../../../util/util.js'
import {BLEND,SKY} from '../../../data/const.js'
import dat from '../../../../node_modules/dat.gui/build/dat.gui'
import {methods} from './render-methods'

var render = {
	init:function(){

		this.initializeTargets();
		this.initializeSceneMerge();
		this.initializeCameras();
		this.initializePostprocessing();

		this.mixerProgram.mixerProgramUniforms.fGodraysIntensity.value = BLEND.fGodraysIntensity;
		this.mixerProgram.mixerProgramUniforms.fGlowIntensity.value = BLEND.fGlowIntensity;

		var gui = new dat.GUI({})

		gui.add(this.mixerProgram.mixerProgramUniforms.fGodraysIntensity, 'value',0,3).name("GodraysIntensity")
		gui.add(this.mixerProgram.mixerProgramUniforms.fGlowIntensity, 'value',0,3).name("GlowIntensity")

		this.el.render = (time)=>{
			var timeDelta = time - this.el.time;
			let scene = this.el.object3D;
			let camera = this.el.camera;
			
			if (this.el.isPlaying) { this.el.tick(time, timeDelta); }

			this.updateSize();
			this.setTargetsSize();this.rtLeft.setSize(window.innerWidth,window.innerHeight)
			this.renderToTargets(scene,camera,this.renderRect.left,this.renderRect.right)
	
			this.computeDepthMap();
			this.computeGodRays();
			this.computeGlow();
			this.computeBlend();

			this.renderMerge(this.rtLeft.rtBlend,this.renderRect.left,this.rtRight.rtBlend,this.renderRect.right);
			this.el.effect.submitFrame();

			/*
			this.sceneTest.overrideMaterial = this.mixerProgram.mixerProgramMaterial;

			this.mixerProgram.mixerProgramUniforms["tColors"].value = this.rtTextureColors.texture;
			this.mixerProgram.mixerProgramUniforms["tGodrays"].value = this.rtTextureGodrays.texture;
			this.mixerProgram.mixerProgramUniforms["tGlow"].value = this.rtTextureGlow.texture;

			this.el.effect.render(this.sceneTest, this.camera);
			this.el.effect.render(scene, camera);
			*/

			

			this.el.time = time;
			this.el.animationFrameID = window.requestAnimationFrame(this.el.render);
		}

	},
	/**
	 * The initializePostprocessing function.
	 * this.scene will be the scene used for post-processing
	 * this.camera for post-processing scene
	 */
	initializePostprocessing(){
		this.scene = new THREE.Scene();
		this.sceneTest = new THREE.Scene();

		let w = window.innerWidth;
		let h = window.innerHeight;

		this.camera = new THREE.OrthographicCamera( w / - 2, w / 2,  h / 2, h / - 2, -10000, 10000 );
		this.camera.position.z = 100;

		this.scene.add( this.camera );
		this.sceneTest.add( this.camera );

		let parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		this.rtTextureColors = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtTextureColors.texture.generateMipmaps = false;
        this.rtTextureColors.stencilBuffer = false;
        this.rtTextureColors.depthBuffer = true;
		this.rtTextureColors.depthTexture = new THREE.DepthTexture();

		this.rtTextureGlow = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtTextureGlow2 = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtTextureGodrays = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtDepthMap = new THREE.WebGLRenderTarget( w, h, parameters );

		// program initilization
		this.godraysProgram = new GodraysProgram();
		this.glowProgram = new GlowProgram();
		this.depthMapProgram = new DepthMapProgram();

		this.mixerProgram = new MixerProgram();
		this.mixerProgram.mixerProgramUniforms.fGodraysIntensity.value = 0.75;

		let quad = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( w, h ),
			this.materialGodraysGenerate
		);

		let quadTest = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( w, h ),
			this.materialGodraysGenerate
		);
		quad.position.z = -9900;
		quadTest.position.z = -9900;
		this.scene.add( quad );
		this.sceneTest.add( quadTest );
	},
	computeDepthMap(){
		let renderer = this.el.renderer;
		this.scene.overrideMaterial = this.depthMapProgram.depthMapProgramMaterial;

		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = this.rtLeft.depthTexture;
		renderer.render( this.scene, this.camera, this.rtLeft.rtDepthMap,true );

		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = this.rtRight.depthTexture;
		renderer.render( this.scene, this.camera, this.rtRight.rtDepthMap,true ); 
	},
	computeGodRays(){
		let renderer = this.el.renderer;	
		this.scene.overrideMaterial = this.godraysProgram.godraysProgramMaterial;
		
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
	computeGlow(){
		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.computeGlowSide(this.rtLeft);
		this.computeGlowSide(this.rtRight);
	},
	computeGlowSide(side){
		let renderer = this.el.renderer;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = side.rtDepthMap.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(8.0, 0.0)
		renderer.render( this.scene, this.camera, side.rtGlow  );

		this.glowProgram.glowProgramUniforms[ "tInput" ].value = side.rtGlow.texture;
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(4.0, 0.0)
		renderer.render( this.scene, this.camera, side.rtGlowTmp  );

		this.glowProgram.glowProgramUniforms[ "tInput" ].value =  side.rtGlowTmp.texture ;
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(2.0, 0.0)
		renderer.render( this.scene, this.camera, side.rtGlow  );

		this.glowProgram.glowProgramUniforms[ "tInput" ].value = side.rtGlow.texture;
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(0.0, 8.0)
		renderer.render( this.scene, this.camera, side.rtGlowTmp  );

		this.glowProgram.glowProgramUniforms[ "tInput" ].value = side.rtGlowTmp.texture;
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(0.0, 4.0)
		renderer.render( this.scene, this.camera, side.rtGlow  );
	},
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

Object.assign(render,methods);

export {render};