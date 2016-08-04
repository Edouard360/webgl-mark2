/** A jellyfish using ThreeJS. */
class ThreeInstancedJellyfish extends ThreeAbstractJellyfish {
  createGeometry(){
    this.geometry = new THREE.InstancedBufferGeometry();
  }

  addAttribute(jellyfish){
    super.addAttribute(jellyfish)
    var offset = [];
    for(let i = 0; i<MAX_NUMBER;i++){
      offset = offset.concat([2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH]);
    }
    this.geometry.addAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array(offset), 3, 1) );
  }

  createMaterial(jellyfish){
    super.createMaterial(jellyfish);
    this.material.vertexShader = jellyfish.shaders.VS.replace(new RegExp("//ONLY FOR INSTANCED JELLYFISH ",'g'),"");
  }
}