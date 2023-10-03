import { Box } from "./types";
import StreamBasic from "../basic.class";
export declare class Mp4Box extends StreamBasic {
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
    parse(boxPos: number): void;
}
