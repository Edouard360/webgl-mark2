/** A jellyfish using ThreeJS. */
class ThreeInstancedJellyfish extends ThreeAbstractJellyfish {
  createGeometry(){
    this.geometry = new THREE.InstancedBufferGeometry();
  }

  addAttribute(jellyfish){
    super.addAttribute(jellyfish)
    this.geometry.maxInstancedCount = jellyfish.offset.length;
    this.geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array([].concat.apply([], jellyfish.offset)), 3, 1) );
  }

  createMaterial(jellyfish){
    super.createMaterial(jellyfish);
    this.material.vertexShader = jellyfish.shaders.VS.replace(new RegExp("//ONLY FOR INSTANCED JELLYFISH ",'g'),"");
  }
}