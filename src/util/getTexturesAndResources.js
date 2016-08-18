import THREE from '../../node_modules/three/build/three'

/**
  * The createTexture function
  * @param {Array} images - An array of web loaded images.
  * @param {WebGLRenderingContext} GL - The webgl rendering context.
  * @return {Array} - An array of WebGLTexture objects.
  */

export function createTexture(images,GL){
	return images.map(function(img,i){
      let texture = GL.createTexture();
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

/**
  * The getText function
  * @param {string} url - The url of the text to load.
  * @return {Promise} - A promise of the loaded text.
  */
export function getText(url){
    return new Promise(function(resolve,reject){
    	var request = new XMLHttpRequest();
		request.open('GET', url , true);
		request.onload = function () {
			if (request.status < 200 || request.status > 299) {
				reject('Error: HTTP Status ' + request.status + ' on resource ' + url);
			} else {
				resolve(request.responseText);
			}
		};
		request.send();
  })
};

/**
  * The getImages function
  * @param {Array} list - An array of strings for the locations of the images.
  * @return {Array} - A array of promises for this web loaded images.
  */
export function getImages (list){
	return Promise.all(list.map((url)=>getImage(url)));
	function getImage(url){
    return new Promise((resolve,reject)=>{
		var image = new Image();
		image.onload = ()=>resolve(image);
		image.src = url
    })
  }
}

/**
  * The getThreeTextures function
  * @param {Array} list - An array of strings for the locations of the images.
  * @return {Array} - The loaded texture.
  */
export function getThreeTextures(list){
	let loader = new THREE.TextureLoader();
	return Promise.all(list.map((url,i)=>getThreeTexture(url,i)));
	function getThreeTexture(url,i){
	    return new Promise((resolve,reject)=>{
			loader.load(url, function(texture){
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;
				texture.wrapS = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
				texture.wrapT = (i>0?THREE.RepeatWrapping:THREE.ClampToEdgeWrapping);
				resolve(texture)
			});
    	})
  	}
}

/**
  * The getTexturesJellyfish function !! This is actually an asynchronous load...
  * Use rather the getThreeTextures function
  * @param {Array} list - An array of strings for the locations of the images.
  * @return {Array} - The loaded texture.
  */
export function getTexturesJellyfish(imagesList){
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


