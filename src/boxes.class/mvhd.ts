import { Mp4Box } from "./Mp4Box.class";

export class mvhd extends Mp4Box {

  get version() {
    return this.readUint(1, 8);
  }

  get next_track_ID(){
    if(this.version === 0){
      return this.readUint(4,104);
    }else{
      return this.readUint(4,116);
    }
  }
  set next_track_ID(value){
    if(this.version === 0){
      this.writeUint(4,value,104);
    }else{
      this.writeUint(4,value,116);
    }
  }
}
