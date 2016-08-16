import Timer from '../timer';
import SingleJellyfish from './single-jellyfish';
import {MAX_NUMBER,WIDTH} from '../../data/const.js'

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
    this.GL = GL;
    this.jellyfish = jellyfish;
    this.jellyfishCount = 3;
    this.jellyfishGroup = [];
    this.viewport = {};
    this.updateJellyfishGroup();
  };

  /**
   * The updateJellyfishGroup function checks if jellyfishCount has changed, in which case
   * it reinitializes the whole jellyfish group
   */  
  updateJellyfishGroup(){
    if(this.jellyfishGroup.length != this.jellyfishCount){
      var offset = [];
      for(let i = 0; i<this.jellyfishCount;i++){
        offset = offset.concat([[2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH]]);
      }
      this.jellyfishGroup = offset.map((coord)=>{
        var jellyfish = this.newDataJellyfishWithOffset(coord[0],coord[1],coord[2]);
        return new SingleJellyfish(this.GL,jellyfish);
      });
      this.updateJellyfishViewport();
    }
  };

  /**
   * Moves the coordinate of the jellyfish
   * @param {int} x
   * @param {int} y
   * @param {int} z
   */  
  newDataJellyfishWithOffset(x,y,z){
    var jellyfish = JSON.parse(JSON.stringify(this.jellyfish));
    jellyfish.images = this.jellyfish.images;
    jellyfish.position = this.jellyfish.position.map((coord,i)=>{
      return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
    });
    return jellyfish
  };

  /**
   * Set the viewport member of the class.
   * @param {int} x - The width of the canvas.
   * @param {int} y - The height of the canvas.
   */
  updateViewport(x,y){
    this.viewport = {x:x,y:y};
    this.updateJellyfishViewport();
  };

  /**
   * Update the viewport for all the jellyfish in this.jellyfishGroup
   */
  updateJellyfishViewport(){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.updateViewport(this.viewport.x,this.viewport.y);
    });
  };

  /**
   * Render the jellyfish by iterating over the array.
   */  
  render(){
    this.updateJellyfishGroup(); // Check that the number of jellyfish has not changed
    this.updateTime();
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.render();
    })
  };
}

export default MultipleJellyfish
