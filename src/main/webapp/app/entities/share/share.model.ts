import * as dayjs from 'dayjs';

export interface IShare {
  id?: number;
  value?: number | null;
  date?: dayjs.Dayjs | null;
}

export class Share implements IShare {
  constructor(public id?: number, public value?: number | null, public date?: dayjs.Dayjs | null) {}
}

export function getShareIdentifier(share: IShare): number | undefined {
  return share.id;
}
