import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';
import { IIdea } from 'app/entities/idea/idea.model';
import { Duration } from 'dayjs/plugin/duration';

export interface IWorksheet {
  id?: number;
  jobtitle?: string;
  jobdescription?: string;
  dateStart?: dayjs.Dayjs | null;
  dateEnd?: dayjs.Dayjs | null;
  costHour?: number;
  hours?: Duration | null;
  total?: number | null;
  billed?: boolean | null;
  auto?: boolean | null;
  employee?: IEmployee | null;
  idea?: IIdea | null;
}

export class Worksheet implements IWorksheet {
  constructor(
    public id?: number,
    public jobtitle?: string,
    public jobdescription?: string,
    public dateStart?: dayjs.Dayjs | null,
    public dateEnd?: dayjs.Dayjs | null,
    public costHour?: number,
    public hours?: Duration | null,
    public total?: number | null,
    public billed?: boolean | null,
    public auto?: boolean | null,
    public employee?: IEmployee | null,
    public idea?: IIdea | null
  ) {
    this.billed = this.billed ?? false;
    this.auto = this.auto ?? false;
  }
}

export function getWorksheetIdentifier(worksheet: IWorksheet): number | undefined {
  return worksheet.id;
}
