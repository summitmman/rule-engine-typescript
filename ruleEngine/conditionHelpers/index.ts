import {
  IConditionHelpers,
  IIsBetweenParams,
  IIsEqualParams,
} from './interfaces';
import { ConditionHelperName } from './enums';

export const conditionHelpers: IConditionHelpers = {
  [ConditionHelperName.isBetween]: (
    value: any,
    params: IIsBetweenParams
  ): boolean => {
    return value >= params.start && value <= params.end;
  },
  [ConditionHelperName.isEqual]: (
    value: any,
    params: IIsEqualParams
  ): boolean => {
    return value === params.value;
  },
};
