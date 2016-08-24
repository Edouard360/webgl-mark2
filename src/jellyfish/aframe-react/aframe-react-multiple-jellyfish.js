import {Entity} from 'aframe-react';
import React from 'react';
import {generateOffset} from '../../util/util.js'
import {DISPLAY,SCALE} from '../../data/const.js'

/** The Multiple Jellyfish component creates one <Entity> for each jellyfish
 *  And render all these entities along with its children (here the camera)
 */
class MultipleJellyfish extends React.Component{
	constructor(props) {
    	super(props);
	};

	render(){
		var rows = [];
		var offset = generateOffset(DISPLAY).slice(0,this.props.count).map((array,i)=>{
			var position = ""+array[0]*SCALE.x +
			" "+array[1]*SCALE.y +
			" "+array[2]*SCALE.z
		    rows[i] = <Entity key={i+1} id="jellyfish" single-jellyfish={{position:position, assets:this.props.assets}} />;
		})

		return(
			<Entity>
				{rows}
				{this.children} 
			</Entity>
		)
	}
}

export default MultipleJellyfish
