/** Abstract class representing a jellyfish. */
class AbstractTimer{

  constructor() {
    this.rotation = 0;
    this.lastUpdateTime = this.startTime = (new Date()).getTime();
    this.countForFPS = 0;
  };

  updateTime(){
    this.now = (new Date()).getTime(); // We are here in ms
    this.elapsedTime = (this.now - this.lastUpdateTime);
    this.lastUpdateTime = this.now;

    // Display the time only every 200 FPS - otherwise, the influence is not negligible.
    if (this.countForFPS++ == 200) {
      this.endTime = this.now;
      this.countForFPS = 0; 
      var info = info || undefined; 
      if(info){info.textContent = "Average FPS : "+ (200 * 1000 / (this.endTime - this.startTime)).toPrecision(4);+"\n";}
      this.startTime = this.endTime;
    }
  };

}

