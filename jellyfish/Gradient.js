// *** Gradient Object *** //

function Gradient(shaders){

    var program = createProgramFromShaders(shaders);
    var data = {
            vertices:[-1.0,-1.0,-1.0, 1.0,1.0, -1.0, 1.0, 1.0],
            uvIn:[1.0, 1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0]
        };
    var attributeLocation = getAttribLocation(program);
    var buffer = createAndFillBuffer(data); 
    var uniformLocation = getUniformLocation(program);
    var uniform = setUniforms();

    var render = function(){
        enableVertexAttribArray();
        GL.useProgram(program);
        bufferVertexAttributes(buffer,attributeLocation);
        bindUniforms(uniformLocation,uniform);
        GL.drawArrays(GL.TRIANGLE_STRIP, 0,4);
        disableVertexAttribArray();
    };
    return {render:render};

    // *** Functions called when initializing Gradient Object ***//

    function getAttribLocation(program){
        var attributeLocation={
          position: GL.getAttribLocation(program, "position"),
          uvIn: GL.getAttribLocation(program, "uvIn")
        }
        return attributeLocation;
    };

    function createAndFillBuffer(data){
        //WILL NEED TO BE ENABLED
        var vertices= GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, vertices);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.vertices),GL.STATIC_DRAW);

        var uv= GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER,uv);
        GL.bufferData(GL.ARRAY_BUFFER,new Float32Array(data.uvIn),GL.STATIC_DRAW);

        return {vertices:vertices,uv:uv}
    };

    function getUniformLocation(program){
        return{
            color1:GL.getUniformLocation(program, "color1"),
            color2:GL.getUniformLocation(program, "color2")
        }
    };

    function setUniforms(){
        return{
            color1 : vec3.fromValues(0.360784314, 0.584313725, 1.0),
            color2: vec3.fromValues(0.074509804, 0.156862745, 0.619607843)
        }
    };

    // *** Functions called in the render loop *** //
    function enableVertexAttribArray(){
        GL.enableVertexAttribArray(attributeLocation.position);
        GL.enableVertexAttribArray(attributeLocation.uvIn);
    };

    function bufferVertexAttributes(buffer,attributeLocation){
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.vertices);
        GL.vertexAttribPointer(attributeLocation.position, 2, GL.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*(2), 0);
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.uv);
        GL.vertexAttribPointer(attributeLocation.uvIn, 2, GL.FLOAT, false, Float32Array.BYTES_PER_ELEMENT*(2), 0 );
        GL.bindBuffer(GL.ARRAY_BUFFER, null);
    };

    function bindUniforms(uniformLocation,uniform){
        GL.uniform3fv(uniformLocation.color1, uniform.color1);
        GL.uniform3fv(uniformLocation.color2, uniform.color2);
    };

    function disableVertexAttribArray(){
        GL.disableVertexAttribArray(attributeLocation.position);
        GL.disableVertexAttribArray(attributeLocation.uvIn);
    };

}
