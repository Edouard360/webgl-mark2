'use strict';
import {MixerProgram,GodraysProgram,GlowProgram,DepthMapProgram} from '../../util/util.js'
import dat from '../../../node_modules/dat.gui/build/dat.gui'


var render = {
	init:function(){

		this.initializePostprocessing();

		this.mixerProgram.mixerProgramUniforms.fGodraysIntensity.value = 0.66;
		this.mixerProgram.mixerProgramUniforms.fGodraysAmbient.value = 0.43;

		var gui = new dat.GUI()

		gui.add(this.mixerProgram.mixerProgramUniforms.fGodraysIntensity, 'value',0,5).name("Intensity")
		gui.add(this.mixerProgram.mixerProgramUniforms.fGodraysAmbient, 'value',0,5).name("Ambient")

		this.el.render = (time)=>{
			var timeDelta = time - this.el.time;
			let scene = this.el.object3D;
			let camera = this.el.camera;
			
			if (this.el.isPlaying) { this.el.tick(time, timeDelta); }

			
			this.el.effect.render(scene, camera, this.rtTextureColors);
			this.computeGodRays();
			this.computeDepthMap();
			this.computeGlow();

			this.sceneTest.overrideMaterial = this.mixerProgram.mixerProgramMaterial;

			this.mixerProgram.mixerProgramUniforms["tColors"].value = this.rtTextureColors.texture;
			this.mixerProgram.mixerProgramUniforms["tGodrays"].value = this.rtTextureGodrays.texture;
			this.mixerProgram.mixerProgramUniforms["tGlow"].value = this.rtTextureGlow.texture;

			this.el.effect.render(this.sceneTest, this.camera);

			this.sceneTest.overrideMaterial  = null;


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

		this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
		this.camera.position.z = 100;

		this.scene.add( this.camera );
		this.sceneTest.add( this.camera );
		
		//this.ext = this.el.renderer.extensions.get('WEBGL_depth_texture'); //(NOT NEEDED ??)
		//this.ext2 = this.el.renderer.extensions.get('EXT_frag_depth '); //(NOT SUPPORTED ??)
		//var ext = this.el.renderer.context;
		//.getExtension("EXT_frag_depth")
		//debugger;
		//this.ext = this.el.renderer.extensions
		//EXT_frag_depth : is a WebGL extension
		//THREE.UNSIGNED_INT_24_8_WEBGL = this.ext.UNSIGNED_INT_24_8_WEBGL
		//debugger;


		//this.ext.UNSIGNED_INT_24_8_WEBGL;

		let w = window.innerWidth;
		let h = window.innerHeight;

		let parameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		this.rtTextureColors = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtTextureColors.texture.generateMipmaps = false;
        this.rtTextureColors.stencilBuffer = false;
        this.rtTextureColors.depthBuffer = true;
		this.rtTextureColors.depthTexture = new THREE.DepthTexture();

		//this.rtTextureColors.depthTexture.type = this.ext.UNSIGNED_INT_24_8_WEBGL;
		// var ext = this.el.renderer.extensions.get("WEBGL_depth_texture");
		// var context = this.el.renderer.getContext()
		// var extensions = context.getSupportedExtensions()
		// var ext2 = context.getExtension("WEBGL_depth_texture")
		// //.getAvailableExtensions();
		// debugger;
		// var ext2 = this.el.renderer.context.getAvailableExtensions();//.get("WEBGL_depth_texture");


		// this.rtTextureColors.depthTexture.type = ext.UNSIGNED_INT_24_8_WEBGL;




		this.rtTextureColors2 = new THREE.WebGLRenderTarget( w, h, parameters );
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
			new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight ),
			this.materialGodraysGenerate
		);

		let quadTest = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( window.innerWidth, window.innerHeight ),
			this.materialGodraysGenerate
		);
		quad.position.z = -9900;
		quadTest.position.z = -9900;
		this.scene.add( quad );
		this.sceneTest.add( quadTest );
	},
	computeGodRays(){	
		this.positionSun();
		this.scene.overrideMaterial = this.godraysProgram.godraysProgramMaterial;
		this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtTextureColors.depthTexture;
		this.el.effect.render( this.scene, this.camera, this.rtTextureGodrays );
	},
	computeDepthMap(){
		this.scene.overrideMaterial = this.depthMapProgram.depthMapProgramMaterial;
		this.depthMapProgram.depthMapProgramUniforms["tInput"].value = this.rtTextureColors.depthTexture;
		this.el.effect.render( this.scene, this.camera, this.rtDepthMap );
	},
	computeGlow(){
		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = this.rtDepthMap.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(8.0, 0.0)
		this.el.effect.render( this.scene, this.camera, this.rtTextureGlow  );

		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = this.rtTextureGlow.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(4.0, 0.0)
		this.el.effect.render( this.scene, this.camera, this.rtTextureGlow2  );

		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = this.rtTextureGlow2.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(2.0, 0.0)
		this.el.effect.render( this.scene, this.camera, this.rtTextureGlow  );

		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = this.rtTextureGlow.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(0.0, 8.0)
		this.el.effect.render( this.scene, this.camera, this.rtTextureGlow2  );

		this.scene.overrideMaterial = this.glowProgram.glowProgramMaterial;
		this.glowProgram.glowProgramUniforms[ "tInput" ].value = this.rtTextureGlow2.texture;
		this.glowProgram.glowProgramUniforms["iResolution"].value = new THREE.Vector2(window.innerWidth,window.innerHeight);
		this.glowProgram.glowProgramUniforms["direction"].value = new THREE.Vector2(0.0, 4.0)
		this.el.effect.render( this.scene, this.camera, this.rtTextureGlow  );
	},
	positionSun(){
		let orthocamera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
		/*
		orthocamera.rotation.set(
			(Math.PI/180.0)*scene.camera.el.getAttribute("rotation").x, 
			(Math.PI/180.0)*scene.camera.el.getAttribute("rotation").y, 
			(Math.PI/180.0)*scene.camera.el.getAttribute("rotation").z
			);

		orthocamera.position.set(
			(Math.PI/180.0)*scene.camera.el.getAttribute("position").x, 
			(Math.PI/180.0)*scene.camera.el.getAttribute("position").y, 
			(Math.PI/180.0)*scene.camera.el.getAttribute("position").z
			);
		*/

		let sunPosition = new THREE.Vector3( 0, 1000, -1000 );
		let screenSpacePosition = new THREE.Vector3();
		
		screenSpacePosition.copy(sunPosition).project(orthocamera);
		//screenSpacePosition.copy(sunPosition).project(this.el.sceneEl.camera);

		// console.log("x = " + screenSpacePosition.x) //probleme de projection
		// console.log("y = " + screenSpacePosition.y)

		screenSpacePosition.x = 0.5;//( screenSpacePosition.x + 1 ) / 2;
		screenSpacePosition.y = 1.0;//( screenSpacePosition.y + 1 ) / 2;

		this.godraysProgram.godraysProgramUniforms[ "vSunPositionScreenSpace" ].value.x = screenSpacePosition.x;
		this.godraysProgram.godraysProgramUniforms[ "vSunPositionScreenSpace" ].value.y = screenSpacePosition.y;
	}
}

export {render};