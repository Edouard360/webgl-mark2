import {Entity} from 'aframe-react';
import React from 'react';
import {WIDTH,SCALE} from '../../data/const';

/** The Multiple Jellyfish component creates one <Entity> for each jellyfish
 *  And render all these entities along with its children (here the camera)
 */
class MultipleJellyfish extends React.Component{
	constructor(props) {
    	super(props);
	};

	componentDidMount(){
	    var entityJellyfishEl = document.querySelectorAll("#jellyfish");
	    entityJellyfishEl.forEach((e)=>{e.setAttribute('single-jellyfish','textures',this.props.textures)})
  	};

	render(){
		var rows = [];
		for (var i=0; i < this.props.count; i++) {
			var position = ""+2*(Math.random() - 0.5)*WIDTH*SCALE.x +
						" "+2*(Math.random() - 0.5)*WIDTH*SCALE.y +
						" "+2*(Math.random() - 0.5)*WIDTH*SCALE.z
		    rows.push(<Entity key={i+1} id="jellyfish" single-jellyfish={{position:position}} />);
		}
		return(
			<Entity>
				{rows}
				{this.children} 
			</Entity>
		)
	}
}

export default MultipleJellyfish
