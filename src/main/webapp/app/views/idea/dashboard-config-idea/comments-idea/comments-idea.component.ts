import { IIdea } from 'app/entities/idea/idea.model';
import { Component, OnInit } from '@angular/core';
import { IIdeaComment } from 'app/entities/idea-comment/idea-comment.model';
import { IdeaCommentService } from 'app/entities/idea-comment/service/idea-comment.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { ConfigIdeaService } from '../config-idea.service';

@Component({
  selector: 'jhi-comments-idea',
  templateUrl: './comments-idea.component.html',
  styleUrls: ['./comments-idea.component.scss']
})
export class CommentsIdeaComponent implements OnInit {

  comments: IIdeaComment[] = [];
  user: IUser;
  idea: IIdea;

  constructor(private ideaCommentService: IdeaCommentService, private generalService: GeneralService, protected ideaService: ConfigIdeaService) { }

  ngOnInit() {
    this.idea = this.ideaService.idea;
    this.generalService.findIdeaCommentsByIdeaId(this.idea.id).subscribe(ics => {
      this.comments = ics.body;
    });
  }

  onDelete(id: number): void {
    this.ideaCommentService.delete(id).subscribe(() => {
      this.comments.forEach((ele: IIdeaComment) => {
        const z = this.comments.findIndex(e => e.id === id);
        if(z > -1) {
          this.comments.splice(z, 1);
        }
      });
    });
  }

}
