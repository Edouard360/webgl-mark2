/** A gradient using ThreeJS. */
class ThreeGradient{

  /**
   * Constructor for a Gradient in THREE.JS.
   */
  constructor(gradient) {
    this.geometry = new THREE.BufferGeometry();
    this.geometry.attributes = {
          position:{
            itemSize: 1,
            array: new Float32Array([]),
            numItems: 8
          }
    }
    // Don't understand why this is needed...

    this.geometry.addAttribute( 'position2', new THREE.BufferAttribute(new Float32Array([-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0]), 2) );
    this.geometry.addAttribute( 'uvIn', new THREE.BufferAttribute(new Float32Array([1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]), 2) );

    this.geometry.setIndex( new THREE.BufferAttribute( new Uint32Array([0,1,2,1,3,2]), 1 ) );

    this.material = new THREE.ShaderMaterial({
      vertexShader:   gradient.shaders.VS,
      fragmentShader: gradient.shaders.FS,
      uniforms:{
        color1: {value: new THREE.Vector3(0.360784314, 0.584313725, 1.0)},
        color2: {value: new THREE.Vector3(0.074509804, 0.156862745, 0.619607843)}
      },
      side: THREE.BackSide // NOT IN THE RIGHT DIRECTION ! CCW ! We could set it in the renderer
    });
   
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.mesh.setDrawMode(THREE.TriangleStripDrawMode); doesn't work apparently
  };
}
