import { Mp4Box } from "./Mp4Box.class";

export class mfhd extends Mp4Box {
  get sequence_number() {
    return this.readUint(4, 12);
  }
}
