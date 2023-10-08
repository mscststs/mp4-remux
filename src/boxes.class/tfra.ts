import { Mp4Box } from "./Mp4Box.class";

export class tfra extends Mp4Box {
  get track_ID(){
    return this.readUint(4, 12);
  }
  set track_ID(value){
    this.writeUint(4, value, 12);
  }

  get length_size_of_sample_num(){
    const tmp = this.readUint(4, 16);
    return tmp & 0x3;
  }

  get length_size_of_trun_num(){
    const tmp = this.readUint(4, 16);
    return (tmp >> 2) & 0x3;
  }

  get length_size_of_traf_num(){
    const tmp = this.readUint(4, 16);
    return (tmp >> 4) & 0x3;
  }

  get number_of_entry(){
    return this.readUint(4, 20);
  }
  set number_of_entry(value){
    this.writeUint(4, value, 20);
  }

  get version() {
    return this.readUint(1, 8);
  }

  set version(value){
    this.writeUint(1, value, 8);
  }

  get entries(){
    const result = [];
    let blockSize = this.length_size_of_sample_num + this.length_size_of_trun_num + this.length_size_of_traf_num + 3 + 8;
    if(this.version===1){
      blockSize += 8;
    }

    for(let i = 0; i < this.number_of_entry;i++){
      let offset = 24 + i * blockSize;
      const time = this.version === 1 ? this.readUint(8, offset) : this.readUint(4, offset);

      offset += this.version === 1 ? 8 : 4;

      const moof_offset = this.version === 1 ? this.readUint(8, offset) : this.readUint(4, offset);
      
      offset += this.version === 1 ? 8 : 4;

      const traf_number = this.readUint(this.length_size_of_traf_num + 1, offset);

      offset += this.length_size_of_traf_num + 1;

      const trun_number = this.readUint(this.length_size_of_trun_num + 1, offset);

      offset += this.length_size_of_trun_num + 1;

      const sample_number = this.readUint(this.length_size_of_sample_num + 1, offset);


      result.push({
        time,
        moof_offset,
        traf_number,
        trun_number,
        sample_number
      });
    }
    return result;
  }

  set entries(value){
    this.number_of_entry = value.length;

    const resultBuf = [];
    resultBuf.push(this.stream.slice(0,24)); // 前 24 字节不动

    let blockSize = this.length_size_of_sample_num + this.length_size_of_trun_num + this.length_size_of_traf_num + 3 + 8;
    if(this.version===1){
      blockSize += 8;
    }

    for(let item of value){
      const {time, moof_offset, traf_number, trun_number, sample_number} = item;
      const blockBuf = new Uint8Array(blockSize);
      const dataView = new DataView(blockBuf.buffer);

      let offset = 0;

      this.version === 1 ? this.writeUint(8, time, offset, dataView) : this.writeUint(4, time, offset, dataView);
      offset += this.version === 1 ? 8 : 4;

      this.version === 1 ? this.writeUint(8, moof_offset, offset, dataView) : this.writeUint(4, moof_offset, offset, dataView);
      offset += this.version === 1 ? 8 : 4;


      this.writeUint(this.length_size_of_traf_num + 1, traf_number, offset, dataView);
      offset += this.length_size_of_traf_num + 1;

      this.writeUint(this.length_size_of_trun_num + 1, trun_number, offset, dataView);
      offset += this.length_size_of_trun_num + 1;

      this.writeUint(this.length_size_of_sample_num + 1, sample_number, offset, dataView);

      resultBuf.push(blockBuf);
    }

    this.stream = this.concatUint8Arrays(resultBuf);
  }


}
