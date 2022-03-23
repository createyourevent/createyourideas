import * as dayjs from 'dayjs';
import { IPoint } from 'app/entities/point/point.model';
import { IUser } from 'app/entities/user/user.model';

export interface IUserPointAssociation {
  id?: number;
  date?: dayjs.Dayjs | null;
  points?: IPoint | null;
  users?: IUser | null;
}

export class UserPointAssociation implements IUserPointAssociation {
  constructor(public id?: number, public date?: dayjs.Dayjs | null, public points?: IPoint | null, public users?: IUser | null) {}
}

export function getUserPointAssociationIdentifier(userPointAssociation: IUserPointAssociation): number | undefined {
  return userPointAssociation.id;
}
