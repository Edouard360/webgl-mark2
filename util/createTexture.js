createProgramFromShaders = function(shaders){
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

createTexture = function(images,GL){
	return images.map(function(img,i){
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
}

