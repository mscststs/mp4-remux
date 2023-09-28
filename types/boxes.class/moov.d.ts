import { Mp4Box } from "./Mp4Box.class";
import { mvhd, mvex, trak } from ".";
export declare class moov extends Mp4Box {
    constructor(buf: Uint8Array);
    get mvhd(): mvhd;
    get mvex(): mvex;
    get trak(): trak;
}
