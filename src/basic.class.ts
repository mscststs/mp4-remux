export default class StreamBasic {
  _stream: Uint8Array = new Uint8Array();
  dv: DataView = new DataView(new Uint8Array().buffer);

  get stream(){
    return this._stream;
  }
  set stream(val){
    this._stream = val;
    this.dv = new DataView(val.buffer);
  }
  writeUint(size: number, val: number, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        view.setUint8(pos, val);
        break;
      case 2:
        view.setUint16(pos, val);
        break;
      case 3:
        view.setUint16(pos, val >> 8);
        view.setUint8(pos+2, val & 0xff);
        return;
      case 4:
        view.setUint32(pos, val);
        break;
      case 8:
        view.setUint32(pos, val >> 32)
        view.setUint32(pos+4, val & 0xffffffff);
        break;
    }
  }
  writeInt(size: 1 | 2 | 4, val: number, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        view.setInt8(pos, val);
        break;
      case 2:
        view.setInt16(pos, val);
        break;
      case 4:
        view.setInt32(pos, val);
        break;
    }
  }

  readInt(size: 1 | 2 | 4 = 4, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        return view.getInt8(pos);
      case 2:
        return view.getInt16(pos);
      case 4:
        return view.getInt32(pos);
    }
  }

  // use dataView to Get Unsigned Int
  readUint(size: number, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        return view.getUint8(pos);
      case 2:
        return view.getUint16(pos);
      case 3:
        return view.getUint16(pos) << 8 + view.getUint8(pos+2)
      case 4:
        return view.getUint32(pos);
      case 8:
        return (view.getUint32(pos) << 32) + view.getUint32(pos+4);
      default:
        return 0;
    }
  }
  /**
   * Read string by char code from Uint8Array
   * @param size
   */
  readString(size: 4, pos = 0) {
    let s = "";
    for (let i = 0; i < size; i++) {
      s += String.fromCharCode(this.readUint(1, pos + i));
    }
    return s;
  }

}