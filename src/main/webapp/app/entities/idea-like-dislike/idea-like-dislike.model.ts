import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';

export interface IIdeaLikeDislike {
  id?: number;
  like?: number | null;
  dislike?: number | null;
  date?: dayjs.Dayjs | null;
  comment?: string | null;
  idea?: IIdea | null;
  user?: IUser | null;
}

export class IdeaLikeDislike implements IIdeaLikeDislike {
  constructor(
    public id?: number,
    public like?: number | null,
    public dislike?: number | null,
    public date?: dayjs.Dayjs | null,
    public comment?: string | null,
    public idea?: IIdea | null,
    public user?: IUser | null
  ) {}
}

export function getIdeaLikeDislikeIdentifier(ideaLikeDislike: IIdeaLikeDislike): number | undefined {
  return ideaLikeDislike.id;
}
