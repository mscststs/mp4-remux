import { Mp4Box } from "./Mp4Box.class";

export class mvex extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }
}
