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
			asset.repeat = new THREE.Vector2(10,10);
			asset.needsUpdate = true; 
			return asset; 
	    })

	    this.textures[0] = new THREE.Texture(this.data.transparency);
	    this.textures[0].wrapS = THREE.RepeatWrapping;
		this.textures[0].wrapT = THREE.RepeatWrapping;
	    this.textures[0].repeat = new THREE.Vector2(1,1);
		this.textures[0].needsUpdate = true; 

	    this.materials = this.textures.map((texture)=>{
	    	// return new THREE.MeshBasicMaterial({
	    	// 	map:texture, transparent:true, opacity:1.0,alphaMap:this.textures[0]
	    	// })
	    	return new THREE.ShaderMaterial({
				vertexShader:   require('../../shaders/gradient/surface.vert'),
				fragmentShader: require('../../shaders/gradient/surface.frag'),
				transparent:true, opacity:0.0,
				uniforms:{
					opacity: 	{type: "f", value: 0.1},
					map: 		{type: "t", value: texture},
					alphaMap: 	{type: "t", value: this.textures[0]}					
				}
			})
	    });


	},
	tick:function(time){
		this.el.object3D.children[0].material = this.materials[Math.floor(((time / 1000.0 ) * 30) % 32) + 1];

	}
}

export {surface};