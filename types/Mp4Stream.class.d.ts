import * as Boxes from "./boxes.class";
import { Box } from "./boxes.class/types";
export declare class Mp4Stream {
    stream: Uint8Array;
    dv: DataView;
    boxs: Box[];
    isEnd: boolean;
    get sidx(): Boxes.sidx;
    get moov(): Boxes.moov;
    push(value: Uint8Array): void;
    /**
     * 将stream 截断，把pos前的数据返回，然后更新dataView
     * @param pos
     */
    slice(pos: number): Uint8Array;
    readUint(size: 1 | 2 | 4, pos?: number): number;
    /**
     * Read string by char code from Uint8Array
     * @param size
     */
    readString(size: 4, pos?: number): string;
    parse(): void;
    end(): void;
}
