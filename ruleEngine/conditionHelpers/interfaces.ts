export type ConditionHelperFn = (value: any, ...args) => boolean;
export interface IConditionHelpers {
  [key: string]: ConditionHelperFn;
}

export interface IIsBetweenParams {
  start: any;
  end: any;
}
export interface IIsEqualParams {
  value: any;
}

export interface IConditionHelperType {
  name: string;
  [key: string]: any;
}
