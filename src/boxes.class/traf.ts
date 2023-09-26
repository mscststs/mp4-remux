import { Mp4Box } from "./Mp4Box.class";
import { trun } from "./trun";

export class traf extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }
  get trun() {
    return this.boxs.find((box) => box instanceof trun) as trun;
  }
}
