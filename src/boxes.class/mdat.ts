import { Mp4Box } from "./Mp4Box.class";

export class mdat extends Mp4Box {
  push(value: Uint8Array) {
    // 向 stream 追加数据

    const newBuf = new Uint8Array(this.stream.length + value.length);
    newBuf.set(this.stream);
    newBuf.set(value, this.stream.length);
    this.stream = newBuf;
    this.dv = new DataView(this.stream.buffer);
    this.size = newBuf.length;
  }
}
