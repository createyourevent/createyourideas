import * as dayjs from 'dayjs';
import { IUser } from 'app/entities/user/user.model';
import { IWorksheet } from 'app/entities/worksheet/worksheet.model';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IEmployee {
  id?: number;
  hourlyWages?: number | null;
  date?: dayjs.Dayjs | null;
  user?: IUser | null;
  worksheets?: IWorksheet[] | null;
  ideas?: IIdea[] | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public hourlyWages?: number | null,
    public date?: dayjs.Dayjs | null,
    public user?: IUser | null,
    public worksheets?: IWorksheet[] | null,
    public ideas?: IIdea[] | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
