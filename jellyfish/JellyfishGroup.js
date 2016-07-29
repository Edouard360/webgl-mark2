/** Class representing a group of jellyfish. */
class JellyfishGroup{
  constructor(GL,data){
    this.jellyfishGroup = data.jellyfish.offset.map((coord)=>{
      var data_tmp = newDataJellyfishWithOffset(coord[0],coord[1],coord[2]);
      data_tmp.jellyfish.images = data.jellyfish.images;
      return new SingleJellyfish(GL,data_tmp);
    });

    function newDataJellyfishWithOffset(x,y,z){
      var data_tmp = JSON.parse(JSON.stringify(data));
      data_tmp.jellyfish.position = data_tmp.jellyfish.position.map((coord,i)=>{
        return coord + (((i%3)==0)?x:0) + (((i%3)==1)?y:0) +(((i%3)==2)?z:0)
      });
      return data_tmp
    }
  };
  updateViewport(canvas){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.updateViewport(canvas);
    });
  };
  render(){
    this.jellyfishGroup.map((jellyfish)=>{
      jellyfish.render();
    })
  };
}

 
