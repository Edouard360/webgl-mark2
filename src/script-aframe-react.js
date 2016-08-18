'use strict';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
import Camera from './jellyfish/aframe-react/aframe-camera'
import MultipleJellyfish from './jellyfish/aframe-react/aframe-react-multiple-jellyfish'
import {getThreeTextures} from './util/util'
import {MAX_NUMBER} from './data/const.js'
import {gui} from './data/gui.js'

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
      jellyfish = <Entity id='jellyfish' single-jellyfish={{assets:'#texture', count:1}} >
                    <Camera />
                  </Entity>
      break;
      case 'Instanced':
      jellyfish = <Entity id='jellyfish' instanced-jellyfish={{assets:'#texture', count:this.state.count}}>
                    <Camera />
                  </Entity>
      break;
      case 'Multiple':
      jellyfish = <MultipleJellyfish count={this.state.count} assets="#texture" >
                    <Camera />
                  </MultipleJellyfish>
      break;
      default:
    }
    return (
      <Scene id="scene" antialias="on">
        <a-assets>
          {this.props.assets.map((url,i)=>{return(<img key={i} id="texture" src={url} />)})}
        </a-assets>
        {jellyfish}
        <Entity gradient />
      </Scene>
    );
  }
}

ReactDOM.render(<JellyfishScene assets={require('./data/img/list.json')} />, document.querySelector('.scene-container'))




