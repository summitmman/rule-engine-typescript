import { ConditionHelperName } from './enums';
import { ConditionFunction, ConditionFunctionGenerator } from './interfaces';

const isBetween: ConditionFunctionGenerator = <T extends string | number>(
  start: T,
  end: T
): ConditionFunction => {
  return (value: T): boolean => {
    return value >= start && value <= end;
  };
};

const isEqual: ConditionFunctionGenerator = (
  target: any
): ConditionFunction => {
  return (value: any): boolean => {
    return value === target;
  };
};

export const helpers: {
  [key in ConditionHelperName]: ConditionFunctionGenerator;
} = {
  [ConditionHelperName.isBetween]: isBetween,
  [ConditionHelperName.isEqual]: isEqual,
};
