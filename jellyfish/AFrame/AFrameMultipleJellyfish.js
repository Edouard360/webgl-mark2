import {WIDTH,SCALE} from '../../data/const'

class AFrameMultipleJellyfish{
	constructor(jellyfishCount,entitySceneEl,entityJellyfishEl){
		this.jellyfishCount = jellyfishCount;
		this.entitySceneEl = entitySceneEl;
		this.entityJellyfishEl = entityJellyfishEl;
		this.updateScene();
	}
	updateScene(){
		for(var i=0;i<this.jellyfishCount;i++){
            let entityJellyfishElTmp = document.createElement("a-entity");
            entityJellyfishElTmp.setAttribute('single-jellyfish', 'position',{x:2*(Math.random() - 0.5)*WIDTH*SCALE.x,y:2*(Math.random() - 0.5)*WIDTH*SCALE.y,z:2*(Math.random() - 0.5)*WIDTH*SCALE.z})
            this.entityJellyfishEl.appendChild(entityJellyfishElTmp);
        }
        this.entitySceneEl.appendChild(this.entityJellyfishEl)
	}
	resetScene(){
		this.entitySceneEl.removeChild(this.entityJellyfishEl)
		this.entityJellyfishEl = document.createElement("a-entity");
	}
}

export default AFrameMultipleJellyfish;