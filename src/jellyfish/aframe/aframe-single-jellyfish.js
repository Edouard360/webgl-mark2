import abstractJellyfish from './aframe-abstract-jellyfish'
import {CENTER} from '../../data/const.js'

/** The single jellyfish object, that "extends" the abstract jellyfish object */
var singleJellyfish = {}
Object.assign(singleJellyfish,abstractJellyfish);

singleJellyfish.createGeometry = function(){
	return new THREE.BufferGeometry();
}

singleJellyfish.translate = function(){
	var mesh = this.el.getOrCreateObject3D('mesh',THREE.Mesh);
	mesh.translateX(CENTER.x); 
	mesh.translateY(CENTER.y); 
    mesh.translateZ(CENTER.z);
}

      

export default singleJellyfish;