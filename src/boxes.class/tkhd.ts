import { Mp4Box } from "./Mp4Box.class";

export class tkhd extends Mp4Box {
  get version() {
    return this.readUint(1, 8);
  }

  get track_id():number{
    if(this.version === 1){
      return this.readUint(4, 28);
    }else{
      return this.readUint(4,20);
    }
  }
  set track_id(value){
    if(this.version === 1){
      this.writeUint(4,value,28);
    }else{
      this.writeUint(4,value,20);
    }
  }
}
