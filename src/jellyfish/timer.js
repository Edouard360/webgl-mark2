import {UPDATE_FPS_RATE} from '../data/const';

/** Class representing a timer. */
class Timer{

  constructor() {
    this.resetTimer();
  };

  resetTimer(){
    this.rotation = 0;
    this.lastUpdateTime = this.startTime = (new Date()).getTime();
    this.countForFPS = 0;
    this.averageFPS = "Wait for FPS update";
    this.timerIsNew = true;
  };

  updateTime(){
    this.now = (new Date()).getTime(); // We are here in ms
    this.elapsedTime = (this.now - this.lastUpdateTime);
    this.lastUpdateTime = this.now;

    let parent, input;

    // Here, the loading time means the time between the initialization of the timer
    // And the time at which the first frame is rendered. 
    // We wait countForFPS == 2, because we need to be sure that
    // - One update has indedd taken place
    // - We are at the very beginning of the second update
    if(this.timerIsNew && this.countForFPS == 2){
      this.timerIsNew = false;
      parent =document.getElementById("loadingTime");
      parent.removeChild(parent.children[0]);
      input = document.createElement("input")
      input.setAttribute("type", "text")
      input.setAttribute("readonly","")
      input.setAttribute("value", this.now - this.startTime);
      parent.appendChild(input)
    }

    // Display the time only every 200 FPS - otherwise, the influence is not negligible.
    // Using gui.dat from Google for the nice interface doesn't impact performance since
    // We manually refresh the FPS at our desired rate (every 500 frames, for instance)...
    if(this.countForFPS++ == UPDATE_FPS_RATE) {
      this.endTime = this.now;
      this.countForFPS = 0; 
      this.averageFPS = (UPDATE_FPS_RATE * 1000 / (this.endTime - this.startTime)).toPrecision(4);

      parent =document.getElementById("averageFPS");
      parent.removeChild(parent.children[0]);
      input = document.createElement("input")
      input.setAttribute("type", "text")
      input.setAttribute("readonly","")
      input.setAttribute("value", this.averageFPS);
      parent.appendChild(input)
      this.startTime = this.endTime;
    }
  };

}

export default Timer;