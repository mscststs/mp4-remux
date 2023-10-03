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


}
