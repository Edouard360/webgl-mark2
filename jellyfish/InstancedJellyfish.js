// *** InstancedJellyfish

class InstancedJellyfish extends Jellyfish{
  constructor(GL,GLext,data) {
    data.shaders.VS = data.shaders.VS.replace("//ONLY FOR INSTANCED JELLYFISH ","").replace("//ONLY FOR INSTANCED JELLYFISH ","");
    data.jellyfish.offset = [].concat.apply([], data.jellyfish.offset);
    var attrib = ["position","normal","color","texture","offset"];
    super(GL,data,attrib);
    this.GLext = GLext;
    this.jellyfishcount = data.jellyfish.offset.length;
  };

  bufferVertexAttributes(){
    super.bufferVertexAttributes();
    this.GLext.vertexAttribDivisorANGLE(this.program.attributes.offset, 3);
  };

  render(){
    this.GL.useProgram(this.program);
    this.attribName.map((name)=>{this.GL.enableVertexAttribArray(this.program.attributes[name])});

    this.updateTime();
    this.updateUniforms();
    this.bufferVertexAttributes();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
    
    this.bindUniforms();

    this.GLext.drawElementsInstancedANGLE(GL.TRIANGLES, this.indexcount, GL.UNSIGNED_INT, 0,this.jellyfishcount);

    this.attribName.map((name)=>{this.GL.disableVertexAttribArray(this.program.attributes[name])});
  };
};
