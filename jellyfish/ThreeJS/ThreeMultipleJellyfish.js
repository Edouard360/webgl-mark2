import Timer from '../Timer'
//import THREE from '../../node_modules/three/build/three'
import ThreeSingleJellyfish from './ThreeSingleJellyfish';
import {MAX_NUMBER,WIDTH,SCALE} from '../../data/const.js'

/** A jellyfish using ThreeJS. */
class ThreeMultipleJellyfish extends Timer {
	constructor(data,scene){
		super();
		this.data = data;
		this.scene = scene;
		this.geometry = {maxInstancedCount:3}
		this.jellyfishGroup = [];
		this.updateJellyfishGroup();
	}

	updateJellyfishGroup(){
		if(this.jellyfishGroup.length != this.geometry.maxInstancedCount && Number.isInteger(this.geometry.maxInstancedCount)){
			var gradient = this.scene.getObjectByName("gradient")
			for(let i = this.scene.children.length-1; i >=0 ;i--){
				if(this.scene.children[i] != gradient){
					this.scene.remove(this.scene.children[i]);
				}
			}
			this.jellyfishGroup = [];
			for(let i = 0; i <this.geometry.maxInstancedCount;i++){
				this.jellyfishGroup[i]=new ThreeSingleJellyfish(this.data,this.scene);
				this.jellyfishGroup[i].x = 2*(Math.random() - 0.5)*WIDTH*SCALE.x;
				this.jellyfishGroup[i].y = 2*(Math.random() - 0.5)*WIDTH*SCALE.y;
				this.jellyfishGroup[i].z = 2*(Math.random() - 0.5)*WIDTH*SCALE.z;
			}
		}
	}

	update(){
		this.updateJellyfishGroup();
		this.jellyfishGroup.map((jellyfish)=>{
		      jellyfish.update();
		});
	}
}

export default ThreeMultipleJellyfish;
