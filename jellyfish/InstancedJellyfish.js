/** Class representing a group of jellyfish. */
class InstancedJellyfish extends AbstractJellyfish{
  constructor(GL,data) {
    var data_ = JSON.parse(JSON.stringify(data));
    data_.jellyfish.images = data.jellyfish.images;
    data_.jellyfish.offset = [].concat.apply([], data.jellyfish.offset);
    super(GL,data_);   
    this.GLext = this.GL.getExtension("ANGLE_instanced_arrays");;
  };

  createProgram(data) {
    return createProgramFromShaders({VS:data.shaders.VS.replace(new RegExp("//ONLY FOR INSTANCED JELLYFISH ",'g'),""),FS:data.shaders.FS},this.GL)
  }

  bufferVertexAttributes(){
    super.bufferVertexAttributes();
    this.GLext.vertexAttribDivisorANGLE(this.program.attributes.offset, 3);
  };

  drawElements(){
     this.GLext.drawElementsInstancedANGLE(this.GL.TRIANGLES, this.indexcount, this.GL.UNSIGNED_INT, 0,3*this.jellyfishCount);
     this.GL.hasBeenModified = true;
  }

};

InstancedJellyfish.prototype.attributes = ["position","normal","color","texture","offset"];
