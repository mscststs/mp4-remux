import { Mp4Box } from "./Mp4Box.class";

export class trun extends Mp4Box {
  get version() {
    return this.readUint(1, 8);
  }
  get flags(){
    return this.readUint(3, 9);
  }
  get sample_count() {
    return this.readUint(4, 12);
  }
  get data_offset() {
    if(this._Flag_data_offset){
      return this.readInt(4, 16);
    }else{
      return 0;
    }
  }

  set data_offset(val) {
    this.writeInt(4, val, 16);
  }

  get _Flag_data_offset(){
    return this.flags & 0x01;
  }

  get _Flag_first_sample_flags(){
    return this.flags & 0x04;
  }

  get first_sample_flags() {
    if(this._Flag_first_sample_flags){
      return this.readUint(4, this._Flag_data_offset ? 20 : 16);
    }else{
      return 0;
    }
  }
  set first_sample_flags(val) {
    this.writeUint(4, val, 20);
  }

  get samples(){
    const result = [];

    let offset = 16; // header 偏移

    if( this._Flag_data_offset ){
      offset += 4;
    }
    if( this._Flag_first_sample_flags ){
      offset += 4;
    }

    for(let i = 0; i < this.sample_count; i++){
      const block:Record<string, number> = {};

      if(this.flags & 0x100){
        block.sample_duration = this.readUint(4, offset);
        offset += 4;
      }

      if(this.flags & 0x200){
        block.sample_size = this.readUint(4, offset);
        offset += 4;
      }

      
      if(this.flags & 0x400){
        block.sample_flags = this.readUint(4, offset);
        offset += 4;
      }

      if(this.flags & 0x800){
        if(this.version === 0){
          block.sample_composition_time_offset = this.readUint(4, offset);
        }else{
          block.sample_composition_time_offset = this.readInt(4, offset);
        }
        offset += 4;
      }
      result.push(block);

    }
    return result;
  }
}
