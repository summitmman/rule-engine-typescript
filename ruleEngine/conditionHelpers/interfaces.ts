import { ConditionHelperName } from './enums';

export type ConditionFunction = (value: any, dataSource?: any) => boolean;
export type ConditionFunctionGenerator = (...args) => ConditionFunction;

interface IConditionHelper {
  name: ConditionHelperName;
}
interface IisBetween extends IConditionHelper {
  name: ConditionHelperName.isBetween;
  start: string | number;
  end: string | number;
}
interface IisEqual extends IConditionHelper {
  name: ConditionHelperName.isEqual;
  target: any;
}
export type ConditionHelper = IisBetween | IisEqual;