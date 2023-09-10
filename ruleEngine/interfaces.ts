import { ConditionName, ConditionType } from './enums';

export type ConditionFunction = (value: any, dataSource: any) => boolean;
export type ConditionFunctionGenerator = (...args) => ConditionFunction;

export interface ICondition {
  type: ConditionType.Condition;
  key: string;
  condition: ConditionFunction;
}
export interface IConditionGroup {
  type: Exclude<ConditionType, ConditionType.Condition | ConditionType.Not>;
  conditions: Array<IConditionGroup | ICondition | INot>;
}
export interface INot {
  type: ConditionType.Not;
  condition: IConditionGroup | ICondition | INot;
}

export type ResultFunction<T> = (dataSource: any, id?: string) => T;
interface IResult<T> {
  result: T | ResultFunction<T>;
}
interface INext<T> {
  next: Array<Rule<T>>;
}

type Only<M, O> = { [key in keyof M]: M[key] } & { [key in keyof O]?: never };
type Either<T1, T2> = Only<T1, T2> | Only<T2, T1>;

type Condition<T> = ICondition & Either<IResult<T>, INext<T>>;
type ConditionGroup<T> = IConditionGroup & Either<IResult<T>, INext<T>>;
type Not<T> = INot & Either<IResult<T>, INext<T>>;
interface IRule {
  id?: string;
}
export interface IDefault<T> extends IResult<T> {
  type: ConditionType.Default;
}
export type Rule<T> =
  | (IRule & (Condition<T> | ConditionGroup<T> | Not<T>))
  | IDefault<T>;

// JSON
interface IConditionName {
  name: ConditionName;
}
interface IsBetween extends IConditionName {
  name: ConditionName.isBetween;
  start: string | number;
  end: string | number;
}
interface IsEqual extends IConditionName {
  name: ConditionName.isEqual;
  target: any;
}
export type ConditionNameType = IsBetween | IsEqual;
export interface IConditionJSON extends Omit<ICondition, 'condition'> {
  condition: ConditionNameType;
}
export interface IConditionGroupJSON
  extends Omit<IConditionGroup, 'conditions'> {
  conditions: Array<IConditionGroupJSON | IConditionJSON | INotJSON>;
}
export interface INotJSON extends Omit<INot, 'condition'> {
  condition: IConditionGroupJSON | IConditionJSON | INotJSON;
}
type ConditionJSON<T> = IConditionJSON & Either<IResult<T>, INext<T>>;
type ConditionGroupJSON<T> = IConditionGroupJSON & Either<IResult<T>, INext<T>>;
type NotJSON<T> = INotJSON & Either<IResult<T>, INext<T>>;
export type RuleJSON<T> =
  | (IRule & (ConditionJSON<T> | ConditionGroupJSON<T> | NotJSON<T>))
  | IDefault<T>;
