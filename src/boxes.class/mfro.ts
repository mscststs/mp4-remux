import { Mp4Box } from "./Mp4Box.class";

export class mfro extends Mp4Box {
  get _size(){
    return this.readUint(4,12);
  }
  set _size(value){
    this.writeUint(4,value,12);
  }
}
