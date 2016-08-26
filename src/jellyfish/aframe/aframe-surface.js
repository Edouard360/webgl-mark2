'use strict';
var surface = {
	schema:{
		assets:{type:'selectorAll', default:null},
		transparency:{type:'selector', default:null}
	},
	init:function(){
		this.textures = this.data.assets.map((texture,i)=>{
			var asset = new THREE.Texture(texture); 
			asset.wrapS = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
			asset.wrapT = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
			asset.repeat = new THREE.Vector2(8,8);
			asset.needsUpdate = true; 
			return asset; 
	    })

	    this.textures[0] = new THREE.Texture(this.data.transparency); 
		this.textures[0].wrapS = THREE.ClampToEdgeWrapping;
		this.textures[0].wrapT = THREE.ClampToEdgeWrapping;
		this.textures[0].needsUpdate = true; 


	    this.materials = this.textures.map((texture)=>{
	    	return new THREE.MeshBasicMaterial({
	    		map:texture, transparent:true, opacity:0.3,alphaMap:texture,
	    	})
	    })


	},
	tick:function(time){
		this.el.object3D.children[0].material = this.materials[Math.floor(((time / 1000.0 ) * 30) % 32) + 1];

	}
}

export {surface};