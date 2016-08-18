import {CAMERA,MAX_NUMBER} from './data/const.js'
import {gui, text} from './data/gui.js'
import AFrameMultipleJellyfish from "./jellyfish/aframe/aframe-multiple-jellyfish";
import {getThreeTextures} from './util/util'

'use strict';

function main(textures){
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
          entityJellyfishEl.setAttribute('single-jellyfish', {count:1, textures:textures})
          entitySceneEl.appendChild(entityJellyfishEl);
          handle.jellyfishCount = gui.add(text, 'count',1,1).name("Number")
          break;
          case "Instanced":
          entityJellyfishEl.setAttribute('instanced-jellyfish', {count:3, textures:textures});
          entitySceneEl.appendChild(entityJellyfishEl);
          handle.jellyfishCount = gui.add(entityJellyfishEl.getAttribute('instanced-jellyfish'),"count",1,MAX_NUMBER).name("Number").step(1)
          handle.jellyfishCount.onChange((value)=>{entityJellyfishEl.setAttribute('instanced-jellyfish', {count:value})}) //Do we need to remove the event listener ?
          break;
          case "Multiple":
          /**
           * AFrameMultipleJellyfish only creates multiple tags for each jellyfish in the AFrame HTML
           * by appending all these on entityJellyfishEl.
           * Whenever a change for the jellyfishCount is triggered, we delete this main tag, and recreate our whole scene.
           */
          let multipleJellyfish = new AFrameMultipleJellyfish(3,entitySceneEl,entityJellyfishEl)
          handle.jellyfishCount = gui.add(multipleJellyfish,"jellyfishCount",1,MAX_NUMBER).name("Number").step(1)
          handle.jellyfishCount.onChange((value)=>{multipleJellyfish.resetScene(); multipleJellyfish.updateScene(); entityJellyfishEl = multipleJellyfish.entityJellyfishEl })
          break;
          default:
          throw 'dont know option ' + value
    }
    handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
    handle.averageFPS.domElement.id = 'averageFPS';
  })

  gui
  .add(text, 'loadingTime', ["Single","Instanced","Multiple"])
  .name("Loading Time").domElement.id = 'loadingTime';

  handle.jellyfishCount = gui.add(text, 'count',1,1).name("Number")
  handle.averageFPS = gui.add(text, 'averageFPS').name("Average FPS")
  handle.averageFPS.domElement.id = 'averageFPS';

  var entitySceneEl = document.querySelector("#scene");
  var entityJellyfishEl = document.querySelector("#jellyfish");
  var entityCameraEl = document.querySelector("#cameraJellyfish");

  entityJellyfishEl.setAttribute('single-jellyfish', {textures:textures,count:1})
  entityCameraEl.setAttribute("camera",{fov : CAMERA.ANGLE, near : CAMERA.NEAR, far : CAMERA.FAR});
}


getThreeTextures(require('./data/img/list.json')).then(main)
