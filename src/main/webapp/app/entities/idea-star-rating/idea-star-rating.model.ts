import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';

export interface IIdeaStarRating {
  id?: number;
  stars?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  idea?: IIdea | null;
  user?: IUser | null;
}

export class IdeaStarRating implements IIdeaStarRating {
  constructor(
    public id?: number,
    public stars?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public idea?: IIdea | null,
    public user?: IUser | null
  ) {}
}

export function getIdeaStarRatingIdentifier(ideaStarRating: IIdeaStarRating): number | undefined {
  return ideaStarRating.id;
}
