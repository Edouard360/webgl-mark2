import Timer from '../timer'
import {USE_FOG,SCALE} from '../../data/const.js'
import THREE from '../../../node_modules/three/build/three'

/** A jellyfish using ThreeJS. */
class ThreeAbstractJellyfish extends Timer {

  /**
   * Constructor for a Jellyfish in THREE.JS.
   */
   constructor(jellyfish,scene) {
    super();
    this.x=0;
    this.y=0;
    this.z=0;
    this.createGeometry();
    this.addAttribute(jellyfish);
    this.geometry.setIndex( new THREE.BufferAttribute( new Uint32Array(jellyfish.index), 1 ) );
    this.textures = jellyfish.images;
    this.createMaterial(jellyfish);

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.set(SCALE.x,SCALE.y,SCALE.z); // equivalent to mat4.scale(uWorld,uWorld, [5.0, 5.0, 5.0]);
    //But the changes only take effect at rendering time so *5 on translateY
    scene.add(this.mesh);
  };

  createGeometry(){
    this.geometry = new THREE.BufferGeometry();
  };

  addAttribute(jellyfish){
    this.geometry.addAttribute('position', new THREE.BufferAttribute( new Float32Array(jellyfish.position), 3 ) )
    this.geometry.addAttribute( 'normal', new THREE.BufferAttribute( new Float32Array(jellyfish.normal), 3 ) );
    this.geometry.addAttribute( 'texture', new THREE.BufferAttribute( new Float32Array(jellyfish.texture), 3 ) );
    this.geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array(jellyfish.color), 3 ) );
  };

  createMaterial(jellyfish){
    this.material = new THREE.ShaderMaterial({
      vertexShader:   jellyfish.shaders.VS,
      fragmentShader: jellyfish.shaders.FS,
      side: THREE.DoubleSide, // equivalent for GL.disable(GL.CULL_FACE);
      depthTest: false, // equivalent for GL.disable(GL.DEPTH_TEST);
      //blendEquation:THREE.SubtractEquation, // approximate equivalent GL.blendFunc(GL.SRC_ALPHA, GL.ONE_MINUS_SRC_ALPHA);
      transparent: true,
      defines:{USE_FOG:USE_FOG,THREE_JS:true},
      uniforms:{
        uSampler:           {type: "t", value: this.textures[0]},
        uSampler1:          {type: "t", value: this.textures[1]},
        uLightPos:          {value: new THREE.Vector3(10.0, 40.0, -60.0)},
        uLightRadius:       {value: 200.0},
        uLightCol:          {value: new THREE.Vector4(0.8, 1.3, 1.1, 1.0)},
        uAmbientCol:        {value: new THREE.Vector4(0.3, 0.2, 1.0, 1.0)},
        uFresnelCol:        {value: new THREE.Vector4(0.8, 0.7, 0.6, 1.1)},
        uFresnelPower:      {value: 1.0},
        uCurrentTime:       {value: 0.0},

        fogDensity:  { type: "f", value: 0.2 },
        fogColor:    { type: "c", value:  new THREE.Color( 0x0077ff ) },
        fogNear:     { type: "f", value: 20 },
        fogFar:      { type: "f", value: 120}
      }
    });

  }

  update(){
    this.updateTime();
    this.material.uniforms.uCurrentTime.value = (this.now % 100000000) / 1000.0;
    //Change caustics over time
    this.material.uniforms.uSampler1.value = this.textures[Math.floor((this.material.uniforms.uCurrentTime.value * 30) % 32) + 1];
    this.rotation += (2.0 * this.elapsedTime) / 1000.0;
    
    this.mesh.position.setX(this.x);
    this.mesh.position.setY(this.y);
    this.mesh.position.setZ(this.z);
    this.mesh.rotation.x =0;
    this.mesh.rotation.y =0;
    this.mesh.rotation.z =0;

    this.mesh.translateY(+5.0); 
    this.mesh.translateZ(-75.0);
    this.mesh.rotateY((Math.PI/180)*Math.sin(this.rotation / 10.0) * 30.0);
    this.mesh.rotateX((Math.PI/180)*Math.sin(this.rotation / 20.0) * 30.0);
    this.mesh.translateY(Math.sin(this.rotation / 10.0) * 2.5 * SCALE.y); 
  };
}

export default ThreeAbstractJellyfish;