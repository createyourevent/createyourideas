import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IMonthlyOutgoingsInvoice {
  id?: number;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  idea?: IIdea | null;
}

export class MonthlyOutgoingsInvoice implements IMonthlyOutgoingsInvoice {
  constructor(public id?: number, public total?: number | null, public date?: dayjs.Dayjs | null, public idea?: IIdea | null) {}
}

export function getMonthlyOutgoingsInvoiceIdentifier(monthlyOutgoingsInvoice: IMonthlyOutgoingsInvoice): number | undefined {
  return monthlyOutgoingsInvoice.id;
}
