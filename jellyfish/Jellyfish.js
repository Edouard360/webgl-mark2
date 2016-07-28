// *** Jellyfish
// *** JellyfishGroup
// *** InstancedJellyfish

// *** Jellyfish

window.Jellyfish = (function(){

  var Jellyfish = function (GL, data) {
    this.GL = GL;
    this.program = createProgramFromShaders(data.shaders);
    this.attribName = ["position","normal","color","texture"];
    this.program.attributes = {};
    this.buffer = {};

    this.uniform = [
    {name:"uWorld",             value: mat4.create(), type: GL.uniformMatrix4fv},
    {name:"uWorldViewProj",     value: mat4.create(), type: GL.uniformMatrix4fv},
    {name:"uWorldInvTranspose", value: mat4.create(), type: GL.uniformMatrix4fv},
    {name:"uLightPos",          value:new Float32Array([10.0, 40.0, -60.0]),type: GL.uniform3fv },
    {name:"uLightRadius",       value:200.0,          type: GL.uniform1f},
    {name:"uLightCol",          value:vec4.fromValues(0.8, 1.3, 1.1, 1.0),type: GL.uniform4fv},
    {name:"uAmbientCol",        value:vec4.fromValues(0.3, 0.2, 1.0, 1.0),type: GL.uniform4fv},
    {name:"uFresnelCol",        value:vec4.fromValues(0.8, 0.7, 0.6, 1.1),type: GL.uniform4fv},
    {name:"uFresnelPower  ",    value:1.0,            type: GL.uniform1f},
    {name:"uCurrentTime",       value: 0.0,           type: GL.uniform1f}
    ]

    this.getAttribLocation();
    this.createAndFillBuffers(data.jellyfish);
    this.prepareTextures(data.jellyfish.images);

    this.getUniformLocation();
    this.setUniforms();

    this.startTime = (new Date()).getTime();

    this.accumulatedTimeInMs = 0;
    this.countForFPS = 0;

    this.indexcount = data.jellyfish.index.length;
  };

  Jellyfish.prototype.getAttribLocation = function(){
    this.attribName.map((name)=>{
      this.program.attributes[name] = GL.getAttribLocation(this.program, name);
    })
  }

  Jellyfish.prototype.createAndFillBuffers = function(data){
    this.attribName.map((name)=>{
      this.buffer[name] = GL.createBuffer();
      GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer[name]);
      GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data[name]),GL.STATIC_DRAW);
    })
    this.buffer.index= GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(data.index), GL.STATIC_DRAW);
  };

  Jellyfish.prototype.bufferVertexAttributes = function(){
    this.attribName.map((name)=>{
      GL.bindBuffer(GL.ARRAY_BUFFER, this.buffer[name]);
      GL.vertexAttribPointer(this.program.attributes[name],3,GL.FLOAT,GL.FALSE,Float32Array.BYTES_PER_ELEMENT*3,0);
    });
  };

  Jellyfish.prototype.prepareTextures = function(images){
    this.textures = createTexture(images);
  };

  Jellyfish.prototype.getUniformLocation = function(){
    this.program.uniform = {
      uWorld:GL.getUniformLocation(this.program, "uWorld"),
      uWorldViewProj:GL.getUniformLocation(this.program, "uWorldViewProj"),
      uWorldInvTranspose:GL.getUniformLocation(this.program, "uWorldInvTranspose"),
      uLightPos:GL.getUniformLocation(this.program, "uLightPos"),
      uLightRadius:GL.getUniformLocation(this.program, "uLightRadius"),
      uLightCol:GL.getUniformLocation(this.program, "uLightCol"),
      uAmbientCol:GL.getUniformLocation(this.program, "uAmbientCol"),
      uFresnelCol:GL.getUniformLocation(this.program, "uFresnelCol"),
      uFresnelPower:GL.getUniformLocation(this.program, "uFresnelPower"),
      uCurrentTime:GL.getUniformLocation(this.program, "uCurrentTime"),

      uSampler:GL.getUniformLocation(this.program, "uSampler"),
      uSampler1:GL.getUniformLocation(this.program, "uSampler1")
    }
  }

  Jellyfish.prototype.setUniforms = function(){

    // store into a subobject
    this.uWorld = mat4.create();
    this.uWorldViewProj = mat4.create();
    this.uWorldInvTranspose = mat4.create();
    this.uLightPos = new Float32Array([10.0, 40.0, -60.0]);
    this.uLightRadius = 200.0;
    this.uLightCol = vec4.fromValues(0.8, 1.3, 1.1, 1.0);
    this.uAmbientCol = vec4.fromValues(0.3, 0.2, 1.0, 1.0);
    this.uFresnelCol = vec4.fromValues(0.8, 0.7, 0.6, 1.1);
    this.uFresnelPower = 1.0;

    this.rotation = 0;
    this.uCurrentTime = 0;
    this.lastUpdateTime = 0;

    this.lastUpdateTime = (new Date()).getTime();
    this.uCurrentTime = 0 * (this.lastUpdateTime  % 100000000.) / 1000.0;
    this.whichCaustic = Math.floor((this.uCurrentTime * 30) % 32) + 1;
  };

  Jellyfish.prototype.updateUniforms = function(){
    this.updateTime();

    this.uWorld = mat4.create();
    mat4.translate(this.uWorld,this.uWorld,   [0.0, 5.0, -75.0]);
    mat4.rotate(this.uWorld,this.uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 30.0),   [0.0, 1.0, 0.0]);
    mat4.rotate(this.uWorld,this.uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 20.0) * 30.0),   [1.0, 0.0, 0.0]);
    mat4.scale(this.uWorld,this.uWorld,       [5.0, 5.0, 5.0]);
    mat4.translate(this.uWorld,this.uWorld,   [0.0, Math.sin(this.rotation / 10.0) * 2.5, 0.0])

    this.uWorldViewProj = mat4.create();
    mat4.perspective(this.uWorldViewProj, glMatrix.toRadian(30.0), this.viewport.x/this.viewport.y, 20.0,120.0);
    mat4.multiply(this.uWorldViewProj,this.uWorldViewProj, this.uWorld);

    mat4.invert(this.uWorldInvTranspose, this.uWorld);
    mat4.transpose(this.uWorldInvTranspose, this.uWorldInvTranspose);
  };

  Jellyfish.prototype.updateViewport = function(canvas){
    this.viewport = {x:canvas.width,y:canvas.height};
  };

  Jellyfish.prototype.updateTime = function(){
    this.now = (new Date()).getTime(); // We are here in ms
    this.elapsedTime = (this.now - this.lastUpdateTime);
    this.rotation += (2.0 * this.elapsedTime) / 1000.0;
    this.uCurrentTime = (this.now % 100000000) / 1000.0;
    this.whichCaustic = Math.floor((this.uCurrentTime * 30) % 32) + 1;
    this.lastUpdateTime = this.now;

    if (this.countForFPS++ == 5000) {
      this.endTime = this.now;
      this.countForFPS = 0;  
      console.log("Average FPS :", 5000 * 1000 / (this.endTime - this.startTime));
      this.startTime = this.endTime;
    }
  };

  Jellyfish.prototype.bindUniforms = function(program){
    GL.uniformMatrix4fv(program.uniform.uWorld, false, this.uWorld);
    GL.uniformMatrix4fv(program.uniform.uWorldViewProj, false, this.uWorldViewProj);
    GL.uniformMatrix4fv(program.uniform.uWorldInvTranspose, false, this.uWorldInvTranspose);
    GL.uniform3fv(program.uniform.uLightPos, this.uLightPos);
    GL.uniform1f(program.uniform.uLightRadius, this.uLightRadius);
    GL.uniform4fv(program.uniform.uLightCol, this.uLightCol);
    GL.uniform4fv(program.uniform.uAmbientCol, this.uAmbientCol);
    GL.uniform4fv(program.uniform.uFresnelCol, this.uFresnelCol);
    GL.uniform1f(program.uniform.uFresnelPower, this.uFresnelPower);
    GL.uniform1f(program.uniform.uCurrentTime, this.uCurrentTime);

    // 2 - Bind texture

    GL.uniform1i(this.program.uniform.uSampler, 0);
    GL.uniform1i(this.program.uniform.uSampler1, 1);

    GL.activeTexture(GL.TEXTURE0);
    GL.bindTexture(GL.TEXTURE_2D,this.textures[0]);

    GL.activeTexture(GL.TEXTURE1);
    GL.bindTexture(GL.TEXTURE_2D, this.textures[this.whichCaustic]);
  };

  Jellyfish.prototype.enableVertexAttribArray = function(){
    GL.enableVertexAttribArray(this.program.attributes.position);
    GL.enableVertexAttribArray(this.program.attributes.normal);
    GL.enableVertexAttribArray(this.program.attributes.color);
    GL.enableVertexAttribArray(this.program.attributes.texture);
  };

  Jellyfish.prototype.disableVertexAttribArray = function(){
    GL.disableVertexAttribArray(this.program.attributes.position);
    GL.disableVertexAttribArray(this.program.attributes.normal);
    GL.disableVertexAttribArray(this.program.attributes.color);
    GL.disableVertexAttribArray(this.program.attributes.texture);
  };

  Jellyfish.prototype.render = function(){
    this.enableVertexAttribArray();

    this.updateUniforms();
    this.bufferVertexAttributes();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);

    this.GL.useProgram(this.program);

    this.bindUniforms(this.program);

    this.GL.drawElements(GL.TRIANGLES, this.indexcount, GL.UNSIGNED_INT, 0);

    this.disableVertexAttribArray();
  };

  return Jellyfish;
})();

