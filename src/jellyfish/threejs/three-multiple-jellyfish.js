import Timer from '../timer'
import ThreeSingleJellyfish from './three-single-jellyfish';
import {generateOffset} from '../../util/util.js'
import {SCALE,DISPLAY} from '../../data/const.js'

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
			generateOffset(DISPLAY).slice(0,this.geometry.maxInstancedCount).map((array,i)=>{
				this.jellyfishGroup[i] = new ThreeSingleJellyfish(this.data,this.scene);
				this.jellyfishGroup[i].x = array[0]*SCALE.x;
				this.jellyfishGroup[i].y = array[1]*SCALE.y;
				this.jellyfishGroup[i].z = array[2]*SCALE.z;
			})
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
