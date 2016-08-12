import {createProgramFromShaders} from '../../util/util'
import {vec3} from '../../node_modules/gl-matrix/src/gl-matrix.js'

// *** Gradient Object *** //
class Gradient{
    constructor(GL,gradient){
        this.GL = GL;
        this.program = createProgramFromShaders(GL,gradient.shaders);
        this.attributes = {
            position:   {data: [-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0]},
            uvIn:       {data: [1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]}
        }
        this.setAttribLocationAndBuffers();

        this.uniform = {
            color1:             {value: vec3.fromValues(0.360784314, 0.584313725, 1.0),         func: "uniform3fv"},
            color2:             {value: vec3.fromValues(0.074509804, 0.156862745, 0.619607843), func: "uniform3fv"}
        }
        this.getUniformLocation();
    }

    render(){
        this.GL.useProgram(this.program)
        this.enableVertexAttribArray();
        this.bufferVertexAttributes();
        this.bindUniforms();
        this.GL.drawArrays(this.GL.TRIANGLE_STRIP, 0,4);
        this.disableVertexAttribArray();
    }

    setAttribLocationAndBuffers(){
        for (let name in this.attributes){
            this.attributes[name].location = this.GL.getAttribLocation(this.program, name);

            this.attributes[name].buffer = this.GL.createBuffer();
            this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.attributes[name].buffer);
            this.GL.bufferData(this.GL.ARRAY_BUFFER,new Float32Array(this.attributes[name].data),this.GL.STATIC_DRAW);
        }
    }

    getUniformLocation(){
        for (let name in this.uniform){
           this.uniform[name].location = this.GL.getUniformLocation(this.program, name);
        }
    }

    bindUniforms(){
        for (let name in this.uniform){
            this.GL[this.uniform[name].func](this.uniform[name].location, this.uniform[name].value);
        }
    }

    bufferVertexAttributes(){
        for (let name in this.attributes){        
            this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.attributes[name].buffer);
            this.GL.vertexAttribPointer(this.attributes[name].location, 2, this.GL.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*(2), 0);
        }
        this.GL.bindBuffer(this.GL.ARRAY_BUFFER, null);
    }
    enableVertexAttribArray(){
        for (let name in this.attributes){
            this.GL.enableVertexAttribArray(this.attributes[name].location);
        }
    }
    disableVertexAttribArray(){
        for (let name in this.attributes){
            this.GL.disableVertexAttribArray(this.attributes[name].location);
        }
    }
}

export default Gradient;