import * as Boxes from "./boxes.class";
import { Box } from "./boxes.class/types";
import StreamBasic from "./basic.class";
export declare class Mp4Stream extends StreamBasic {
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
    parse(): void;
    end(): void;
}
