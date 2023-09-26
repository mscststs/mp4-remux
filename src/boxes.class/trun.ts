import { Mp4Box } from "./Mp4Box.class";

export class trun extends Mp4Box {
  get sample_count() {
    return this.readUint(4, 12);
  }
  get data_offset() {
    return this.readInt(4, 16);
  }
  set data_offset(val) {
    this.writeInt(4, val, 16);
  }
}
