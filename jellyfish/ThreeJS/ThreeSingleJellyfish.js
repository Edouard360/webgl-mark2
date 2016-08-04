/** A jellyfish using ThreeJS. */
class ThreeSingleJellyfish extends ThreeAbstractJellyfish {
	constructor(data){
		super(data);
		this.geometry.maxInstancedCount = 1; // Just to match with Instanced class property
	}
}
