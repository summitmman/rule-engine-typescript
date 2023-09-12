import { ConditionFunction, ConditionHelper, Helpers } from './interfaces';
import { helpers as libHelpers } from './index';
import { ConditionHelperName } from '../../ruleEngine/conditionHelpers/enums';

export const getHelperFunction = <H = ConditionHelperName>(
  conditionName: ConditionHelper,
  helpers: Helpers<H> = libHelpers
): ConditionFunction => {
  const helper = helpers[conditionName.name] || helpers['isEqual'];
  const args = helper.args.map((key) => conditionName[key]);
  return helper.fn.call(null, ...args);
};
