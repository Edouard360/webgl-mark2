/** Class representing a group of jellyfish. */
class InstancedJellyfish extends AbstractJellyfish{

  /**
   * Constructor for the InstancedJellyfish class.
   * The constructor gets an extension for a functionnality present in WebGL2.
   * This extensions come with methods:
   * vertexAttribDivisorANGLE and drawElementsInstancedANGLE.
   *
   * @param {WebGLRenderingContext} GL - The webgl rendering context.
   * @param {Object} jellyfish - An object containing the necessary data for a jellyfish.
   */
  constructor(GL,jellyfish) {
    var jellyfish_duplicate = JSON.parse(JSON.stringify(jellyfish));
    jellyfish_duplicate.images = jellyfish.images;
    jellyfish_duplicate.offset = [];
    for(let i = 0; i<MAX_NUMBER;i++){
      jellyfish_duplicate.offset = jellyfish_duplicate.offset.concat([2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH, 2*(Math.random() - 0.5)*WIDTH]);
    }
    super(GL,jellyfish_duplicate);

    this.GLext = this.GL.getExtension("ANGLE_instanced_arrays");;
  };

  /**
   * The vertex shader is slightly different if we use instanciation
   * @param {Object} shaders - An object containing the necessary data for a jellyfish.
   * @param {String} shaders.VS - The vertex shader text, that will be modified (we use instanciation).
   * @param {String} shaders.FS - The fragment shader text.
   */
  createProgram(shaders) {
    return createProgramFromShaders(this.GL,{VS:shaders.VS.replace(new RegExp("//ONLY FOR INSTANCED JELLYFISH ",'g'),""),FS:shaders.FS})
  }

  /**
   * Overload the bufferVertexAttributes function using the extension.
   */
  bufferVertexAttributes(){
    super.bufferVertexAttributes();
    this.GLext.vertexAttribDivisorANGLE(this.attributeLocation.offset, 1);
    // 3 stands for the 3 coordinates of each offset, ie: x,y,z
  };

  /**
   * Overload the drawElements function using the extension.
   */
  drawElements(){
    this.GLext.drawElementsInstancedANGLE(this.GL.TRIANGLES, this.indexcount, this.GL.UNSIGNED_INT, 0,this.jellyfishCount);
    // Only the last argument differ compared to the regular drawElements
  }
};

InstancedJellyfish.prototype.attributeList = ["position","normal","color","texture","offset"];
