import { ConditionFunction, ConditionFunctionGenerator, ConditionHelper } from './interfaces';
import { ConditionHelperName } from './enums';
import { helpers as libHelpers } from './index';

export const getHelperFunction = <H>(
  conditionName: ConditionHelper,
  helpers: {
    [key in ConditionHelperName & H]: ConditionFunctionGenerator;
  } = libHelpers
): ConditionFunction => {
  switch (conditionName.name) {
    case ConditionHelperName.isBetween: {
      return helpers['isBetween'](conditionName.start, conditionName.end);
    }
    case ConditionHelperName.isEqual:
    default: {
      return helpers['isEqual'](conditionName.target);
    }
  }
};
