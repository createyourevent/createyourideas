import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IApplication {
  id?: number;
  title?: string | null;
  description?: string | null;
  date?: dayjs.Dayjs | null;
  desiredHourlyWage?: number | null;
  seen?: boolean | null;
  responded?: boolean | null;
  user?: IUser | null;
  idea?: IIdea | null;
}

export class Application implements IApplication {
  constructor(
    public id?: number,
    public title?: string | null,
    public description?: string | null,
    public date?: dayjs.Dayjs | null,
    public desiredHourlyWage?: number | null,
    public seen?: boolean | null,
    public responded?: boolean | null,
    public user?: IUser | null,
    public idea?: IIdea | null
  ) {
    this.seen = this.seen ?? false;
    this.responded = this.responded ?? false;
  }
}

export function getApplicationIdentifier(application: IApplication): number | undefined {
  return application.id;
}
