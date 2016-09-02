'use strict';
import {Camera} from './camera'
import {Glow} from './glow'
import {Blend} from './blend'
import {Depth} from './depth'
import {Godrays} from './godrays'
import {Merge} from './merge'
import {Target} from './target'

var render = {
	init:function(){
		this.el.renderer.setClearColor("#ffffff");
		let paramTargets = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat }
		this.target = new Target(this.el.renderer,paramTargets)
		this.cameraBucket = new Camera(this.el.camera);
		this.initializePostprocessing();

		this.el.render = (time)=>{
			var timeDelta = time - this.el.time;
			let scene = this.el.object3D;
			let camera = this.el.camera;
			
			if (this.el.isPlaying) { this.el.tick(time, timeDelta); }

			this.target.update();
			
			this.cameraBucket.update(this.el.effect.getVRDisplay())

			this.el.renderer.render(scene,this.cameraBucket.cameraL,this.target.rtLeft, true);
			this.el.renderer.render(scene,this.cameraBucket.cameraR,this.target.rtRight, true);
	
			this.depth.compute(this.target.rtLeft);
			this.depth.compute(this.target.rtRight);
			this.godrays.compute(this.target.rtLeft,this.cameraBucket.cameraL);
			this.godrays.compute(this.target.rtRight,this.cameraBucket.cameraR);
			this.glow.compute(this.target.rtLeft);
			this.glow.compute(this.target.rtRight);
			this.blend.compute(this.target.rtLeft);
			this.blend.compute(this.target.rtRight);

			this.merge.merge(this.target.rtLeft.rtBlend,this.target.renderRect.left,this.target.rtRight.rtBlend,this.target.renderRect.right);
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

		let w = 1,h = 1;

		this.camera = new THREE.OrthographicCamera( w / - 2, w / 2,  h / 2, h / - 2, -10000, 10000 );
		this.camera.position.z = 100;

		this.scene.add( this.camera );

		let quad = new THREE.Mesh(
			new THREE.PlaneBufferGeometry( w, h ),
			this.materialGodraysGenerate
		);
		quad.position.z = -9900;

		this.scene.add( quad );
	
		this.blend = new Blend(this.el.renderer, this.scene,this.camera); 
		this.glow = new Glow(this.el.renderer, this.scene,this.camera);
		this.depth = new Depth(this.el.renderer, this.scene,this.camera);
		this.godrays = new Godrays(this.el.renderer, this.scene,this.camera);
		this.merge = new Merge(this.el.renderer, this.scene,this.camera);
	}
}

export {render};