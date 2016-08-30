'use strict';
import AFrameMultipleJellyfish from "./jellyfish/aframe/aframe-multiple-jellyfish";
import {getThreeTextures} from './util/util'
import {CAMERA,MAX_NUMBER} from './data/const.js'
import {gui, text} from './data/gui.js'

/**
 * @var {object} handle - A global variable to hold handles
 * @property {int} handle.jellyfishCount - for changing the jellyfish count display between ≠ instances
 */
var handle = {};

/**
 * The code bellow simply sets the user interface for changing parameters
 */
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
    handle.jellyfishCount.remove();
    handle.averageFPS.remove();
    switch(value){
        case "Single":
        entityJellyfishEl.setAttribute('single-jellyfish', {count:1, assets:"#texture"})
        entitySceneEl.appendChild(entityJellyfishEl);
        handle.jellyfishCount = gui.add(text, 'count',1,1).name("Number")
        break;
        case "Instanced":
        entityJellyfishEl.setAttribute('instanced-jellyfish', {count:3, assets:"#texture"});
        entitySceneEl.appendChild(entityJellyfishEl);
        handle.jellyfishCount = gui.add(entityJellyfishEl.getAttribute('instanced-jellyfish'),"count",1,MAX_NUMBER).name("Number").step(1)
        handle.jellyfishCount.onChange((value)=>{entityJellyfishEl.setAttribute('instanced-jellyfish', {count:value})}) //Do we need to remove the event listener ?
        break;
        case "Multiple":
        /**
         * AFrameMultipleJellyfish only creates multiple tags for each jellyfish in the AFrame HTML
         * by appending all these on the entityJellyfishEl tag.
         * Whenever a change for the jellyfishCount is triggered, we delete this main tag, and recreate our whole scene.
         */
        let multipleJellyfish = new AFrameMultipleJellyfish(3,entitySceneEl,entityJellyfishEl)
        handle.jellyfishCount = gui.add(multipleJellyfish,"jellyfishCount",1,MAX_NUMBER).name("Number").step(1)
        handle.jellyfishCount.onChange((value)=>{multipleJellyfish.resetScene(); multipleJellyfish.updateScene(); entityJellyfishEl = multipleJellyfish.entityJellyfishEl })
        break;
        default:
        throw 'dont know option ' + value
  }
  
  entityCameraEl = document.createElement("a-camera");
  entityCameraEl.setAttribute("camera",{active:true,fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});
  entityCameraEl.setAttribute("look-controls","");
  entityJellyfishEl.appendChild(entityCameraEl);
  handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
  handle.averageFPS.domElement.id = 'averageFPS';
})

gui
.add(text, 'loadingTime', ["Single","Instanced","Multiple"])
.name("Loading Time").domElement.id = 'loadingTime';
handle.jellyfishCount = gui.add(text, 'count',1,1).name("Number")
handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
handle.averageFPS.domElement.id = 'averageFPS';

/** Add all the assets to the scene */
var assetsEl = document.querySelector("#assets");
require('./data/img/listpng.json').map((url,i)=>{
  let img = document.createElement('img');
  img.setAttribute('src',url)
  img.setAttribute('id',"texture")
  assetsEl.appendChild(img); 
})

/** Query the main elements and sets the initial scene with a single-jellyfish */
var entitySceneEl = document.querySelector("#scene");
var entityJellyfishEl = document.querySelector("#jellyfish");
var entityCameraEl = document.querySelector("#cameraJellyfish");

entityJellyfishEl.setAttribute('single-jellyfish', {count:1,assets:"#texture"})
entityCameraEl.setAttribute("camera",{active:true,fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});
entityCameraEl.setAttribute("look-controls","");
entityCameraEl.setAttribute("wasd-controls","");

