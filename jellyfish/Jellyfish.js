// The Jellyfish object

window.Jellyfish = (function(){

    var Jellyfish = function (GL, data) {
        this.GL = GL;
        console.log(data);

        this.program = this.createAndInitProgram(data.shaders);

        this.createAndFillBuffers(data.jellyfish);
        this.prepareTextures(data.jellyfish.images);
        this.getUniformLocation();
        this.setUniforms();

        this.indexcount = data.jellyfish.faces.length;
    };

    Jellyfish.prototype.createAndInitProgram = function(shaders){
        var vertexShader = GL.createShader(GL.VERTEX_SHADER);
        GL.shaderSource(vertexShader, shaders.VS);
        GL.compileShader(vertexShader);

        if (!GL.getShaderParameter(vertexShader, GL.COMPILE_STATUS)) {
            console.log(GL.getShaderInfoLog(vertexShader));
            return null;
        }

        var fragmentShader = GL.createShader(GL.FRAGMENT_SHADER);
        GL.shaderSource(fragmentShader, shaders.FS);
        GL.compileShader(fragmentShader);

        if (!GL.getShaderParameter(fragmentShader, GL.COMPILE_STATUS)) {
            console.log(GL.getShaderInfoLog(fragmentShader));
            return null;
        }

        shaderProgram = GL.createProgram();
        GL.attachShader(shaderProgram, vertexShader);
        GL.attachShader(shaderProgram, fragmentShader);

        GL.linkProgram(shaderProgram);

        if ( !GL.getProgramParameter( shaderProgram, GL.LINK_STATUS) ) {
            var info = GL.getProgramInfoLog(shaderProgram);
            throw "Could not compile WebGL program. \n\n" + info;
        }

        return shaderProgram;
    };

    Jellyfish.prototype.createAndFillBuffers = function(data){

        //WILL NEED TO BE ENABLED
        this.verticesBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);

        this.vertexPositionAttribute = GL.getAttribLocation(this.program, "aVertexPosition");  
        GL.enableVertexAttribArray(this.vertexPositionAttribute);

        this.normalsBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.normalsBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.normals),GL.STATIC_DRAW);

        this.vertexNormalAttribute = GL.getAttribLocation(this.program, "aVertexNormal");
        GL.enableVertexAttribArray(this.vertexNormalAttribute);
        
        this.colorsBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.colorsBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.colors),GL.STATIC_DRAW);

        this.vertexColorAttribute = GL.getAttribLocation(this.program, "aVertexColor");
        GL.enableVertexAttribArray(this.vertexColorAttribute);

        this.textureBuffer = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.textureBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.texture),GL.STATIC_DRAW);

        this.vertexTextureAttribute = GL.getAttribLocation(this.program, "aTextureCoord");
        GL.enableVertexAttribArray(this.vertexTextureAttribute);
        
        //WILL NOT NEED TO BE ENABLED
        this.indexBuffer= GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint32Array(data.faces), GL.STATIC_DRAW);
    };

    Jellyfish.prototype.bufferVertexAttributes = function(){
        bufferAttribute(this.verticesBuffer, this.vertexPositionAttribute);
        bufferAttribute(this.normalsBuffer, this.vertexNormalAttribute);
        bufferAttribute(this.colorsBuffer, this.vertexColorAttribute);
        bufferAttribute(this.textureBuffer, this.vertexTextureAttribute);

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
    }; 

    Jellyfish.prototype.prepareTextures = function(images){
        this.textures = images.map(function(img,i){
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
        this.world = mat4.create();
        this.worldViewProjection = mat4.create();
        this.worldInverseTranspose = mat4.create();
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
        this.world = mat4.create();
        mat4.translate(this.world,this.world,   [0.0, 5.0, -75.0]);
        mat4.rotate(this.world,this.world,      glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 30.0),   [0.0, 1.0, 0.0]);
        mat4.rotate(this.world,this.world,      glMatrix.toRadian(Math.sin(this.rotation / 20.0) * 30.0),   [1.0, 0.0, 0.0]);
        mat4.scale(this.world,this.world,       [5.0, 5.0, 5.0]);
        mat4.translate(this.world,this.world,   [0.0, glMatrix.toRadian(Math.sin(this.rotation / 10.0) * 2.5), 0.0])

        mat4.perspective(this.worldViewProjection, glMatrix.toRadian(30.0), this.viewport.x/this.viewport.y, 20.0,120.0);
        mat4.multiply(this.worldViewProjection,this.worldViewProjection, this.world);

        mat4.invert(this.worldInverseTranspose, this.world);
        mat4.transpose(this.worldInverseTranspose, this.worldInverseTranspose);
    };

    Jellyfish.prototype.updateViewport = function(canvas){
        this.viewport = {x:canvas.width,y:canvas.height};
    };

    Jellyfish.prototype.updateTime = function(){
        var now = (new Date()).getTime(); // We are here in ms
        var elapsedTime = (now - this.lastUpdateTime);
        this.rotation += (2.0 * elapsedTime) / 1000.0;
        this.uCurrentTime = (now % 100000000) / 1000.0;
        this.whichCaustic = Math.floor((this.uCurrentTime * 30) % 32) + 1;
        this.lastUpdateTime = now;
    };

    Jellyfish.prototype.bindUniforms = function(program){
        GL.uniformMatrix4fv(program.uniform.uWorld, false, this.world);
        GL.uniformMatrix4fv(program.uniform.uWorldViewProj, false, this.worldViewProjection);
        GL.uniformMatrix4fv(program.uniform.uWorldInvTranspose, false, this.worldInverseTranspose);
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

    Jellyfish.prototype.render = function(){
        var GL = this.GL;
        var program = this.program; 
        this.bufferVertexAttributes();

        this.updateUniforms();
        GL.useProgram(program);
        this.bindUniforms(program);

        GL.drawElements(GL.TRIANGLES, this.indexcount, GL.UNSIGNED_INT, 0);
    };

    return Jellyfish;

})();

