import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IProfitBalance {
  id?: number;
  profit?: number | null;
  profitToSpend?: number | null;
  netProfit?: number | null;
  date?: dayjs.Dayjs | null;
  idea?: IIdea | null;
}

export class ProfitBalance implements IProfitBalance {
  constructor(
    public id?: number,
    public profit?: number | null,
    public profitToSpend?: number | null,
    public netProfit?: number | null,
    public date?: dayjs.Dayjs | null,
    public idea?: IIdea | null
  ) {}
}

export function getProfitBalanceIdentifier(profitBalance: IProfitBalance): number | undefined {
  return profitBalance.id;
}
