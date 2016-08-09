/** A jellyfish using ThreeJS. */
class ThreeMultipleJellyfish extends AbstractTimer {
	constructor(data){
		super();
		this.jellyfishGroup = [];
		for(let i = 0; i <MAX_NUMBER;i++){
			this.jellyfishGroup[i]=new ThreeSingleJellyfish(data);
			this.jellyfishGroup[i].x = 2*(Math.random() - 0.5)*WIDTH*5;
			this.jellyfishGroup[i].y = 2*(Math.random() - 0.5)*WIDTH*5;
			this.jellyfishGroup[i].z = 2*(Math.random() - 0.5)*WIDTH*5;
		}
		this.geometry = {}
	}

	update(){
		this.jellyfishGroup.map((jellyfish)=>{
		      jellyfish.update();
		});
	}
}
