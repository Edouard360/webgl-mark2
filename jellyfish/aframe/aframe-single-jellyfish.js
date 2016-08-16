import abstractJellyfish from './aframe-abstract-jellyfish'

/** The single jellyfish object, that "extends" the abstract jellyfish object */
var singleJellyfish = {}
Object.assign(singleJellyfish,abstractJellyfish);

singleJellyfish.createGeometry = function(){
	return new THREE.BufferGeometry();
}

export default singleJellyfish;