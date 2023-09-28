import { Mp4Box } from "./Mp4Box.class";
import { mvhd, mvex, trak } from ".";

export class moov extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }

  get mvhd() {
    return this.boxs.find((box) => box instanceof mvhd) as mvhd;
  }
  get mvex(){
    return this.boxs.find((box) => box instanceof mvex) as mvex;
  }
  get trak(){
    return this.boxs.find((box) => box instanceof trak) as trak;
  }
}
