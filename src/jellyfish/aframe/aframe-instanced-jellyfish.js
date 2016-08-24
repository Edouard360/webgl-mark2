import abstractJellyfish from './aframe-abstract-jellyfish'
import {generateOffset} from '../../util/util.js'
import {DISPLAY} from '../../data/const.js'

/** The instanced jellyfish object, that "extends" the abstract jellyfish object */
var instancedJellyfish = {}
Object.assign(instancedJellyfish,abstractJellyfish);

instancedJellyfish.createGeometry = function(){
	return new THREE.InstancedBufferGeometry();
}

instancedJellyfish.addOffsetAttribute = function(geometry){
  var offset = [];
  offset = generateOffset(DISPLAY);
  geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array([].concat.apply([],offset)), 3, 1) );
}

instancedJellyfish.modifyMaterial = function(material){
  material.defines.USE_INSTANCED = true;
}

export default instancedJellyfish;


