import {CAMERA} from './data/const.js'

'use strict';
/** @var {object} gui - A global variable for user interface */
var gui;

/**
 * The code bellow simply sets the user interface for changing parameters
 */
function JellyfishText(){
  this.class = "Single";
}
var text = new JellyfishText();
gui = new dat.GUI();

gui
.add(text, 'class', ["Single","Instanced"])
.name("Class")
.onChange((value)=>{
  switch(value){
    case "Single":
    entitySceneEl.removeChild(entityJellyfishEl);
    entityJellyfishEl = document.createElement("a-entity");
    entityJellyfishEl.setAttribute('single-jellyfish', '')
    entitySceneEl.appendChild(entityJellyfishEl);
    break;
    case "Instanced":
    entitySceneEl.removeChild(entityJellyfishEl);
    entityJellyfishEl = document.createElement("a-entity") 
    entityJellyfishEl.setAttribute('instanced-jellyfish', '')
    entitySceneEl.appendChild(entityJellyfishEl);
    break;
    default:
    throw 'dont know option ' + value
  }
});

var entitySceneEl = document.querySelector("#scene");
var entityJellyfishEl = document.querySelector("#jellyfish");
var entityCameraEl = document.querySelector("#cameraJellyfish");
entityCameraEl.setAttribute("camera",{fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});
