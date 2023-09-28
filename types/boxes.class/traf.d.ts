import { Mp4Box } from "./Mp4Box.class";
import { trun, tfhd } from ".";
export declare class traf extends Mp4Box {
    constructor(buf: Uint8Array);
    get tfhd(): tfhd;
    get trun(): trun;
}
