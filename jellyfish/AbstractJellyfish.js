/** Abstract class representing a jellyfish. */
class AbstractJellyfish {

  /**
   * Create a point.
   * @param {WebGLRenderingContext} GL - The webgl rendering context.
   * @param {object} data - The data of the jellyfish.
   */
  constructor(GL,data) {
    this.GL = GL;
    this.program = createProgramFromShaders(data.shaders);
    this.attribName = this.attributes;
    this.program.attributes = {};
    this.buffer = {};

    this.uniform = {
      uWorld:             {value: mat4.create(),                      func: "uniformMatrix4fv"},
      uWorldViewProj:     {value: mat4.create(), func: "uniformMatrix4fv"},
      uWorldInvTranspose: {value: mat4.create(), func: "uniformMatrix4fv"},
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
    
    this.getAttribLocation();
    this.createAndFillBuffers(data.jellyfish);
    this.textures = createTexture(data.jellyfish.images, this.GL);
  
    this.getUniformLocation();

    this.rotation = 0;
    this.lastUpdateTime = this.startTime = (new Date()).getTime();
    this.countForFPS = 0;

    this.indexcount = data.jellyfish.index.length;
  };

  drawElements(){
    throw "The method drawElements should be overridden.";
  }

  /**
   * Set program.attributes to contain the location of all the attributes used in the program.
   */
  getAttribLocation(){
    this.attribName.map((name)=>{
      this.program.attributes[name] = this.GL.getAttribLocation(this.program, name);
    })
  };

  /**
   * Set the buffer member of the class.
   * @param {object} data - An object {name-attribute:data-attribute}.
   */
  createAndFillBuffers(data){
    this.attribName.map((name)=>{
      this.buffer[name] = this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.buffer[name]);
      this.GL.bufferData(this.GL.ARRAY_BUFFER,new Float32Array(data[name]),this.GL.STATIC_DRAW);
    })
    this.buffer.index= this.GL.createBuffer();
      this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
      this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(data.index), this.GL.STATIC_DRAW);    
  };

  /**
   * Buffer the data from the buffer member to the attributes in the program.
   */
  bufferVertexAttributes(){
    this.attribName.map((name)=>{
      this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.buffer[name]);
      this.GL.vertexAttribPointer(this.program.attributes[name],3,this.GL.FLOAT,this.GL.FALSE,Float32Array.BYTES_PER_ELEMENT*3,0);
    });
  };

  /**
   * Set the uniform member of the class to hold the location of uniforms.
   */
  getUniformLocation(){
    for (var name in this.uniform){
      if (this.uniform.hasOwnProperty(name)) {
           this.uniform[name].location = this.GL.getUniformLocation(this.program, name);
      }
    }
  };
  
  /**
   * Update the uniforms values.
   */
  updateUniforms(){
    var uWorld = mat4.create();
    mat4.translate(uWorld,uWorld,   [0.0, 5.0, -75.0]);
    mat4.rotate(uWorld,uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 30.0),   [0.0, 1.0, 0.0]);
    mat4.rotate(uWorld,uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 20.0) * 30.0),   [1.0, 0.0, 0.0]);
    mat4.scale(uWorld,uWorld,       [5.0, 5.0, 5.0]);
    mat4.translate(uWorld,uWorld,   [0.0, Math.sin(this.rotation / 10.0) * 2.5, 0.0])
    this.uniform.uWorld.value = uWorld;

    var uWorldViewProj = mat4.create();
    mat4.perspective(uWorldViewProj, glMatrix.toRadian(30.0), this.viewport.x/this.viewport.y, 20.0,120.0);
    mat4.multiply(uWorldViewProj,uWorldViewProj, this.uniform.uWorld.value);
    this.uniform.uWorldViewProj.value = uWorldViewProj;

    var uWorldInvTranspose = mat4.create();
    mat4.invert(uWorldInvTranspose, this.uniform.uWorld.value);
    mat4.transpose(uWorldInvTranspose, uWorldInvTranspose);
    this.uniform.uWorldInvTranspose.value = uWorldInvTranspose;

  };

  /**
   * Set the viewport member of the class.
   * @param {int} x - The width of the canvas.
   * @param {int} y - The height of the canvas.
   */
  updateViewport(x,y){
    this.viewport = {x:x,y:y};
  };

  updateTime(){
    this.now = (new Date()).getTime(); // We are here in ms
    this.elapsedTime = (this.now - this.lastUpdateTime);
    this.rotation += (2.0 * this.elapsedTime) / 1000.0;
    this.uniform.uCurrentTime.value = (this.now % 100000000) / 1000.0;
    this.whichCaustic = Math.floor((this.uniform.uCurrentTime.value * 30) % 32) + 1;
    this.lastUpdateTime = this.now;

    if (this.countForFPS++ == 5000) {
      this.endTime = this.now;
      this.countForFPS = 0;  
      console.log("Average FPS :", 5000 * 1000 / (this.endTime - this.startTime));
      this.startTime = this.endTime;
    }
  };

  /**
   * Bind all the uniforms for the program to use them.
   */
  bindUniforms(){
    for (var name in this.uniform){
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
    this.attribName.map((name)=>{this.GL.enableVertexAttribArray(this.program.attributes[name])});

    this.updateTime();
    this.updateUniforms();
    this.bufferVertexAttributes();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
    
    this.bindUniforms();
    this.drawElements();

    this.attribName.map((name)=>{this.GL.disableVertexAttribArray(this.program.attributes[name])});
  }
}
AbstractJellyfish.prototype.attributes = [];
