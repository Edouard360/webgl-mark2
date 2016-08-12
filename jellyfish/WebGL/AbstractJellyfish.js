import Timer from '../Timer'
import {createTexture, createProgramFromShaders, addDefines} from '../../util/util'
import {CAMERA, USE_FOG,SCALE} from '../../data/const.js'
import {mat4,vec4,vec3, glMatrix} from '../../node_modules/gl-matrix/src/gl-matrix.js'

/** Abstract class representing a jellyfish. */
class AbstractJellyfish extends Timer{

  /**
   * Constructor for the abstract Jellyfish.
   * @param {WebGLRenderingContext} GL - The webgl rendering context.
   * @param {Object} jellyfish - An object containing the necessary data for a jellyfish.
   * @param {String} jellyfish.shaders.VS - The vertex shader text.
   * @param {String} jellyfish.shaders.FS - The fragment shader text.
   * @param {Array} jellyfish.position - The data for the position of each vertex of the jellyfish.
   * @param {Array} jellyfish.normal - The data for the normal of each vertex of the jellyfish.
   * @param {Array} jellyfish.texture - The data for the texture coordinates of each vertex of the jellyfish.
   * @param {Array} jellyfish.color - The data for the color of each vertex of the jellyfish.
   * @param {Array} jellyfish.index - The index that describes the faces of the jellyfish.
   * @param {Array} jellyfish.images 
   * @param {Array} jellyfish.offset - The offset of each independant jellyfish (only for class InstancedJellyfish)   
   */
  constructor(GL,jellyfish) {
    super();
    this.GL = GL;
    jellyfish.shaders.FS = addDefines(jellyfish.shaders.FS, {USE_FOG:USE_FOG})
    this.program = this.createProgram(jellyfish.shaders);
    
    this.attributeLocation = {};
    this.setAttribLocation(); // Set this.attributeLocation
    this.buffer = {};
    this.createAndFillBuffers(jellyfish); // Set this.buffer
    
    this.uniform = {
      modelMatrix:        {value: mat4.create(), func: "uniformMatrix4fv"},
      modelViewMatrix:    {value: mat4.create(), func: "uniformMatrix4fv"},
      projectionMatrix:   {value: mat4.create(), func: "uniformMatrix4fv"},
      normalMatrix:       {value: mat4.create(), func: "uniformMatrix4fv"},
      uLightPos:          {value: vec3.fromValues(10.0, 40.0, -60.0),func: "uniform3fv" },
      uLightRadius:       {value: 200.0,          func: "uniform1f"},
      uLightCol:          {value: vec4.fromValues(0.8, 1.3, 1.1, 1.0),func: "uniform4fv"},
      uAmbientCol:        {value: vec4.fromValues(0.3, 0.2, 1.0, 1.0),func: "uniform4fv"},
      uFresnelCol:        {value: vec4.fromValues(0.8, 0.7, 0.6, 1.1),func: "uniform4fv"},
      uFresnelPower:      {value: 1.0,           func: "uniform1f"},
      uCurrentTime:       {value: 0.0,           func: "uniform1f"},
      uSampler:           {value:0,              func: "uniform1i"},
      uSampler1:          {value:1,              func: "uniform1i"}
    }
    this.getUniformLocation(); // Update this.uniform 

    this.textures = createTexture(jellyfish.images, this.GL);    

    this.indexcount = jellyfish.index.length;
  };

  drawElements(){
    throw "The method drawElements should be overridden.";
  }

  /**
   * Set the buffer member of the class.
   * @param {Object} shaders
   * @param {String} shaders.VS - The vertex shader
   * @param {String} shaders.FS - The fragment shader
   * @return {object} - A WebGLProgram.   
   */
  createProgram(shaders){
    return createProgramFromShaders(this.GL,shaders);
  }

  /**
   * Set this.attributeLocation to contain the location of all the attributes used in the program.
   */
  setAttribLocation(){
    this.attributeList.map((name)=>{
      this.attributeLocation[name] = this.GL.getAttribLocation(this.program, name);
    })
  };

