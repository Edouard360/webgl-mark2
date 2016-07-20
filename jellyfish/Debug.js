// The Debug object

window.Debug = (function(){

    var Debug = function (GL, shaders,images) {
        this.GL = GL;

        this.program = createProgramFromShaders(shaders);

        var data = {
            vertices:[-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0],
            uvCoordinates:[0., 0., 0.0, 1.0, 1.0, 0.0, 1.0, 1.0]
        }

        this.getAttribLocation();
        this.createAndFillBuffer(data);
        this.prepareTextures(images);
        this.getUniformLocation();
        console.log(this.textures)
    };

    Debug.prototype.getAttribLocation = function(){
        this.program.attributes={
          position: GL.getAttribLocation(this.program, "position"),
          uvCoordinates: GL.getAttribLocation(this.program, "uvCoordinates")
        }
    }

    Debug.prototype.createAndFillBuffer = function(data){
      console.log(data)

        //WILL NEED TO BE ENABLED
        this.verticesBuffer= GL.createBuffer ();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);

        this.uvBuffer= GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.uvBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.uvCoordinates),GL.STATIC_DRAW);

    };

    Debug.prototype.bufferVertexAttributes = function(){
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.vertexAttribPointer(this.program.attributes.position,
            2,
            GL.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT*(2),
            0
            );
        GL.bindBuffer(GL.ARRAY_BUFFER, this.uvBuffer);
        GL.vertexAttribPointer(this.program.attributes.uvCoordinates,
            2,
            GL.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT*(2),
            0
            );
    };

    Debug.prototype.prepareTextures = function(images){
        this.textures = images.map(function(img,i){
            GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);

            texture = GL.createTexture();
            GL.bindTexture(GL.TEXTURE_2D, this.texture);
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_S,(i>0?GL.REPEAT:GL.CLAMP_TO_EDGE));
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_WRAP_T,(i>0?GL.REPEAT:GL.CLAMP_TO_EDGE));
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MIN_FILTER,GL.LINEAR);
            GL.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_MAG_FILTER,GL.LINEAR);
            GL.texImage2D(GL.TEXTURE_2D,0, GL.RGBA,GL.RGBA,GL.UNSIGNED_BYTE,img);
            GL.bindTexture(GL.TEXTURE_2D,null);
            return texture;
        });
    };

    Debug.prototype.getUniformLocation = function(){
        this.program.uniform = {
            uSampler:GL.getUniformLocation(this.program, "uSampler")
        }
    }

    Debug.prototype.bindUniforms = function(){
      GL.uniform1i(this.program.uniform.uSampler, 0);

      GL.activeTexture(GL.TEXTURE0);
      GL.bindTexture(GL.TEXTURE_2D,this.textures[0]);
    };

    Debug.prototype.render = function (){
        var GL = this.GL;
        var program = this.program;

        this.bufferVertexAttributes();

        GL.useProgram(program);

        this.bindUniforms();

        GL.drawArrays(GL.TRIANGLE_STRIP, 0,4);
    };

    return Debug;

})();
