import {CAMERA,MAX_NUMBER} from './data/const.js'
import dat from './node_modules/dat.gui/build/dat.gui'
import singleJellyfish from "./jellyfish/AFrame/AFrameSingleJellyfish"
import instancedJellyfish from "./jellyfish/AFrame/AFrameInstancedJellyfish"
import {gradient} from "./jellyfish/AFrame/AFrameGradient"
import {gui} from "./data/gui"

'use strict';
/** @var {object} gui - A global variable for interface */
//var gui;

/**
 * @var {object} handle - A global variable to hold handles
 * @property {int} handle.jellyfishCount - for changing the jellyfish count display between ≠ instances
 */
var handle = {};


/**
 * The code bellow simply sets the user interface for changing parameters
 */
function JellyfishText(){
  this.class = "Single";
}
var text = new JellyfishText();

var customContainer = document.getElementById('my-gui-container');
customContainer.appendChild(gui.domElement);

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
    handle.jellyfishCount.remove();
    break;
    case "Instanced":
    entitySceneEl.removeChild(entityJellyfishEl);
    entityJellyfishEl = document.createElement("a-entity") 
    entityJellyfishEl.setAttribute('instanced-jellyfish', 'count',3);
    entitySceneEl.appendChild(entityJellyfishEl);
    handle.jellyfishCount = gui.add(entityJellyfishEl.getAttribute('instanced-jellyfish'),"count",1,MAX_NUMBER)
    .name("Number").step(1)
    handle.onChange = handle.jellyfishCount.onChange(function(value){entityJellyfishEl.setAttribute('instanced-jellyfish', 'count',value)})
    break;
    default:
    throw 'dont know option ' + value
  }
})

var entitySceneEl = document.querySelector("#scene");
var entityJellyfishEl = document.querySelector("#jellyfish");
var entityCameraEl = document.querySelector("#cameraJellyfish");

entityCameraEl.setAttribute("camera",{fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});



