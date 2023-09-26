import { Mp4Box } from "./Mp4Box.class";

export class sidx extends Mp4Box {
  get version() {
    return this.readUint(1, 8);
  }
  get reference_ID() {
    return this.readUint(4, 12);
  }
  get timescale() {
    return this.readUint(4, 16);
  }
  get reserved() {
    let offset = 8 + 20;
    if (this.version !== 0) {
      offset = 16 + 20;
    }
    return this.readUint(2, offset);
  }
  get reference_count() {
    let offset = 8 + 20;
    if (this.version !== 0) {
      offset = 16 + 20;
    }
    offset += 2;
    return this.readUint(2, offset);
  }
  get refList() {
    let offset = 8 + 24;
    if (this.version !== 0) {
      offset = 16 + 24;
    }
    const refrenceCount = this.reference_count;
    const resList = [];
    for (let i = 0; i < refrenceCount; i++) {
      const pos = offset + i * 12; // Position
      let tmp_32 = this.readUint(4, pos);
      const reference_type = (tmp_32 >> 31) & 0x1;
      const referenced_size = tmp_32 & 0x7fffffff;
      const subsegment_duration = this.readUint(4, pos + 4);
      tmp_32 = this.readUint(4, pos + 8);
      const starts_with_SAP = (tmp_32 >> 31) & 0x1;
      const SAP_type = (tmp_32 >> 28) & 0x7;
      const SAP_delta_time = tmp_32 & 0xfffffff;
      resList.push({
        reference_type,
        referenced_size,
        subsegment_duration,
        starts_with_SAP,
        SAP_type,
        SAP_delta_time,
      });
    }
    return resList;
  }
}
