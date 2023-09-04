import { ConditionFunction, ConditionFunctionGenerator } from './interfaces';

export const isBetween: ConditionFunctionGenerator = <
  T extends string | number
>(
  start: T,
  end: T
): ConditionFunction => {
  return (value: T): boolean => {
    return value >= start && value <= end;
  };
};

export const isEqual: ConditionFunctionGenerator = (
  target: any
): ConditionFunction => {
  return (value: any): boolean => {
    return value === target;
  };
};
