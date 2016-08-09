/** A gradient using ThreeJS. */
class ThreeGradient{

  /**
   * Constructor for a Gradient in THREE.JS.
   */
  constructor(gradient) {
    this.geometry = new THREE.BufferGeometry();

    var position = new THREE.BufferAttribute(new Float32Array(8),2);
    position.setXY(0,-1.0,-1.0);
    position.setXY(1,-1.0,1.0);
    position.setXY(2,1.0,-1.0);
    position.setXY(3,1.0,1.0);
    this.geometry.addAttribute('position',position);

    var uvIn = new THREE.BufferAttribute(new Float32Array(8),2);
    uvIn.setXY(0,1.0,1.0);
    uvIn.setXY(1,0,0);
    uvIn.setXY(2,1.0,1.0);
    uvIn.setXY(3,0,0);
    this.geometry.addAttribute( 'uvIn',uvIn );

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
    this.mesh.setDrawMode(THREE.TriangleStripDrawMode);

  };
}
