import { Mp4Box } from "./Mp4Box.class";
export declare class sidx extends Mp4Box {
    get version(): number;
    get reference_ID(): number;
    get timescale(): number;
    get reserved(): number;
    get reference_count(): number;
    get refList(): {
        reference_type: number;
        referenced_size: number;
        subsegment_duration: number;
        starts_with_SAP: number;
        SAP_type: number;
        SAP_delta_time: number;
    }[];
}
