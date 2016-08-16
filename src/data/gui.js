import dat from '../../node_modules/dat.gui/build/dat.gui'

dat.GUI.TEXT_CLOSE = "Collapse Controls"
dat.GUI.TEXT_CLOSED = "Collapse Controls"
dat.GUI.TEXT_OPEN = "Expand Controls"

/** @var {object} gui - A global variable for interface */
var gui = new dat.GUI()

/** This function is only for the user interface */
function JellyfishText(){
  this.back = function() {window.location.replace("http://localhost:3000/public/index.html");};
  this.class = "Single";
  this.count = 1;
  this.averageFPS = "Wait for FPS evaluation";
}
var text = new JellyfishText();

gui.add(text, 'back').name("Back")

export var gui = gui, text = text