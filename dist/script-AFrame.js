/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _const = __webpack_require__(1);

	'use strict';
	/** @var {object} gui - A global variable for user interface */
	var gui;

	/**
	 * The code bellow simply sets the user interface for changing parameters
	 */
	function JellyfishText() {
	  this.class = "Single";
	}
	var text = new JellyfishText();
	gui = new dat.GUI();

	gui.add(text, 'class', ["Single", "Instanced"]).name("Class").onChange(function (value) {
	  switch (value) {
	    case "Single":
	      entitySceneEl.removeChild(entityJellyfishEl);
	      entityJellyfishEl = document.createElement("a-entity");
	      entityJellyfishEl.setAttribute('single-jellyfish', '');
	      entitySceneEl.appendChild(entityJellyfishEl);
	      break;
	    case "Instanced":
	      entitySceneEl.removeChild(entityJellyfishEl);
	      entityJellyfishEl = document.createElement("a-entity");
	      entityJellyfishEl.setAttribute('instanced-jellyfish', '');
	      entitySceneEl.appendChild(entityJellyfishEl);
	      break;
	    default:
	      throw 'dont know option ' + value;
	  }
	});

	var entitySceneEl = document.querySelector("#scene");
	var entityJellyfishEl = document.querySelector("#jellyfish");
	var entityCameraEl = document.querySelector("#cameraJellyfish");
	entityCameraEl.setAttribute("camera", { fov: _const.CAMERA.ANGLE, near: _const.CAMERA.NEAR, far: _const.CAMERA.FAR });

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var MAX_NUMBER = exports.MAX_NUMBER = 100;
	var WIDTH = exports.WIDTH = 5;
	var CAMERA = exports.CAMERA = { ANGLE: 100, NEAR: 0.1, FAR: 120 }; // NEAR < 1.4 (<sqrt2) if we want to see the gradient
	var USE_FOG = exports.USE_FOG = false; // If set to true and Webgl, don't forget to bind the uniforms
	var UPDATE_FPS_RATE = exports.UPDATE_FPS_RATE = 400;
	var gui = exports.gui = undefined;

/***/ }
/******/ ]);