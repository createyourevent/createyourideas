import * as dayjs from 'dayjs';
import { IIdeaTransactionId } from 'app/entities/idea-transaction-id/idea-transaction-id.model';
import { IUser } from 'app/entities/user/user.model';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IDonation {
  id?: number;
  amount?: number | null;
  date?: dayjs.Dayjs | null;
  billed?: boolean | null;
  txId?: IIdeaTransactionId | null;
  user?: IUser | null;
  idea?: IIdea | null;
}

export class Donation implements IDonation {
  constructor(
    public id?: number,
    public amount?: number | null,
    public date?: dayjs.Dayjs | null,
    public billed?: boolean | null,
    public txId?: IIdeaTransactionId | null,
    public user?: IUser | null,
    public idea?: IIdea | null
  ) {
    this.billed = this.billed ?? false;
  }
}

export function getDonationIdentifier(donation: IDonation): number | undefined {
  return donation.id;
}
