/** Class representing a group of jellyfish. */
class MultipleJellyfish extends Timer{

  /**
   * Constructor for the abstract Jellyfish.
   * We just build an array of Jellyfish, with its program and its own data.
   * @param {WebGLRenderingContext} GL - The webgl rendering context.
   * @param {Object} jellyfish - An object containing the necessary data for a jellyfish.
   */
  constructor(GL,jellyfish){
    super();
    jellyfish.offset = [];
    for(let i = 0; i<MAX_NUMBER;i++){
      jellyfish.offset = jellyfish.offset.concat([[2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH]]);
    }
    this.jellyfishGroup = jellyfish.offset.map((coord)=>{
      var jellyfish_tmp = newDataJellyfishWithOffset(coord[0],coord[1],coord[2]);
      jellyfish_tmp.images = jellyfish.images;
      return new SingleJellyfish(GL,jellyfish_tmp);
    });

    function newDataJellyfishWithOffset(x,y,z){
      var jellyfish_tmp = JSON.parse(JSON.stringify(jellyfish));
      jellyfish_tmp.position = jellyfish.position.map((coord,i)=>{
        return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
      });
      return jellyfish_tmp
    }
  };

  /**
   * Set the viewport member of the class.
   * @param {int} x - The width of the canvas.
   * @param {int} y - The height of the canvas.
   */
  updateViewport(x,y){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.updateViewport(x,y);
    });
  };

  /**
   * Render the jellyfish by iterating over the array.
   */  
  render(){
    this.updateTime();
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.render();
    })
  };
}

 
