'use strict';
import 'three'
import {Program} from './program'

class Merge extends Program{
	constructor(renderer,scene,camera){
		super(renderer,scene,camera)
		this.material = new THREE.MeshBasicMaterial();
	}
	/** The merge function - 
	 * @param {WebGLRenderTarget} renderTargetL - Size renderRectL.width * renderRectL.height
	 * @param {Object} renderRectL - x,y,width,height
	 * @param {WebGLRenderTarget} renderTargetR - Size renderRectR.width * renderRectR.height
	 * @param {Object} renderRectR - x,y,width,height
	 */
	merge(renderTargetL,renderRectL,renderTargetR,renderRectR){
		this.renderer.setScissorTest( true );

		this.scene.overrideMaterial = this.material;
		this.mergeSide(renderTargetL,renderRectL)
		this.mergeSide(renderTargetR,renderRectR)

		this.renderer.setScissorTest( false );
	}
	mergeSide(renderTarget, renderRect){
		this.material.map = renderTarget.texture;
		this.renderer.setViewport( renderRect.x, renderRect.y, renderRect.width, renderRect.height );
		this.renderer.setScissor( renderRect.x, renderRect.y, renderRect.width, renderRect.height );
		this.renderer.render( this.scene, this.camera);
	}
}

export {Merge};