import * as dayjs from 'dayjs';
import { PointsCategory } from 'app/entities/enumerations/points-category.model';

export interface IPoint {
  id?: number;
  key?: string | null;
  name?: string | null;
  keyName?: string | null;
  description?: string | null;
  keyDescription?: string | null;
  category?: PointsCategory | null;
  points?: number | null;
  countPerDay?: number | null;
  creationDate?: dayjs.Dayjs | null;
}

export class Point implements IPoint {
  constructor(
    public id?: number,
    public key?: string | null,
    public name?: string | null,
    public keyName?: string | null,
    public description?: string | null,
    public keyDescription?: string | null,
    public category?: PointsCategory | null,
    public points?: number | null,
    public countPerDay?: number | null,
    public creationDate?: dayjs.Dayjs | null
  ) {}
}

export function getPointIdentifier(point: IPoint): number | undefined {
  return point.id;
}
