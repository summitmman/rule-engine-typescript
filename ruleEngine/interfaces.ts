import { IConditionHelperType } from './conditionHelpers/interfaces';
import { ConditionType } from './enums';

export interface ICondition {
  type: ConditionType.Condition;
  key: string;
  condition: IConditionHelperType;
}
export interface IConditionGroup {
  type: Exclude<ConditionType, ConditionType.Condition | ConditionType.Not>;
  conditions: Array<IConditionGroup | ICondition | INot>;
}
export interface INot {
  type: ConditionType.Not;
  condition: IConditionGroup | ICondition | INot;
}

interface IResult<T> {
  result: T;
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
