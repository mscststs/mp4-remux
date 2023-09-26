import * as Boxes from ".";

type ValueTypes<T> = T[keyof T];

export type Box = InstanceType<ValueTypes<typeof Boxes>>;
export type BoxTypes = {
  [K in keyof typeof Boxes]: InstanceType<typeof Boxes[K]>;
};
