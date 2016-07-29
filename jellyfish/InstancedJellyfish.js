/** Class representing a group of jellyfish. */
class InstancedJellyfish extends AbstractJellyfish{
  constructor(GL,data) {
    data.shaders.VS = data.shaders.VS.replace("//ONLY FOR INSTANCED JELLYFISH ","").replace("//ONLY FOR INSTANCED JELLYFISH ","");
    data.jellyfish.offset = [].concat.apply([], data.jellyfish.offset);
    super(GL,data);   
    this.jellyfishcount = data.jellyfish.offset.length;
    this.GLext = this.GL.getExtension("ANGLE_instanced_arrays");;
  };

  bufferVertexAttributes(){
    super.bufferVertexAttributes();
    this.GLext.vertexAttribDivisorANGLE(this.program.attributes.offset, 3);
  };

  drawElements(){
     this.GLext.drawElementsInstancedANGLE(GL.TRIANGLES, this.indexcount, GL.UNSIGNED_INT, 0,this.jellyfishcount);
  }

};

InstancedJellyfish.prototype.attributes = ["position","normal","color","texture","offset"];
