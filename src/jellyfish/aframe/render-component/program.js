'use strict';
class Program{
	constructor(renderer,scene,camera){
		this.renderer = renderer;
		this.scene = scene;
		this.camera = camera;
	}
	compute(rtLeft,rtRight){
		throw "This should be overriden"
	}
}

export {Program};