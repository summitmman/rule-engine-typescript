import _ from 'lodash';
import { Rule, ICondition, IConditionGroup, INot } from './interfaces';
import { ConditionType } from './enums';

export const runCondition = <T>(
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

export const runRules = <T>(
  dataSource: any,
  rules: Array<Rule<T>>
): T | null => {
  if (!dataSource || typeof dataSource !== 'object') {
    return null;
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i];
    const result = runCondition<T>(dataSource, rule);
    if (result) {
      if (rule.next) {
        return runRules(dataSource, rule.next);
      }
      return rule.result(dataSource, rule.id);
    }
  }

  return null;
};
