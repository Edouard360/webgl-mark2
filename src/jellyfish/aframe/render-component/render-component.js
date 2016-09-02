'use strict';
import {MixerProgram,GodraysProgram,GlowProgram,DepthMapProgram,fovToProjection} from '../../../util/util.js'
import dat from '../../../../node_modules/dat.gui/build/dat.gui'
import {methods} from './render-methods'
import {computeGodRays} from './render-godrays'
import {computeDepthMap} from './render-depth'
import {Glow} from './glow'
import {Blend} from './blend'

var render = {
	init:function(){

		this.initializeTargets();
		this.initializeSceneMerge();
		this.initializeCameras();
		this.initializePostprocessing();

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
			this.glow.computeGlow(this.rtLeft,this.rtRight);
			this.blend.computeBlend(this.rtLeft,this.rtRight);

			this.renderMerge(this.rtLeft.rtGlow,this.renderRect.left,this.rtRight.rtGlow,this.renderRect.right);
			this.el.effect.submitFrame();

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

		this.blend = new Blend(this.el.renderer, this.scene,this.camera) 
		this.glow = new Glow(this.el.renderer, this.scene,this.camera);
	}
}

Object.assign(render,methods);
Object.assign(render,computeGodRays);
Object.assign(render,computeDepthMap);

export {render};