import ThreeAbstractJellyfish from './three-abstract-jellyfish';
import THREE from '../../../node_modules/three/build/three'
import {generateOffset} from '../../util/util.js'
import {DISPLAY} from '../../data/const.js'

/** A jellyfish using ThreeJS. */
class ThreeInstancedJellyfish extends ThreeAbstractJellyfish {
  createGeometry(){
    this.geometry = new THREE.InstancedBufferGeometry();
  }

  addAttribute(jellyfish){
    super.addAttribute(jellyfish)
    var offset = [];
    offset = generateOffset(DISPLAY);
    this.geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array([].concat.apply([],offset)), 3, 1) );
  }

  createMaterial(jellyfish){
    super.createMaterial(jellyfish);
    this.material.defines.USE_INSTANCED = true;
  }
}

export default ThreeInstancedJellyfish;