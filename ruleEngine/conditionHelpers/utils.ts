import { ConditionFunction, ConditionHelper } from './interfaces';
import { ConditionHelperName } from './enums';
import { helpers } from './index';

export const getHelperFunction = (
  conditionName: ConditionHelper
): ConditionFunction => {
  switch (conditionName.name) {
    case ConditionHelperName.isBetween: {
      return helpers.isBetween(conditionName.start, conditionName.end);
    }
    case ConditionHelperName.isEqual:
    default: {
      return helpers.isEqual(conditionName.target);
    }
  }
};
