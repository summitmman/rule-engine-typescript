import { Rule } from "../ruleEngine/interfaces";

class RuleEngine<T> {
  
  rules: Rule<T>;
  helpers: [key in ConditionHelperName]: ConditionFunctionGenerator;

  constructor() {}
}
