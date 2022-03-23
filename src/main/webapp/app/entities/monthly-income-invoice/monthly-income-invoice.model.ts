import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IMonthlyIncomeInvoice {
  id?: number;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  idea?: IIdea | null;
}

export class MonthlyIncomeInvoice implements IMonthlyIncomeInvoice {
  constructor(public id?: number, public total?: number | null, public date?: dayjs.Dayjs | null, public idea?: IIdea | null) {}
}

export function getMonthlyIncomeInvoiceIdentifier(monthlyIncomeInvoice: IMonthlyIncomeInvoice): number | undefined {
  return monthlyIncomeInvoice.id;
}
