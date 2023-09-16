import { IConditionHelpers } from './ruleEngine/conditionHelpers/interfaces';

export enum myConditionHelperName {
  isLessThan = 'isLessThan',
}

export interface IIsLessThanParams {
  value: any;
}
export const myConditionHelpers: IConditionHelpers = {
  [myConditionHelperName.isLessThan]: (
    value: any,
    params: IIsLessThanParams
  ): boolean => {
    return value < params.value;
  },
};
