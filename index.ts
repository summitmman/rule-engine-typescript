// Import stylesheets
import './style.css';
// Import modules
import { Rule } from './ruleEngine/interfaces';
import { ConditionType } from './ruleEngine/enums';
import { runRules } from './ruleEngine/utils';
import { helpers } from './ruleEngine/conditionHelpers';
import { ConditionHelperName } from './ruleEngine/conditionHelpers/enums';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter</h1>`;

interface Config {
  amount: number;
  emi: number;
}

const { isBetween, isEqual } = helpers;

// TODO:
// 1. add else support
// 2. figure better way to nest conditions
const rules: Array<Rule<Config>> = [
  {
    type: ConditionType.Condition,
    key: 'tenure',
    condition: isBetween({ start: 0, end: 12 }),
    next: [
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: isEqual({ target: 'Mumbai' }),
        result: () => ({
          amount: 0.032,
          emi: 8.075,
        }),
      },
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: isEqual('Bangalore'),
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
    condition: isBetween(13, 24),
    result: () => ({
      amount: 0.06,
      emi: 15.019,
    }),
  },
  {
    type: ConditionType.Condition,
    key: 'tenure',
    condition: isBetween(25, 36),
    result: () => ({
      amount: 0.087,
      emi: 21.963,
    }),
  },
  {
    type: ConditionType.Default,
    result: () => ({
      amount: 1.1,
      emi: 1.1,
    }),
  },
];

const testData = {
  tenure: 6,
  pinlocation: '10.0',
  geolocation: 'Mumbai',
};

let output: Config = runRules<Config>(testData, rules);
console.log(output);

const newRules: Array<Rule<Config>> = [
  {
    type: ConditionType.And,
    conditions: [
      {
        type: ConditionType.Condition,
        key: 'tenure',
        condition: {
          name: ConditionHelperName.isBetween,
          start: 0,
          end: 12,
        },
      },
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: {
          name: ConditionHelperName.isEqual,
          target: 'Mumbai',
        },
      },
    ],
    result: {
      amount: 10,
      emi: 5,
    },
  },
  {
    type: ConditionType.And,
    conditions: [
      {
        type: ConditionType.Condition,
        key: 'tenure',
        condition: {
          name: ConditionHelperName.isBetween,
          start: 13,
          end: 24,
        },
      },
      {
        type: ConditionType.Condition,
        key: 'geolocation',
        condition: {
          name: ConditionHelperName.isEqual,
          target: 'Bangalore',
        },
      },
    ],
    result: {
      amount: 20,
      emi: 8,
    },
  },
];

let newOutput: Config = runRules<Config>(testData, newRules);
console.log(newOutput);
