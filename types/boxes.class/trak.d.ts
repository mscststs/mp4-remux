import { Mp4Box } from "./Mp4Box.class";
import { tkhd } from "./tkhd";
export declare class trak extends Mp4Box {
    constructor(buf: Uint8Array);
    get tkhd(): tkhd;
}
