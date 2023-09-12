import { ConditionHelperName } from '../ruleEngine/conditionHelpers/enums';
import { Helpers } from '../ruleEngine/conditionHelpers/interfaces';
import { Rule } from '../ruleEngine/interfaces';
import { runRules } from '../ruleEngine/utils';

export class RuleEngine<Config = any, HelperNames = ConditionHelperName> {
  private rules: Array<Rule<Config>>;
  private helpers: Helpers<HelperNames>;

  constructor(rules: Array<Rule<Config>>, helpers: Helpers) {
    this.rules = rules;
    this.helpers = helpers;
  }

  public runRules = (dataSource: any): Config | null => {
    return runRules<Config, HelperNames>(dataSource, this.rules, this.helpers);
  };
}
