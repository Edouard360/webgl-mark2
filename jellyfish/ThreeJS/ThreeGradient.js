import THREE from '../../node_modules/three/build/three'

/** A gradient using ThreeJS. */
class ThreeGradient{

  /**
   * Constructor for a Gradient in THREE.JS.
   */
   constructor(gradient) {
    this.geometry = new THREE.PlaneBufferGeometry(2,2,0,0);

    var uv = new THREE.BufferAttribute(new Float32Array(8),2);
    uv.setXY(0,0,0);
    uv.setXY(1,0,0);
    uv.setXY(2,1,1);
    uv.setXY(3,1,1);
    this.geometry.addAttribute( 'uv',uv )
    
    this.material = new THREE.ShaderMaterial({
      vertexShader:   gradient.shaders.VS,
      fragmentShader: gradient.shaders.FS,
      defines:{THREE_JS:true},
      uniforms:{
        color1: {value: new THREE.Vector3(0.360784314, 0.584313725, 1.0)},
        color2: {value: new THREE.Vector3(0.074509804, 0.156862745, 0.619607843)}
      }
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  };
}

export default ThreeGradient;