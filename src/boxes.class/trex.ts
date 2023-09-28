import { Mp4Box } from "./Mp4Box.class";

export class trex extends Mp4Box {

  get version() {
    return this.readUint(1, 8);
  }
  get track_id():number{
    return this.readUint(4,12);
  }
  set track_id(value){
    this.writeUint(4,value,12);
  }
}
