import { Mp4Box } from "./Mp4Box.class";
import { mfhd, traf } from "./";

export class moof extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }
  get mfhd(){
    return this.boxs.find((box) => box instanceof mfhd) as mfhd
  }
  get traf(){
    return this.boxs.find((box) => box instanceof traf) as traf
  }
}
