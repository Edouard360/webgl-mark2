// The Gradient object

window.Gradient = (function(){

    var Gradient = function (GL, shaders) {
        this.GL = GL;

        this.program = createProgramFromShaders(shaders);

        var data = {
            vertices:[-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0],
            uvIn:[1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]
        }

        this.getAttribLocation();
        this.createAndFillBuffer(data);
        this.getUniformLocation();
        this.setUniforms();
    };

    Gradient.prototype.getAttribLocation = function(){
        this.program.attributes={
          position: GL.getAttribLocation(this.program, "position"),
          uvIn: GL.getAttribLocation(this.program, "uvIn")
        }
    }

    Gradient.prototype.createAndFillBuffer = function(data){

        //WILL NEED TO BE ENABLED
        this.verticesBuffer= GL.createBuffer ();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);

        this.uvBuffer= GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.uvBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.uvIn),GL.STATIC_DRAW);

    };

    Gradient.prototype.bufferVertexAttributes = function(){
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.vertexAttribPointer(this.program.attributes.position,
            2,
            GL.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT*(2),
            0
            );
        GL.bindBuffer(GL.ARRAY_BUFFER, this.uvBuffer);
        GL.vertexAttribPointer(this.program.attributes.uvIn,
            2,
            GL.FLOAT,
            false,
            Float32Array.BYTES_PER_ELEMENT*(2),
            0
            );
    };

    Gradient.prototype.getUniformLocation = function(){
        this.program.uniform = {
            color1:GL.getUniformLocation(this.program, "color1"),
            color2:GL.getUniformLocation(this.program, "color2"),
        }
    }

    Gradient.prototype.setUniforms = function(){
        this.color1 = vec3.fromValues(0.360784314, 0.584313725, 1.0); //Light blue
        this.color2 = vec3.fromValues(0.074509804, 0.156862745, 0.619607843); //dark blue
    };

    Gradient.prototype.bindUniforms = function(){
        GL.uniform3fv(this.program.uniform.color1, this.color1);
        GL.uniform3fv(this.program.uniform.color2, this.color2);
    };

    Gradient.prototype.render = function (){
        var GL = this.GL;
        var program = this.program;

        this.bufferVertexAttributes();

        GL.useProgram(program);

        this.bindUniforms();

        GL.drawArrays(GL.TRIANGLE_STRIP, 0,4);
    };

    return Gradient;

})();
