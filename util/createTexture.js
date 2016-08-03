/**
  * The createTexture function
  * @param {Array} images - An array of web loaded images.
  * @param {WebGLRenderingContext} GL - The webgl rendering context.
  * @return {Array} - An array of WebGLTexture objects.
  */

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

getTexturesJellyfish = function(imagesList){
  var loader = new THREE.TextureLoader();
  return imagesList.map(function(url,i){
    return loader.load(url, function(texture){
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
      texture.wrapT = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
      return texture;
    });
  })
}
