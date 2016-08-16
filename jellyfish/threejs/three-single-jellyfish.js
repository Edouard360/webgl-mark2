import ThreeAbstractJellyfish from './three-abstract-jellyfish';

/** A jellyfish using ThreeJS. */
class ThreeSingleJellyfish extends ThreeAbstractJellyfish {
	constructor(data,scene){
		super(data,scene);
		this.geometry.maxInstancedCount = 1; // Just to match with Instanced class property
	}
}

export default ThreeSingleJellyfish;