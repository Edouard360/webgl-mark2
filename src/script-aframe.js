import {CAMERA,MAX_NUMBER} from './data/const.js'
import dat from '../node_modules/dat.gui/build/dat.gui'
import AFrameMultipleJellyfish from "./jellyfish/aframe/aframe-multiple-jellyfish";

'use strict';
/** @var {object} gui - A global variable for interface */
var gui = new dat.GUI();

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
  this.averageFPS = "Wait for FPS evaluation";
  this.back = function() {window.location.replace("http://localhost:3000/public/index.html");};
}
var text = new JellyfishText();

gui.add(text, 'back').name("Back")
gui
.add(text, 'class', ["Single","Instanced","Multiple"])
.name("Class")
.onChange((value)=>{
    /**
     * For changing configuration, we remove the entityJellyfishEl as a child from
     * entitySceneEl, recreate this element and re-append it to entitySceneEl
     */
    entitySceneEl.removeChild(entityJellyfishEl);
    entityJellyfishEl = document.createElement("a-entity");
    if(handle.jellyfishCount){handle.jellyfishCount.remove();handle.jellyfishCount = undefined;}
    switch(value){
        case "Single":
        entityJellyfishEl.setAttribute('single-jellyfish', '')
        entitySceneEl.appendChild(entityJellyfishEl);
        break;
        case "Instanced":
        entityJellyfishEl.setAttribute('instanced-jellyfish', 'count',3);
        entitySceneEl.appendChild(entityJellyfishEl);
        handle.jellyfishCount = gui.add(entityJellyfishEl.getAttribute('instanced-jellyfish'),"count",1,MAX_NUMBER)
        .name("Number").step(1)
        handle.jellyfishCount.onChange((value)=>{entityJellyfishEl.setAttribute('instanced-jellyfish', 'count',value)}) //Do we need to remove the event listener ?
        break;
        case "Multiple":
        /**
         * AFrameMultipleJellyfish only creates multiple tags for each jellyfish in the AFrame HTML
         * by appending all these on entityJellyfishEl.
         * Whenever a change for the jellyfishCount is triggered, we delete this main tag, and recreate our whole scene.
         */
        let multipleJellyfish = new AFrameMultipleJellyfish(3,entitySceneEl,entityJellyfishEl)
        handle.jellyfishCount = gui.add(multipleJellyfish,"jellyfishCount",1,MAX_NUMBER)
        .name("Number").step(1)
        handle.jellyfishCount.onChange((value)=>{multipleJellyfish.resetScene(); multipleJellyfish.updateScene(); entityJellyfishEl = multipleJellyfish.entityJellyfishEl })
        break;
        default:
        throw 'dont know option ' + value
  }
})
gui.add(text, 'averageFPS').name("Average FPS").domElement.id = 'averageFPS';

var entitySceneEl = document.querySelector("#scene");
var entityJellyfishEl = document.querySelector("#jellyfish");
var entityCameraEl = document.querySelector("#cameraJellyfish");

entityCameraEl.setAttribute("camera",{fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});



