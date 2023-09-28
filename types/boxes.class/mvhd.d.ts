import { Mp4Box } from "./Mp4Box.class";
export declare class mvhd extends Mp4Box {
    get version(): number;
    get next_track_ID(): number;
    set next_track_ID(value: number);
}
