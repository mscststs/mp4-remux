import { Box } from "./types";
import * as Boxes from ".";
import StreamBasic from "../basic.class";

export class Mp4Box extends StreamBasic {
  boxs: Box[] = [];
  boxPos = 0; // 记录元数据和盒子数据的偏差

  constructor(buf: Uint8Array) {
    super();
    this.stream = buf;
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
    }else{
      this.size = this.stream.length;
      return this.stream;
    }
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
