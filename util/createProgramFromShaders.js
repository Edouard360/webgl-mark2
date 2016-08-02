/**
  * The createProgramFromShaders function
  * @param {WebGLRenderingContext} GL - The webgl rendering context.
  * @param {Object} shaders - Object containing both a vertex and a fragment shader.
  * @param {string} shaders.VS - The vertex shader.
  * @param {string} shaders.FS - The fragment shader.
  */
createProgramFromShaders = function(GL,shaders){
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