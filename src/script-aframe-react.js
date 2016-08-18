import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import {MAX_NUMBER} from './data/const.js'
import {gui} from './data/gui.js'
import Camera from './jellyfish/aframe-react/aframe-camera'
import MultipleJellyfish from './jellyfish/aframe-react/aframe-react-multiple-jellyfish'
import {getThreeTextures} from './util/util'

/** The react component representing our scene  */
class JellyfishScene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: 'Single',
      count: 1,
      averageFPS: 'Wait for FPS evaluation',
      loadingTime: 'Loading time'
    }
    this.setUserInterface();
  };
  componentDidMount(){
    this.componentDidUpdate();
  };
  componentDidUpdate(){
    var entityJellyfishEl = document.querySelector("#jellyfish");
    if(this.state.class=='Single'){
      entityJellyfishEl.setAttribute('single-jellyfish',{textures:this.props.textures,count:1})
    }else{
      entityJellyfishEl.setAttribute('instanced-jellyfish',{textures:this.props.textures,count:this.state.count})
    }
  };

  /**
   * The setUserInterface simply sets the user interface for changing parameters
   */
  setUserInterface(){
    gui
    .add(this.state, 'class', ["Single","Instanced","Multiple"])
    .name("Class")
    .onChange((value)=>{this.setState({class:value})})

    gui
    .add(this.state, 'loadingTime')
    .name("Loading Time")
    .domElement.id = 'loadingTime';

    gui
    .add(this.state, 'count',1,MAX_NUMBER)
    .name("Number").step(1)
    .onChange((value)=>{this.setState({count:value})})
    
    gui
    .add(this.state, 'averageFPS')
    .name("Average FPS")
    .domElement.id = 'averageFPS';
  };

  /**
   * Render the scene according to the state of the component
   */
  render () {
    let jellyfish; 
    switch(this.state.class){
      case 'Single':
      jellyfish = <Entity id='jellyfish'>
                    <Camera />
                  </Entity>
      break;
      case 'Instanced':
      jellyfish = <Entity id='jellyfish'>
                    <Camera />
                  </Entity>
      break;
      case 'Multiple':
      jellyfish = <MultipleJellyfish count={this.state.count} textures={this.props.textures}>
                    <Camera />
                  </MultipleJellyfish>
      break;
      default:
    }
    return (
      <Scene id="scene" antialias="on">
        {jellyfish}
        <Entity gradient />
      </Scene>
    );
  }
}

getThreeTextures(require('./data/img/list.json')).then(function(textures){
  ReactDOM.render(<JellyfishScene textures={textures} />, document.querySelector('.scene-container'))
})
