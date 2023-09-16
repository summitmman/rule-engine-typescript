import { runRules } from './utils';
import { conditionHelpers } from './conditionHelpers';
import { IConditionHelpers } from './conditionHelpers/interfaces';
import { Rule } from './interfaces';

export class RuleEngine<C> {
  private _rules: Array<Rule<C>>;
  private _conditionHelpers: IConditionHelpers;

  constructor(
    userRules: Array<Rule<C>>,
    userConditionHelpers?: IConditionHelpers
  ) {
    this._rules = JSON.parse(JSON.stringify(userRules));
    this._conditionHelpers = conditionHelpers;
    if (userConditionHelpers) {
      this._conditionHelpers = { ...conditionHelpers, ...userConditionHelpers };
    }
  }

  public readonly runOn = (data: object): C => {
    return runRules<C>(data, this._rules, this._conditionHelpers);
  };
}
