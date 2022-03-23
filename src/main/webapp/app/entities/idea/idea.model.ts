import * as dayjs from 'dayjs';
import { IProfitBalance } from 'app/entities/profit-balance/profit-balance.model';
import { IIncome } from 'app/entities/income/income.model';
import { IOutgoings } from 'app/entities/outgoings/outgoings.model';
import { IWorksheet } from 'app/entities/worksheet/worksheet.model';
import { IBalance } from 'app/entities/balance/balance.model';
import { IDonation } from 'app/entities/donation/donation.model';
import { IApplication } from 'app/entities/application/application.model';
import { IMonthlyIncomeInvoice } from 'app/entities/monthly-income-invoice/monthly-income-invoice.model';
import { IMonthlyOutgoingsInvoice } from 'app/entities/monthly-outgoings-invoice/monthly-outgoings-invoice.model';
import { IUser } from 'app/entities/user/user.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IIdeaStarRating } from 'app/entities/idea-star-rating/idea-star-rating.model';
import { IIdeaComment } from 'app/entities/idea-comment/idea-comment.model';
import { IIdeaLikeDislike } from 'app/entities/idea-like-dislike/idea-like-dislike.model';
import { Ideatype } from 'app/entities/enumerations/ideatype.model';

export interface IIdea {
  id?: number;
  title?: string;
  logoContentType?: string;
  logo?: string;
  description?: string;
  ideatype?: Ideatype | null;
  interest?: number;
  distribution?: number;
  investment?: number;
  active?: boolean | null;
  date?: dayjs.Dayjs | null;
  profitBalance?: IProfitBalance | null;
  incomes?: IIncome[] | null;
  outgoings?: IOutgoings[] | null;
  worksheets?: IWorksheet[] | null;
  parents?: IIdea[] | null;
  balances?: IBalance[] | null;
  donations?: IDonation[] | null;
  applications?: IApplication[] | null;
  monthlyIncomeInvoices?: IMonthlyIncomeInvoice[] | null;
  monthlyOutgoingsInvoices?: IMonthlyOutgoingsInvoice[] | null;
  user?: IUser | null;
  employees?: IEmployee[] | null;
  idea?: IIdea | null;
  ideaStarRatings?: IIdeaStarRating[] | null;
  ideaComments?: IIdeaComment[] | null;
  ideaLikeDislikes?: IIdeaLikeDislike[] | null;
  ideaOutgoings?: IOutgoings[] | null;
  ideaIncomes?: IIncome[] | null;
}

export class Idea implements IIdea {
  constructor(
    public id?: number,
    public title?: string,
    public logoContentType?: string,
    public logo?: string,
    public description?: string,
    public ideatype?: Ideatype | null,
    public interest?: number,
    public distribution?: number,
    public investment?: number,
    public active?: boolean | null,
    public date?: dayjs.Dayjs | null,
    public profitBalance?: IProfitBalance | null,
    public incomes?: IIncome[] | null,
    public outgoings?: IOutgoings[] | null,
    public worksheets?: IWorksheet[] | null,
    public parents?: IIdea[] | null,
    public balances?: IBalance[] | null,
    public donations?: IDonation[] | null,
    public applications?: IApplication[] | null,
    public monthlyIncomeInvoices?: IMonthlyIncomeInvoice[] | null,
    public monthlyOutgoingsInvoices?: IMonthlyOutgoingsInvoice[] | null,
    public user?: IUser | null,
    public employees?: IEmployee[] | null,
    public idea?: IIdea | null,
    public ideaStarRatings?: IIdeaStarRating[] | null,
    public ideaComments?: IIdeaComment[] | null,
    public ideaLikeDislikes?: IIdeaLikeDislike[] | null,
    public ideaOutgoings?: IOutgoings[] | null,
    public ideaIncomes?: IIncome[] | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getIdeaIdentifier(idea: IIdea): number | undefined {
  return idea.id;
}
