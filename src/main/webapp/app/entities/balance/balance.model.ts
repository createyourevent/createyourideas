import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IBalance {
  id?: number;
  dailyBalance?: number | null;
  netProfit?: number | null;
  date?: dayjs.Dayjs | null;
  billed?: boolean | null;
  idea?: IIdea | null;
}

export class Balance implements IBalance {
  constructor(
    public id?: number,
    public dailyBalance?: number | null,
    public netProfit?: number | null,
    public date?: dayjs.Dayjs | null,
    public billed?: boolean | null,
    public idea?: IIdea | null
  ) {
    this.billed = this.billed ?? false;
  }
}

export function getBalanceIdentifier(balance: IBalance): number | undefined {
  return balance.id;
}
