import { Box } from "./types";
export declare class Mp4Box {
    stream: Uint8Array;
    dv: DataView;
    boxs: Box[];
    boxPos: number;
    constructor(buf: Uint8Array);
    set size(value: number);
    get size(): number;
    get type(): string;
    /**
     * 获取当前 box 的 binary
     */
    get raw(): Uint8Array;
    writeUint(size: 1 | 2 | 4, val: number, pos?: number): void;
    writeInt(size: 1 | 2 | 4, val: number, pos?: number): void;
    readInt(size?: 1 | 2 | 4, pos?: number): number;
    readUint(size: 1 | 2 | 4, pos?: number): number;
    /**
     * Read string by char code from Uint8Array
     * @param size
     */
    readString(size: 4, pos?: number): string;
    parse(boxPos: number): void;
}
