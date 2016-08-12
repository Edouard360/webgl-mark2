import Timer from '../Timer'
import {getTexturesJellyfish} from '../../util/util'

/** The abstract jellyfish object. */
var abstractJellyfish = {
  schema:{count:{type:'int',default:3}},
  /**
   * The init function of the component (as defined in AFRAME docs)
   * Load all the attributes, the shaders and images for the jellyfish
   */
  init(){
    this.timer = new Timer();
    var jellyfish = {
      shaders:{VS: require('../../shaders/jellyfish/jellyfish.vert'),FS: require('../../shaders/jellyfish/jellyfish.frag')},
      position: require('../../data/attributes/jellyfish_position.json'),
      normal: require('../../data/attributes/jellyfish_normal.json'),
      texture: require('../../data/attributes/jellyfish_texture.json'),
      color: require('../../data/attributes/jellyfish_color.json'),
      index: require('../../data/attributes/jellyfish_index.json'),
    }
    
    this.textures = getTexturesJellyfish(require('../../data/img/list.json'))

    this.setMesh(jellyfish);
  },
  update(){
    this.el.getObject3D('mesh',THREE.Mesh).geometry.maxInstancedCount = this.data.count;
  },
  /**
   * The tick function of the component (as defined in AFRAME docs)
   * Moves the jellyfish between two frames.
   * @param {double} time
   * @param {double} delta
   */  
  tick(time, delta) {
    this.timer.updateTime();
    this.timer.rotation += (2.0 * delta) / 1000.0;

    var mesh = this.el.getOrCreateObject3D('mesh',THREE.Mesh);

    if(mesh.material.uniforms){
      mesh.material.uniforms.uCurrentTime.value = time / 1000.0;
      mesh.material.uniforms.uSampler1.value = this.textures[Math.floor(((time / 1000.0 ) * 30) % 32) + 1];
      mesh.position.setX(0);
      mesh.position.setY(0);
      mesh.position.setZ(0);
      mesh.rotation.x =0;
      mesh.rotation.y =0;
      mesh.rotation.z =0;

      mesh.translateY(+5.0); 
      mesh.translateZ(-75.0);
      mesh.rotateY((Math.PI/180)*(Math.sin(this.timer.rotation / 10.0) * 30.0));
      mesh.rotateX((Math.PI/180)*(Math.sin(this.timer.rotation / 20.0) * 30.0));
      mesh.translateY(Math.sin(this.timer.rotation / 10.0) * 2.5 *5); 
    }
  },
  /**
   * The remove function of the component (as defined in AFRAME docs)
   * Reset the mesh of the
   */  
  remove(){
    //this.el.getOrCreateObject3D('mesh',THREE.Mesh) = THREE.Mesh;
    //this.el.getObject3D("mesh").geometry = new THREE.Geometry(); 
    //this.el.setObject3D('mesh',mesh);
  },
  /**
   * The setMesh function. Hand-made.
   * Create and set the Mesh corresponding to the single-jellyfish or instanced-jellyfish component.
   * @param {Object} jellyfish - An object containing the necessary data for a jellyfish.
   */
  setMesh(jellyfish){
    var geometry = this.createGeometry();

    geometry.addAttribute('position', new THREE.BufferAttribute( new Float32Array(jellyfish.position), 3 ) )
    geometry.addAttribute('normal', new THREE.BufferAttribute( new Float32Array(jellyfish.normal), 3 ) );
    geometry.addAttribute('texture', new THREE.BufferAttribute( new Float32Array(jellyfish.texture), 3 ) );
    geometry.addAttribute('color', new THREE.BufferAttribute( new Float32Array(jellyfish.color), 3 ) );
    this.addOffsetAttribute(geometry); // Only effective for instanced jellyfish
    geometry.setIndex( new THREE.BufferAttribute( new Uint32Array(jellyfish.index), 1 ) );

    var material = new THREE.ShaderMaterial({
      vertexShader:   jellyfish.shaders.VS,
      fragmentShader: jellyfish.shaders.FS,
      side: THREE.DoubleSide,
      depthTest: false,
      transparent: true,
      defines:{THREE_JS:true},
      uniforms:{
        uSampler:           {type: "t", value: this.textures[0]},
        uSampler1:          {type: "t", value: this.textures[1]},
        uLightPos:          {value: new THREE.Vector3(10.0, 40.0, -60.0)},
        uLightRadius:       {value: 200.0},
        uLightCol:          {value: new THREE.Vector4(0.8, 1.3, 1.1, 1.0)},
        uAmbientCol:        {value: new THREE.Vector4(0.3, 0.2, 1.0, 1.0)},
        uFresnelCol:        {value: new THREE.Vector4(0.8, 0.7, 0.6, 1.1)},
        uFresnelPower:      {value: 1.0},
        uCurrentTime:       {value: 0.0}
      }
    });
    this.modifyMaterial(material); // Only effective for instanced jellyfish

    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(5,5,5);
    this.el.setObject3D('mesh',mesh);
  },
  /**
   * The createGeometry function, to override
   * @return {Object} - an instance of THREE.Geometry
   */
  createGeometry(){
    throw "This function has to be overridden"
  },
  /**
   * The addOffsetAttribute function.
   * Will only be overridden by the InstancedJellyfish to add the missing attribute.
   */
  addOffsetAttribute(){
  },
  /**
   * The modifyMaterial function.
   * Will only be overridden by the InstancedJellyfish to modify the shader.
   */
  modifyMaterial(){
  }
}

export default abstractJellyfish;
