import { Mp4Box } from "./Mp4Box.class";
import { tkhd } from "./tkhd";

export class trak extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }
  get tkhd(): tkhd {
    return this.boxs.find((box) => box instanceof tkhd) as tkhd;
  }
}
