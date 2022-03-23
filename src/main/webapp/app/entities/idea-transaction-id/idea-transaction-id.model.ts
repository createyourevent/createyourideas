import * as dayjs from 'dayjs';
import { IDonation } from 'app/entities/donation/donation.model';

export interface IIdeaTransactionId {
  id?: number;
  transactionId?: string | null;
  refNo?: string | null;
  date?: dayjs.Dayjs | null;
  idea?: IDonation | null;
}

export class IdeaTransactionId implements IIdeaTransactionId {
  constructor(
    public id?: number,
    public transactionId?: string | null,
    public refNo?: string | null,
    public date?: dayjs.Dayjs | null,
    public idea?: IDonation | null
  ) {}
}

export function getIdeaTransactionIdIdentifier(ideaTransactionId: IIdeaTransactionId): number | undefined {
  return ideaTransactionId.id;
}
