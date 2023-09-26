import * as Boxes from "./boxes.class";
import { Box } from "./boxes.class/types";
import { sidx } from "./boxes.class/sidx";

export class Mp4Stream {
  stream: Uint8Array = new Uint8Array();
  dv: DataView = new DataView(new Uint8Array().buffer);
  boxs: Box[] = [];
  isEnd = false;

  get sidx() {
    return this.boxs.find((box) => box.type === "sidx") as sidx;
  }
  get moov() {
    return this.boxs.find((box) => box.type === "moov");
  }

  push(value: Uint8Array) {
    const newBuf = new Uint8Array(this.stream.length + value.length);
    newBuf.set(this.stream);
    newBuf.set(value, this.stream.length);
    this.stream = newBuf;
    this.dv = new DataView(this.stream.buffer);
  }

  /**
   * 将stream 截断，把pos前的数据返回，然后更新dataView
   * @param pos
   */
  slice(pos: number) {
    const sliceBuf = this.stream.slice(0, pos);
    const newBuf = new Uint8Array(this.stream.length - pos);
    newBuf.set(this.stream.slice(pos));
    this.stream = newBuf;
    this.dv = new DataView(this.stream.buffer);
    return sliceBuf;
  }
  // use dataView to Get Unsigned Int
  readUint(size: 1 | 2 | 4, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        return view.getUint8(pos);
      case 2:
        return view.getUint16(pos);
      case 4:
        return view.getUint32(pos);
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
  parse() {
    // 检查this.stream 的长度是否足够 2*4*8
    if (this.stream.length < 8) {
      return; // Not Enough
    }

    const size = this.readUint(4);
    const type = this.readString(4, 4);

    if (size <= this.stream.length) {
      const tBuf = this.slice(size);

      const BoxClass = Boxes[type as keyof typeof Boxes] || Boxes.free;
      this.boxs.push(new BoxClass(tBuf));

      this.parse(); // 继续向后解析
    }
  }

  end() {
    this.isEnd = true;
  }
}
