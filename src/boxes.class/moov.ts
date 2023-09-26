import { Mp4Box } from "./Mp4Box.class";

export class moov extends Mp4Box {
  constructor(buf: Uint8Array) {
    super(buf);
    this.parse(8);
  }
}
