import { Mp4Box } from "./Mp4Box.class";
import { mfhd, traf } from "./";
export declare class moof extends Mp4Box {
    constructor(buf: Uint8Array);
    get mfhd(): mfhd;
    get traf(): traf;
}
