import * as dayjs from 'dayjs';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';

export interface IIdeaComment {
  id?: number;
  comment?: string | null;
  date?: dayjs.Dayjs | null;
  ideaComments?: IIdeaComment[] | null;
  idea?: IIdea | null;
  user?: IUser | null;
  ideaComment?: IIdeaComment | null;
}

export class IdeaComment implements IIdeaComment {
  constructor(
    public id?: number,
    public comment?: string | null,
    public date?: dayjs.Dayjs | null,
    public ideaComments?: IIdeaComment[] | null,
    public idea?: IIdea | null,
    public user?: IUser | null,
    public ideaComment?: IIdeaComment | null
  ) {}
}

export function getIdeaCommentIdentifier(ideaComment: IIdeaComment): number | undefined {
  return ideaComment.id;
}
