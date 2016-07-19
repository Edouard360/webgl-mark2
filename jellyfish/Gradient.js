// The Gradient object

window.Gradient = (function(){

    var Gradient = function (GL, shaders) {
        this.GL = GL;

        this.program = new WGLUProgram(GL);
        this.program.attachShaderSource(shaders.VS, GL.VERTEX_SHADER);
        this.program.attachShaderSource(shaders.FS, GL.FRAGMENT_SHADER);

        this.program.bindAttribLocation({
            position:0,
            uvIn:1
        });

        this.program.link();

        var data = {
            vertices:[-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0],
            uvIn:[1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]
        }
      
        this.createAndFillBuffer(data);
        this.setUniforms();

    };

    Gradient.prototype.createAndFillBuffer = function(data){

        //WILL NEED TO BE ENABLED
        this.verticesBuffer= GL.createBuffer ();
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);  

        this.uvBuffer= GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,this.uvBuffer);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.uvIn),GL.STATIC_DRAW);

        GL.enableVertexAttribArray(this.program.attrib.position);
        GL.enableVertexAttribArray(this.program.attrib.uvIn);
    };

    Gradient.prototype.bindBuffers = function(){
        GL.bindBuffer(GL.ARRAY_BUFFER, this.verticesBuffer);
        GL.vertexAttribPointer(this.program.attrib.position, 
            2,
            GL.FLOAT, 
            false,
            Float32Array.BYTES_PER_ELEMENT*(2),
            0
            );
        GL.bindBuffer(GL.ARRAY_BUFFER, this.uvBuffer);
        GL.vertexAttribPointer(this.program.attrib.uvIn, 
            2, 
            GL.FLOAT, 
            false, 
            Float32Array.BYTES_PER_ELEMENT*(2),
            0 
            );
    };    

    Gradient.prototype.setUniforms = function(){
        this.color1 = vec3.fromValues(0.360784314, 0.584313725, 1.0); //Light blue
        this.color2 = vec3.fromValues(0.074509804, 0.156862745, 0.619607843); //dark blue
    };

    Gradient.prototype.render = function (){
        var GL = this.GL;
        var program = this.program;
        this.bindBuffers();

        program.use();

        GL.uniform3fv(program.uniform.color1, this.color1);
        GL.uniform3fv(program.uniform.color2, this.color2);
 
        GL.drawArrays(GL.TRIANGLE_STRIP, 0,4);
    };

    return Gradient;

})();

