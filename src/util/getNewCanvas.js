/**
  * The getNewCanvas function
  * @param {object} canvas_container - A container that will append the future canvas.
  * @return {object} canvas - A newly created canvas.
  */
export function getNewCanvas(canvas_container){
	while(canvas_container.firstChild) {
	    canvas_container.removeChild(canvas_container.firstChild);
	}
	let canvas = document.createElement('canvas');
	canvas.setAttribute('id','canvas_webgl');
	canvas_container.appendChild(canvas);
	return canvas;
}