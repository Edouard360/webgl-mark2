// *** SingleJellyfish

class SingleJellyfish extends Jellyfish{
  constructor(GL,data) {
    var attrib = ["position","normal","color","texture"];
    super(GL,data,attrib);
  };
  render(){
    this.GL.useProgram(this.program);
    this.attribName.map((name)=>{this.GL.enableVertexAttribArray(this.program.attributes[name])});

    this.updateTime();
    this.updateUniforms();
    this.bufferVertexAttributes();
    this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.buffer.index);
    
    this.bindUniforms();
    this.GL.drawElements(this.GL.TRIANGLES, this.indexcount, this.GL.UNSIGNED_INT, 0);

    this.attribName.map((name)=>{this.GL.disableVertexAttribArray(this.program.attributes[name])});
  }
};
