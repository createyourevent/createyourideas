import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';

export interface IOutgoings {
  id?: number;
  title?: string;
  description?: string;
  date?: dayjs.Dayjs;
  value?: number;
  billed?: boolean | null;
  toChildIdea?: boolean | null;
  auto?: boolean | null;
  outgoingIdeas?: IIdea[] | null;
  idea?: IIdea | null;
}

export class Outgoings implements IOutgoings {
  constructor(
    public id?: number,
    public title?: string,
    public description?: string,
    public date?: dayjs.Dayjs,
    public value?: number,
    public billed?: boolean | null,
    public toChildIdea?: boolean | null,
    public auto?: boolean | null,
    public outgoingIdeas?: IIdea[] | null,
    public idea?: IIdea | null
  ) {
    this.billed = this.billed ?? false;
    this.toChildIdea = this.toChildIdea ?? false;
    this.auto = this.auto ?? false;
  }
}

export function getOutgoingsIdentifier(outgoings: IOutgoings): number | undefined {
  return outgoings.id;
}