// 238 =~ 170

// *** JellyfishGroup

window.JellyfishGroup = (function(){
  var JellyfishGroup = function(GL,data){
    this.jellyfishGroup = data.jellyfish.offset.map((coord)=>{
      var data_tmp = newDataJellyfishWithOffset(coord[0],coord[1],coord[2]);
      data_tmp.jellyfish.images = data.jellyfish.images;
      return new Jellyfish(GL,data_tmp);
    });

    function newDataJellyfishWithOffset(x,y,z){
      var data_tmp = JSON.parse(JSON.stringify(data));
      data_tmp.jellyfish.vertices = data_tmp.jellyfish.vertices.map((coord,i)=>{
        return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
      });
      return data_tmp
    }
  }

  JellyfishGroup.prototype.updateViewport = function( canvas){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.updateViewport(canvas);
    });
  }

  JellyfishGroup.prototype.render = function(){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.render();
    })
  };

  return JellyfishGroup;
})();

// *** InstancedJellyfish

window.InstancedJellyfish = (function(){

    var InstancedJellyfish = function (GL, GLext, data) {
        this.GL = GL;
        this.GLext = GLext;

        data.shaders.VS = data.shaders.VS.replace("//ONLY FOR INSTANCED JELLYFISH ","").replace("//ONLY FOR INSTANCED JELLYFISH ","");
        this.program = createProgramFromShaders(data.shaders);

        this.getAttribLocation();
        this.createAndFillBuffers(data.jellyfish);
        this.prepareTextures(data.jellyfish.images);

        this.getUniformLocation();
        this.setUniforms();

        this.indexcount = data.jellyfish.faces.length; 
        // This is the number of vertices
        // Indeed the real number of face is indexCount/3, and we multiply by 3 for each vertex !
        this.jellyfishcount = data.jellyfish.offset.length;
    };

    InstancedJellyfish.prototype.getAttribLocation = function(){
      this.program.attributes={
        position: GL.getAttribLocation(this.program, "aVertexPosition"),
        normals: GL.getAttribLocation(this.program, "aVertexNormal"),
        colors: GL.getAttribLocation(this.program, "aVertexColor"),
        texture: GL.getAttribLocation(this.program, "aTextureCoord"),
        instancedOffset: GL.getAttribLocation(this.program, "aInstancedOffset")
      }
    }

    InstancedJellyfish.prototype.createAndFillBuffers = function(data){

        //WILL NEED TO BE ENABLED
        this.verticesBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);

        this.normalsBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.normalsBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.normals),GL.STATIC_DRAW);

        this.colorsBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.colorsBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.colors),GL.STATIC_DRAW);

        this.textureBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.textureBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.texture),GL.STATIC_DRAW);

        this.offsetBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.offsetBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array([].concat.apply([], data.offset)),GL.STATIC_DRAW);

        //WILL NOT NEED TO BE ENABLED
        this.indexBuffer= GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(data.faces), GL.STATIC_DRAW);
    };

    InstancedJellyfish.prototype.bufferVertexAttributes = function(){
        bufferAttribute(this.verticesBuffer, this.program.attributes.position);
        bufferAttribute(this.normalsBuffer, this.program.attributes.normals);
        bufferAttribute(this.colorsBuffer, this.program.attributes.colors);
        bufferAttribute(this.textureBuffer, this.program.attributes.texture);
        function bufferAttribute(buffer,position){
            GL.bindBuffer(GL.ARRAY_BUFFER, buffer);
            GL.vertexAttribPointer(position,
                3,
                GL.FLOAT,
                GL.FALSE,
                Float32Array.BYTES_PER_ELEMENT*3,
                0
                );
        }

        GL.bindBuffer(GL.ARRAY_BUFFER, this.offsetBuffer);
        GL.vertexAttribPointer(this.program.attributes.instancedOffset, 3, GL.FLOAT, GL.FALSE, Float32Array.BYTES_PER_ELEMENT*3, 0);
        GLext.vertexAttribDivisorANGLE(this.program.attributes.instancedOffset, 1);

        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    };

    InstancedJellyfish.prototype.prepareTextures = function(images){
        this.textures = images.map(function(img,i){
            texture = GL.createTexture();
            GL.bindTexture(GL.TEXTURE_2D, texture);
            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_S,(i>0?GL.REPEAT:GL.CLAMP_TO_EDGE));
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_T,(i>0?GL.REPEAT:GL.CLAMP_TO_EDGE));
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MAG_FILTER,GL.LINEAR);
            GL.texImage2D(GL.TEXTURE_2D,0, GL.RGBA,GL.RGBA,GL.UNSIGNED_BYTE,img);
            GL.bindTexture(GL.TEXTURE_2D,null);
            return texture;
        });
    };

    InstancedJellyfish.prototype.getUniformLocation = function(){
        this.program.uniform = {
            uWorld:GL.getUniformLocation(this.program, "uWorld"),
            uWorldViewProj:GL.getUniformLocation(this.program, "uWorldViewProj"),
            uWorldInvTranspose:GL.getUniformLocation(this.program, "uWorldInvTranspose"),
            uLightPos:GL.getUniformLocation(this.program, "uLightPos"),
            uLightRadius:GL.getUniformLocation(this.program, "uLightRadius"),
            uLightCol:GL.getUniformLocation(this.program, "uLightCol"),
            uAmbientCol:GL.getUniformLocation(this.program, "uAmbientCol"),
            uFresnelCol:GL.getUniformLocation(this.program, "uFresnelCol"),
            uFresnelPower:GL.getUniformLocation(this.program, "uFresnelPower"),
            uCurrentTime:GL.getUniformLocation(this.program, "uCurrentTime"),

            uSampler:GL.getUniformLocation(this.program, "uSampler"),
            uSampler1:GL.getUniformLocation(this.program, "uSampler1")
        }
    }

    InstancedJellyfish.prototype.setUniforms = function(){
        this.uWorld = mat4.create();
        this.uWorldViewProj = mat4.create();
        this.uWorldInvTranspose = mat4.create();
        this.uLightPos = new Float32Array([10.0, 40.0, -60.0]);
        this.uLightRadius = 200.0;
        this.uLightCol = vec4.fromValues(0.8, 1.3, 1.1, 1.0);
        this.uAmbientCol = vec4.fromValues(0.3, 0.2, 1.0, 1.0);
        this.uFresnelCol = vec4.fromValues(0.8, 0.7, 0.6, 1.1);
        this.uFresnelPower = 1.0;

        this.rotation = 0;
        this.uCurrentTime = 0;
        this.lastUpdateTime = 0;

        this.lastUpdateTime = (new Date()).getTime();
        this.uCurrentTime = (this.lastUpdateTime  % 100000000.) / 1000.0;
        this.whichCaustic = Math.floor((this.uCurrentTime * 30) % 32) + 1;
    };

    InstancedJellyfish.prototype.updateUniforms = function(){
        this.updateTime();

        this.uWorld = mat4.create();
        mat4.translate(this.uWorld,this.uWorld,   [0.0, 5.0, -75.0]);
        mat4.rotate(this.uWorld,this.uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 30.0),   [0.0, 1.0, 0.0]);
        mat4.rotate(this.uWorld,this.uWorld,      glMatrix.toRadian(Math.sin(this.rotation / 20.0) * 30.0),   [1.0, 0.0, 0.0]);
        mat4.scale(this.uWorld,this.uWorld,       [5.0, 5.0, 5.0]);
        mat4.translate(this.uWorld,this.uWorld,   [0.0, Math.sin(this.rotation / 10.0) * 2.5, 0.0])

        this.uWorldViewProj = mat4.create();
        mat4.perspective(this.uWorldViewProj, glMatrix.toRadian(30.0), this.viewport.x/this.viewport.y, 20.0,120.0);
        mat4.multiply(this.uWorldViewProj,this.uWorldViewProj, this.uWorld);

        mat4.invert(this.uWorldInvTranspose, this.uWorld);
        mat4.transpose(this.uWorldInvTranspose, this.uWorldInvTranspose);
    };

    InstancedJellyfish.prototype.updateViewport = function(canvas){
        this.viewport = {x:canvas.width,y:canvas.height};
    };

    InstancedJellyfish.prototype.updateTime = function(){
        var now = (new Date()).getTime(); // We are here in ms
        var elapsedTime = (now - this.lastUpdateTime);
        this.rotation += (2.0 * elapsedTime) / 1000.0;
        this.uCurrentTime = (now % 100000000) / 1000.0;
        this.whichCaustic = Math.floor((this.uCurrentTime * 30) % 32) + 1;
        this.lastUpdateTime = now;
    };

    InstancedJellyfish.prototype.bindUniforms = function(program){
        GL.uniformMatrix4fv(program.uniform.uWorld, false, this.uWorld);
        GL.uniformMatrix4fv(program.uniform.uWorldViewProj, false, this.uWorldViewProj);
        GL.uniformMatrix4fv(program.uniform.uWorldInvTranspose, false, this.uWorldInvTranspose);
        GL.uniform3fv(program.uniform.uLightPos, this.uLightPos);
        GL.uniform1f(program.uniform.uLightRadius, this.uLightRadius);
        GL.uniform4fv(program.uniform.uLightCol, this.uLightCol);
        GL.uniform4fv(program.uniform.uAmbientCol, this.uAmbientCol);
        GL.uniform4fv(program.uniform.uFresnelCol, this.uFresnelCol);
        GL.uniform1f(program.uniform.uFresnelPower, this.uFresnelPower);
        GL.uniform1f(program.uniform.uCurrentTime, this.uCurrentTime);

        // 2 - Bind texture

        GL.uniform1i(this.program.uniform.uSampler, 0);
        GL.uniform1i(this.program.uniform.uSampler1, 1);

        GL.activeTexture(GL.TEXTURE0);
        GL.bindTexture(GL.TEXTURE_2D,this.textures[0]);

        GL.activeTexture(GL.TEXTURE1);
        GL.bindTexture(GL.TEXTURE_2D, this.textures[this.whichCaustic]);
    }
  InstancedJellyfish.prototype.enableVertexAttribArray = function(){
    GL.enableVertexAttribArray(this.program.attributes.position);
    GL.enableVertexAttribArray(this.program.attributes.normals);
    GL.enableVertexAttribArray(this.program.attributes.colors);
    GL.enableVertexAttribArray(this.program.attributes.texture);
    GL.enableVertexAttribArray(this.program.attributes.instancedOffset);
  };

  InstancedJellyfish.prototype.disableVertexAttribArray = function(){
    GL.disableVertexAttribArray(this.program.attributes.position);
    GL.disableVertexAttribArray(this.program.attributes.normals);
    GL.disableVertexAttribArray(this.program.attributes.colors);
    GL.disableVertexAttribArray(this.program.attributes.texture);
    GL.disableVertexAttribArray(this.program.attributes.instancedOffset);
  };

    InstancedJellyfish.prototype.render = function(){
        this.enableVertexAttribArray();
        var GL = this.GL;
        var program = this.program;

        this.bufferVertexAttributes();
        this.updateUniforms();

        GL.useProgram(program);

        this.bindUniforms(program);

        GLext.drawElementsInstancedANGLE(GL.TRIANGLES, this.indexcount, GL.UNSIGNED_INT, 0,this.jellyfishcount);
        this.disableVertexAttribArray();
    };

    return InstancedJellyfish;
})();