'use strict';
class Target{
	constructor(renderer, parameters){
		this.renderer = renderer;

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
	}
	update(){
		let leftBounds = [ 0.0, 0.0, 0.5, 1.0 ]; 
		let rightBounds = [ 0.5, 0.0, 0.5, 1.0 ];
		var size = this.renderer.getSize();
		let dpr = this.renderer.getPixelRatio();

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
	}
}

export {Target};
