import _ from 'lodash';
import {
  Rule,
  ICondition,
  IConditionGroup,
  INot,
  IDefault,
  ResultFunction,
} from './interfaces';
import { ConditionType } from './enums';

const runCondition = <T>(
  dataSource: any,
  rule: Rule<T> | ICondition | IConditionGroup | INot
): boolean | null => {
  let final: boolean | null = null;
  switch (rule.type) {
    case ConditionType.Condition: {
      final = rule.condition(_.get(dataSource, rule.key), dataSource);
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
  rules: Array<Rule<T>>
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
      continue;
    }
    // for all other rules, run their conditions
    const result = runCondition<T>(dataSource, rule);
    if (result) {
      // if matching config has nesting, run nesting
      if (rule.next) {
        const nestedResult = runRules(dataSource, rule.next);
        if (nestedResult == null) {
          continue;
        } else {
          return nestedResult;
        }
      }
      // else we have found matching rule and can return the result
      return runResult(rule.result, dataSource, rule.id);
    }
  }

  // if after looping through all the rules we did not get a match
  // check if there was a default type rule
  // if so return the default result
  if (defaultRule) {
    return runResult(defaultRule.result, dataSource, ConditionType.Default);
  }

  return null;
};
