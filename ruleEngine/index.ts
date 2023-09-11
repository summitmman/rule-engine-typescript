import { ConditionHelperName } from '../ruleEngine/conditionHelpers/enums';
import { ConditionFunctionGenerator } from '../ruleEngine/conditionHelpers/interfaces';
import { Rule } from '../ruleEngine/interfaces';
import { runRules } from '../ruleEngine/utils';

class RuleEngine<Config = any, HelperNames = ConditionHelperName> {
  private rules: Array<Rule<Config>>;
  private helpers: {
    [key in ConditionHelperName & HelperNames]: ConditionFunctionGenerator;
  };

  constructor(
    rules: Array<Rule<Config>>,
    helpers: {
      [key in ConditionHelperName & HelperNames]: ConditionFunctionGenerator;
    }
  ) {
    this.rules = rules;
    this.helpers = helpers;
  }

  public runRules = (
    dataSource: any,
  ): Config | null => {
    return runRules<Config>(dataSource, this.rules, this.helpers);
  }
}
