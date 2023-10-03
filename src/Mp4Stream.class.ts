import * as Boxes from "./boxes.class";
import { Box } from "./boxes.class/types";
import StreamBasic from "./basic.class";

export class Mp4Stream  extends StreamBasic{
  boxs: Box[] = [];
  isEnd = false;

  get sidx() {
    return this.boxs.find((box) => box instanceof Boxes.sidx) as Boxes.sidx;
  }
  get moov() {
    return this.boxs.find((box) => box instanceof Boxes.moov) as Boxes.moov;
  }

  push(value: Uint8Array) {
    const newBuf = new Uint8Array(this.stream.length + value.length);
    newBuf.set(this.stream);
    newBuf.set(value, this.stream.length);
    this.stream = newBuf;
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
    return sliceBuf;
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
