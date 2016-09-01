'use strict';

var effect = {
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
		this.rtRight = new THREE.WebGLRenderTarget( 1, 1, parameters );

	},
	setMergeRender:function(){
		/** The mergeRender function - 
		 * @param {WebGLRenderTarget} renderTargetL - Size renderRectL.width * renderRectL.height
		 * @param {WebGLRenderTarget} renderTargetR - Size renderRectR.width * renderRectR.height
		 */
		let renderer = this.el.renderer;
		this.el.effect.mergeRender = (renderTargetL, renderRectL, renderTargetR, renderRectR) => {

			if(this.sceneMerge == undefined ){this.initializeSceneMerge();}

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
		}

	},
	init:function(){
		let vrDisplay; //vrDisplays (with an s) ?
		let scope = this.el.effect;
		let renderer = this.el.renderer;
		let camera = this.el.camera;
		let scene = this.el.object3D;
		renderer.autoclear = false;

		let eyeTranslationL = new THREE.Vector3();
		let eyeTranslationR = new THREE.Vector3();
		let renderRectL, renderRectR;
		let eyeFOVL, eyeFOVR;

		let leftBounds = [ 0.0, 0.0, 0.5, 1.0 ]; 
		let rightBounds = [ 0.5, 0.0, 0.5, 1.0 ];	

		this.initializeTargets();
		this.initializeSceneMerge();
		this.setMergeRender();


		
		this.el.effect.testMerge = (scene, camera)=>{

			vrDisplay = this.el.effect.getVRDisplay();

			var size = renderer.getSize();
			
			renderRectL = {
				x: Math.round( size.width * leftBounds[ 0 ] ),
				y: Math.round( size.height * leftBounds[ 1 ] ),
				width: Math.round( size.width * leftBounds[ 2 ] ),
				height:  Math.round(size.height * leftBounds[ 3 ] )
			};
			renderRectR = {
				x: Math.round( size.width * rightBounds[ 0 ] ),
				y: Math.round( size.height * rightBounds[ 1 ] ),
				width: Math.round( size.width * rightBounds[ 2 ] ),
				height:  Math.round(size.height * rightBounds[ 3 ] )
			};

			// Write in target
			renderer.setScissorTest( false );
			var dpr = renderer.getPixelRatio();

			renderer.setViewport(0,0,renderRectL.width,renderRectL.height  );
			this.rtLeft.setSize(renderRectL.width*dpr,renderRectL.height*dpr)
			renderer.render( scene, camera, this.rtLeft,true);

			renderer.setViewport(0,0,renderRectR.width,renderRectR.height  );
			this.rtRight.setSize(renderRectR.width*dpr,renderRectR.height*dpr)
			renderer.render( scene, camera, this.rtRight,true);

			// Use targets to write for both eyes
			this.el.effect.mergeRender(this.rtLeft,renderRectL,this.rtRight,renderRectR);
		}
	}

}

export {effect};



