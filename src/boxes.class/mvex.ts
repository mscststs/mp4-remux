import { Mp4Box } from "./Mp4Box.class";
import { trex } from "./";

export class mvex extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);


  }
  get trex(){
    return this.boxs.find((box) => box instanceof trex) as trex;
  }
}
