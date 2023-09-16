import _ from 'lodash';
import {
  Rule,
  ICondition,
  IConditionGroup,
  INot,
  IDefault,
} from './interfaces';
import { ConditionType } from './enums';
import { conditionHelpers as defaultConditionHelpers } from './conditionHelpers';
import { ConditionHelperName } from './conditionHelpers/enums';

const runCondition = <T>(
  dataSource: any,
  rule: Rule<T> | ICondition | IConditionGroup | INot,
  conditionHelpers = defaultConditionHelpers
): boolean | null => {
  let final: boolean | null = null;
  switch (rule.type) {
    case ConditionType.Condition: {
      // Get helper
      const helper = conditionHelpers[rule.condition.name];
      const defaultHelper =
        defaultConditionHelpers[ConditionHelperName.isEqual];
      // Prepare helper params
      const params = JSON.parse(JSON.stringify(rule.condition));
      delete params.name;
      // Get value to compare
      const value = _.get(dataSource, rule.key);
      if (helper) {
        final = helper(value, params);
      } else {
        const paramKeys = Object.keys(params);
        if (paramKeys.includes('value')) {
          final = defaultHelper(value, params);
        } else if (paramKeys.length) {
          final = defaultHelper(value, params[paramKeys[0]]);
        } else {
          final = false;
        }
      }
      break;
    }
    case ConditionType.And: {
      let localFinal = true;
      rule.conditions.forEach((condition) => {
        localFinal = localFinal && runCondition(dataSource, condition);
      });
      if (localFinal !== null) {
        final = localFinal;
      }
      break;
    }
    case ConditionType.Or: {
      let localFinal = false;
      rule.conditions.forEach((condition) => {
        localFinal = localFinal || runCondition(dataSource, condition);
      });
      if (localFinal !== null) {
        final = localFinal;
      }
      break;
    }
    case ConditionType.Not: {
      let localFinal = runCondition(dataSource, rule.condition);
      if (localFinal !== null) {
        final = !localFinal;
      }
      break;
    }
    default: {
      final = null;
    }
  }
  return final;
};

const runResult = <T>(
  result: ResultFunction<T> | T,
  dataSource: any,
  id?: string
): T => {
  if (typeof result === 'function') {
    return (result as ResultFunction<T>)(dataSource, id);
  }
  return result;
};

export const runRules = <T>(
  dataSource: any,
  rules: Array<Rule<T>>,
  conditionHelpers = defaultConditionHelpers
): T | null => {
  // if data source is invalid return null
  if (!dataSource || typeof dataSource !== 'object') {
    return null;
  }

  // variable to store default rule
  // if it exists
  let defaultRule: IDefault<T> | null = null;

  // loop over all rules
  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];

    // if rule is of type default, keep it for later
    if (rule.type === ConditionType.Default) {
      defaultRule = rule as IDefault<T>;
    } else {
      // for all other rules, run their conditions
      const result = runCondition<T>(dataSource, rule, conditionHelpers);
      if (result) {
        // if matching config has nesting, run nesting
        if (rule.next) {
          return runRules(dataSource, rule.next, conditionHelpers);
        }
        // else we have found matching rule and can return the result
        return rule.result;
      }
    }
  }

  // if after looping through all the rules we did not get a match
  // check if there was a default type rule
  // if so return the default result
  if (defaultRule) {
    return defaultRule.result;
  }

  return null;
};
