// Import stylesheets
import './style.css';
// Import modules
import { RuleEngine } from './ruleEngine';
import { Rule } from './ruleEngine/interfaces';
import { ConditionType } from './ruleEngine/enums';
import { IConditionHelpers } from './ruleEngine/conditionHelpers/interfaces';
import { ConditionHelperName } from './ruleEngine/conditionHelpers/enums';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

// Interface of the output from the rule engine i.e. the config you would finally use
interface Config {
  amount: number;
  emi: number;
}

// Custom condition helpers
enum myConditionHelperName {
  isLessThan = 'isLessThan',
}
const myConditionHelpers: IConditionHelpers = {
  [myConditionHelperName.isLessThan]: (
    value: any,
    params: { value: any }
  ): boolean => {
    return value < params.value;
  },
};

// Define rules
const rules: Array<Rule<Config>> = [
  {
    type: ConditionType.Condition,
    key: 'tenure',
    condition: {
      name: myConditionHelperName.isLessThan,
      value: 13,
    },
    next: [
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: {
          name: ConditionHelperName.isEqual,
          value: 'Mumbai',
        },
        result: {
          amount: 0.032,
          emi: 8.075,
        },
      },
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: {
          name: ConditionHelperName.isEqual,
          value: 'Bangalore',
        },
        result: {
          amount: 0.034,
          emi: 8.077,
        },
      },
    ],
  },
  {
    type: ConditionType.Condition,
    key: 'tenure',
    condition: {
      name: ConditionHelperName.isBetween,
      start: 13,
      end: 24,
    },
    result: {
      amount: 0.06,
      emi: 15.019,
    },
  },
  {
    type: ConditionType.Condition,
    key: 'tenure',
    condition: {
      name: ConditionHelperName.isBetween,
      start: 25,
      end: 36,
    },
    result: {
      amount: 0.087,
      emi: 21.963,
    },
  },
  {
    type: ConditionType.Default,
    result: {
      amount: 1.1,
      emi: 1.1,
    },
  },
];
console.log(
  'Rules can be stringified and stored in the database',
  JSON.stringify(rules)
);

// Data to run rules on
const testData: any = {
  tenure: 6,
  pinlocation: '10.0',
  geolocation: 'Bangalore',
};

// Initialize ruleEngine
const emiAmountRuleEngine: RuleEngine<Config> = new RuleEngine<Config>(
  rules,
  myConditionHelpers
);

let output: Config = emiAmountRuleEngine.runOn(testData);
console.log('Final config to be used', output);
