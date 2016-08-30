'use strict';
import {MixerProgram,GodraysProgram} from '../../util/util.js'
import dat from '../../../node_modules/dat.gui/build/dat.gui'


var render = {
	init:function(){

		this.initializePostprocessing();

		this.mixerProgram.mixerProgramUniforms.fIntensity.value = 0.66;
		this.mixerProgram.mixerProgramUniforms.fAmbient.value = 0.73;

		var gui = new dat.GUI()

		gui.add(this.mixerProgram.mixerProgramUniforms.fIntensity, 'value',0,5).name("Intensity")
		gui.add(this.mixerProgram.mixerProgramUniforms.fAmbient, 'value',0,5).name("Ambient")

	

		this.el.render = (time)=>{
			var timeDelta = time - this.el.time;
			let scene = this.el.object3D;
			let camera = this.el.camera;
			
			if (this.el.isPlaying) { this.el.tick(time, timeDelta); }

			this.computeGodRays();
			this.el.effect.render(scene, camera, this.rtTextureColors);

			this.sceneTest.overrideMaterial = this.mixerProgram.mixerProgramMaterial;

			this.mixerProgram.mixerProgramUniforms["tColors"].value = this.rtTextureColors.texture;
			this.mixerProgram.mixerProgramUniforms["tEffect"].value = this.rtTextureGodRays2.texture;
			//rtTextureGodRays2
			//rtTextureDepth


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

		let parameters = { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat };
		this.rtTextureColors = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );
		this.rtTextureColors.texture.generateMipmaps = false;
        this.rtTextureColors.stencilBuffer = false;
        this.rtTextureColors.depthBuffer = true;
		this.rtTextureColors.depthTexture = new THREE.DepthTexture();
		//this.rtTextureColors.depthTexture.type = this.ext.UNSIGNED_INT_24_8_WEBGL;
		this.rtTextureColors.depthTexture.type = THREE.UnsignedShortType;

		this.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, parameters );

		let w = window.innerWidth /// 4.0;
		let h = window.innerHeight /// 4.0;
		this.rtTextureGodRays1 = new THREE.WebGLRenderTarget( w, h, parameters );
		this.rtTextureGodRays2 = new THREE.WebGLRenderTarget( w, h, parameters );

		// god-ray shaders
		this.godraysProgram = new GodraysProgram();

		this.mixerProgram = new MixerProgram();
		this.mixerProgram.mixerProgramUniforms.fIntensity.value = 0.75;

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

		var filterLen = 3.0;

		var TAPS_PER_PASS = 6.0;

		// pass 1 - render into first ping-pong target
		var pass = 1.0;
		var stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		this.godraysProgram.godraysProgramUniforms[ "fStepSize" ].value = stepLen;
		this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtTextureColors.depthTexture;

		this.scene.overrideMaterial = this.godraysProgram.godraysProgramMaterial;

		this.el.effect.render( this.scene, this.camera, this.rtTextureGodRays2 );

/*
		// pass 2 - render into second ping-pong target
		pass = 2.0;
		stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		this.godraysProgram.godraysProgramUniforms[ "fStepSize" ].value = stepLen;
		this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtTextureGodRays2.texture;
		this.godraysProgram.godraysProgramUniforms[ "firstPass" ].value = false;

		this.el.effect.render( this.scene, this.camera, this.rtTextureGodRays1  );
	
		// pass 3 - 1st RT

		pass = 3.0;
		stepLen = filterLen * Math.pow( TAPS_PER_PASS, -pass );

		this.godraysProgram.godraysProgramUniforms[ "fStepSize" ].value = stepLen;
		this.godraysProgram.godraysProgramUniforms[ "tInput" ].value = this.rtTextureGodRays1.texture;

		this.el.effect.render( this.scene, this.camera , this.rtTextureGodRays2  );
*/

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