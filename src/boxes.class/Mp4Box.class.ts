import { Box } from "./types";
import * as Boxes from ".";

export class Mp4Box {
  stream: Uint8Array = new Uint8Array();
  dv: DataView = new DataView(new Uint8Array().buffer);
  boxs: Box[] = [];
  boxPos = 0; // 记录元数据和盒子数据的偏差

  constructor(buf: Uint8Array) {
    this.stream = buf;
    this.dv = new DataView(buf.buffer);
  }

  set size(value: number) {
    this.writeUint(4, value);
  }
  get size() {
    return this.readUint(4);
  }
  get type() {
    return this.readString(4, 4);
  }

  /**
   * 获取当前 box 的 binary
   */
  get raw() {
    if (this.boxPos) {
      let size = this.boxPos;
      const bufs = this.boxs.map((item) => {
        const boxRaw = item.raw;
        size += boxRaw.length;
        return boxRaw;
      });
      this.size = size;
      const base = this.stream.slice(0, this.boxPos);

      // 将 Uint8Array[] 合并成一个
      const nbuf = new Uint8Array(size);
      let pos = 0;
      for (const item of [base, ...bufs]) {
        nbuf.set(item, pos);
        pos += item.length;
      }
      return nbuf;
    }

    return this.stream;
  }
  writeUint(size: 1 | 2 | 4, val: number, pos = 0) {
    const view = this.dv;
    switch (size) {
      case 1:
        view.setUint8(pos, val);
        break;
      case 2:
        view.setUint16(pos, val);
        break;
      case 4:
        view.setUint32(pos, val);
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

  parse(boxPos: number) {
    this.boxPos = boxPos;
    let pos = boxPos;
    while (pos <= this.stream.length - 8) {
      const size = this.readUint(4, pos);
      const type = this.readString(4, 4 + pos);
      if (size <= this.stream.length) {
        const tBuf = this.stream.slice(pos, pos + size);

        const BoxClass = Boxes[type as keyof typeof Boxes] || Boxes.free;
        this.boxs.push(new BoxClass(tBuf));
      }
      pos += size;
    }
  }
}