  /**
   * Set this.buffer to contain all buffers for all attributes.
   * @param {object} data
   * @param {Array} jellyfish.position - The data for the position of each vertex of the jellyfish.
   * @param {Array} jellyfish.normal - The data for the normal of each vertex of the jellyfish.
   * @param {Array} jellyfish.texture - The data for the texture coordinates of each vertex of the jellyfish.
   * @param {Array} jellyfish.color - The data for the color of each vertex of the jellyfish.
   * @param {Array} jellyfish.index - The index that describes the faces of the jellyfish.
   */
  createAndFillBuffers(data){
    this.attributeList.map((name)=>{
      this.buffer[name] = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.buffer[name]);
      this.GL.bufferData(this.GL.ARRAY_BUFFER,new Float32Array(data[name]),this.GL.STATIC_DRAW);
    })
    this.buffer.index= this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
      this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(data.index), this.GL.STATIC_DRAW);    
  };

  /**
   * Buffer the data from this.buffer to the attributes in the program, using this.attributeLocation.
   */
  bufferVertexAttributes(){
    this.attributeList.map((name)=>{
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.buffer[name]);
      this.GL.vertexAttribPointer(this.attributeLocation[name],3,this.GL.FLOAT,this.GL.FALSE,Float32Array.BYTES_PER_ELEMENT*3,0);
    });
  };

  /**
   * Set the uniform member of the class to hold the location of uniforms.
   */
  getUniformLocation(){
    for (let name in this.uniform){
      if (this.uniform.hasOwnProperty(name)) {
           this.uniform[name].location = this.GL.getUniformLocation(this.program, name);
      }
    }
  };
  
  /**
   * Update the uniforms values.
   */
  updateUniforms(){
    this.rotation += (2.0 * this.elapsedTime) / 1000.0;
    this.uniform.uCurrentTime.value = (this.now % 100000000) / 1000.0;
    this.whichCaustic = Math.floor((this.uniform.uCurrentTime.value * 30) % 32) + 1;

    let modelMatrix = mat4.create();
    mat4.translate(modelMatrix,modelMatrix,   [0.0, 5.0, -75.0]);
    mat4.rotate(modelMatrix,modelMatrix,      glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 30.0),   [0.0, 1.0, 0.0]);
    mat4.rotate(modelMatrix,modelMatrix,      glMatrix.toRadian(Math.sin(this.rotation / 20.0) * 30.0),   [1.0, 0.0, 0.0]);
    mat4.scale(modelMatrix,modelMatrix,       [SCALE.x, SCALE.y, SCALE.z]);

    mat4.translate(modelMatrix,modelMatrix,   [0.0, Math.sin(this.rotation / 10.0) * 2.5, 0.0])
    this.uniform.modelMatrix.value = modelMatrix;
    this.uniform.modelViewMatrix.value = modelMatrix;

    let projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, glMatrix.toRadian(CAMERA.ANGLE), this.viewport.x/this.viewport.y, CAMERA.NEAR,CAMERA.FAR);
    this.uniform.projectionMatrix.value = projectionMatrix;

    let normalMatrix = mat4.create();
    mat4.invert(normalMatrix, this.uniform.modelMatrix.value);
    mat4.transpose(normalMatrix, normalMatrix);
    this.uniform.normalMatrix.value = normalMatrix;
  };

  /**
   * Set the viewport member of the class.
   * @param {int} x - The width of the canvas.
   * @param {int} y - The height of the canvas.
   */
  updateViewport(x,y){
    this.viewport = {x:x,y:y};
  };

  /**
   * Bind all the uniforms for the program to use them.
   */
  bindUniforms(){
    for (let name in this.uniform){
      if (this.uniform.hasOwnProperty(name)) {
          if(this.uniform[name].func.indexOf("Matrix") != -1){
            this.GL[this.uniform[name].func](this.uniform[name].location, false, this.uniform[name].value);
          }else{
            this.GL[this.uniform[name].func](this.uniform[name].location, this.uniform[name].value);
          }
      }
    }
    this.GL.activeTexture(this.GL.TEXTURE0);
    this.GL.bindTexture(this.GL.TEXTURE_2D,this.textures[0]);

    this.GL.activeTexture(this.GL.TEXTURE1);
    this.GL.bindTexture(this.GL.TEXTURE_2D, this.textures[this.whichCaustic]);
  };

  /**
   * The render method called for each iteration of the render loop.
   */
  render(){
    this.GL.useProgram(this.program);
    this.attributeList.map((name)=>{this.GL.enableVertexAttribArray(this.attributeLocation[name] )});

    this.updateTime();
    this.updateUniforms();
    this.bufferVertexAttributes();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);

    this.bindUniforms();
    this.drawElements();

    this.attributeList.map((name)=>{this.GL.disableVertexAttribArray(this.attributeLocation[name])});
  }
}

AbstractJellyfish.prototype.attributes = [];

export default AbstractJellyfish;
