import { Mp4Box } from "./Mp4Box.class";
import { trun } from "./trun";
export declare class traf extends Mp4Box {
    constructor(buf: Uint8Array);
    get trun(): trun;
}
