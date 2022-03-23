import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IIncome {
  id?: number;
  title?: string;
  description?: string;
  date?: dayjs.Dayjs;
  value?: number;
  billed?: boolean | null;
  fromParentIdea?: boolean | null;
  auto?: boolean | null;
  incomeIdeas?: IIdea[] | null;
  idea?: IIdea | null;
}

export class Income implements IIncome {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public date?: dayjs.Dayjs,
    public value?: number,
    public billed?: boolean | null,
    public fromParentIdea?: boolean | null,
    public auto?: boolean | null,
    public incomeIdeas?: IIdea[] | null,
    public idea?: IIdea | null
  ) {
    this.billed = this.billed ?? false;
    this.fromParentIdea = this.fromParentIdea ?? false;
    this.auto = this.auto ?? false;
  }
}

export function getIncomeIdentifier(income: IIncome): number | undefined {
  return income.id;
}
