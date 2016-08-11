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
