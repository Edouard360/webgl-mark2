import abstractJellyfish from './AFrameAbstractJellyfish'
import {MAX_NUMBER,WIDTH} from '../../data/const.js'

/** The instanced jellyfish object, that "extends" the abstract jellyfish object */
var instancedJellyfish = {}
Object.assign(instancedJellyfish,abstractJellyfish);

instancedJellyfish.createGeometry = function(){
	return new THREE.InstancedBufferGeometry();
}

instancedJellyfish.addOffsetAttribute = function(geometry){
  var offset = [];
  for(let i = 0; i<MAX_NUMBER;i++){
    offset = offset.concat([2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH]);
  }
  geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array(offset), 3, 1) );
}

instancedJellyfish.modifyMaterial = function(material){
  material.defines.USE_INSTANCED = true;
}

export default instancedJellyfish;


