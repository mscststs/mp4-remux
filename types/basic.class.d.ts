export default class StreamBasic {
    _stream: Uint8Array;
    dv: DataView;
    get stream(): Uint8Array;
    set stream(val: Uint8Array);
    writeUint(size: 1 | 2 | 3 | 4, val: number, pos?: number): void;
    writeInt(size: 1 | 2 | 4, val: number, pos?: number): void;
    readInt(size?: 1 | 2 | 4, pos?: number): number;
    readUint(size: 1 | 2 | 3 | 4, pos?: number): number;
    /**
     * Read string by char code from Uint8Array
     * @param size
     */
    readString(size: 4, pos?: number): string;
}
