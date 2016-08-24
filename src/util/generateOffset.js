import {MAX_NUMBER,WIDTH,DEMO,CENTER,RADIUS} from '../data/const.js'

/**
  * The generateOffset function
  * @param {string} type - Either a bloc or a circle
  * @return {array} offset - The array containing all the offset.
  */
export function generateOffset(type){
	var offset = [];
	switch(type){
		case "circle":
		  	for(let i = 0; i<MAX_NUMBER;i++){
				let radius = RADIUS.min + Math.random() * (RADIUS.max-RADIUS.min);
				let PHI = Math.PI/2 + (Math.random()-0.5) * Math.PI * RADIUS.anglePHI
				let THETA = Math.random() * 2 * Math.PI
				
				let y = radius * Math.cos(PHI)
				let z = radius * Math.sin(PHI) * Math.cos(THETA)
				let x = radius * Math.sin(PHI) * Math.sin(THETA)

				offset = offset.concat([[x,y,z]])
			}
			break;
		case "bloc":
			for(let i = 0; i<MAX_NUMBER;i++){
				let x = 2*(Math.random() - 0.5)*WIDTH;
				let y = 2*(Math.random() - 0.5)*WIDTH;
				let z = 2*(Math.random() - 0.5)*WIDTH;
				offset = offset.concat([[x,y,z]]);
			}
			break;
		default:
			throw 'dont know type ' + type + 'for generating offset'
	}


	return offset;
}