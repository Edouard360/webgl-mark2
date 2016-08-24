import {SCALE,DISPLAY} from '../../data/const'
import {generateOffset} from '../../util/util.js'

class AFrameMultipleJellyfish{
	constructor(jellyfishCount,entitySceneEl,entityJellyfishEl){
		this.jellyfishCount = jellyfishCount;
		this.entitySceneEl = entitySceneEl;
		this.entityJellyfishEl = entityJellyfishEl;
		this.updateScene();
	}
	updateScene(){
		var offset = [];	
		offset = generateOffset(DISPLAY);
		offset.slice(0,this.jellyfishCount).map((array)=>{
			let entityJellyfishElTmp = document.createElement("a-entity");
            entityJellyfishElTmp.setAttribute('single-jellyfish', 'position',{x:array[0]*SCALE.x,y:array[1]*SCALE.y,z:array[2]*SCALE.z})
            entityJellyfishElTmp.setAttribute('single-jellyfish', 'assets','texture')
            this.entityJellyfishEl.appendChild(entityJellyfishElTmp);
		})

        this.entitySceneEl.appendChild(this.entityJellyfishEl)
	}
	resetScene(){
		this.entitySceneEl.removeChild(this.entityJellyfishEl)
		this.entityJellyfishEl = document.createElement("a-entity");
	}
}

export default AFrameMultipleJellyfish;