import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DataUtils } from 'app/core/util/data-util.service';
import { IdeaComment, IIdeaComment } from 'app/entities/idea-comment/idea-comment.model';
import { IdeaCommentService } from 'app/entities/idea-comment/service/idea-comment.service';
import { IdeaLikeDislike, IIdeaLikeDislike } from 'app/entities/idea-like-dislike/idea-like-dislike.model';
import { IdeaLikeDislikeService } from 'app/entities/idea-like-dislike/service/idea-like-dislike.service';
import { IdeaStarRating } from 'app/entities/idea-star-rating/idea-star-rating.model';
import { IdeaStarRatingService } from 'app/entities/idea-star-rating/service/idea-star-rating.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-view-idea',
  templateUrl: './view-idea.component.html',
})
export class ViewIdeaComponent implements OnInit {
  idea: IIdea | null = null;
  incomes = 0;
  outgoings = 0;
  worksheets = 0;
  dailyIncomes = 0;
  dailyOutgoings = 0;
  dailyWorksheets = 0;
  profit = 0;
  dailyProfit = 0;
  comments: IIdeaComment[] = [];
  user: IUser;

  like = 0;
  dislike = 0;
  likeDislike: IIdeaLikeDislike[] = [];
  rated = false;
  stars = 0;
  ratedStars = false;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private generalService: GeneralService, private ideaCommentService: IdeaCommentService, private ideaStarRatingService: IdeaStarRatingService, private ideaLikeDislikeService: IdeaLikeDislikeService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;

      this.activatedRoute.data.subscribe(({ idea }) => {
        this.idea = idea;

        this.idea.incomes.forEach(i => {
          this.incomes += i.value;
        });
        this.idea.outgoings.forEach(o => {
          this.outgoings += o.value;
        });
        this.idea.worksheets.forEach(o => {
          this.worksheets += o.total;
        });


        this.profit = this.incomes - (this.outgoings + this.worksheets)

        this.generalService.findAllIncomeByIdeaIdAndDate(this.idea.id, dayjs()).subscribe(di => {
          di.body.forEach(i => {
            this.dailyIncomes += i.value;
          });
        });
        this.generalService.findAllOutgoingByIdeaIdAndDate(this.idea.id, dayjs()).subscribe(oi => {
          oi.body.forEach(i => {
            this.dailyOutgoings += i.value;
          });
        });
        this.generalService.findAllWorksheetByIdeaIdAndDate(this.idea.id, dayjs()).subscribe(oi => {
          oi.body.forEach(i => {
            this.dailyWorksheets += i.total;
          });
        });
        this.dailyProfit = this.dailyIncomes - (this.dailyOutgoings + this.worksheets )

        this.loadComments();

        this.generalService.findIdeaLikeDislikeByIdeaId(this.idea.id!).subscribe(res => {
          res.body!.forEach(element => {
            if (element.like === 1) {
              this.like++;
            }
            if (element.dislike === 1) {
              this.dislike++;
            }
          });
          this.generalService.findIdeaLikeDislikeByIdeaIdAndUserId(this.idea.id, this.user.id!).subscribe(res => {
            if (res.body!.length === 0) {
              this.rated = false;
            } else {
              this.rated = true;
            }
          });
        });


        this.generalService.findIdeaStarRatingsByIdeaIdAndUserId(this.idea.id, this.user.id!).subscribe(res => {
          if(res.body !== null) {
            this.ratedStars = true;
            this.stars = res.body!.stars!;
          }
        });
      });

    })
  }

  loadComments() {
    this.generalService.queryIdeaByActiveTrueEagerAll(this.idea.id).subscribe(res => {
      this.comments = res.body.ideaComments;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }

  onCommented(comment: string): void {
    const ideaComment: IdeaComment = new IdeaComment();
    ideaComment.comment = comment;
    ideaComment.date = dayjs();
    ideaComment.user = this.user;
    ideaComment.idea = this.idea;
    this.ideaCommentService.create(ideaComment).subscribe(sc => {
      this.comments.push(sc.body);
      this.loadComments();
    });
  }

  onAnswered(event: any): void {
    this.ideaCommentService.find(event.commentId).subscribe(comment => {
      const ideaComment: IdeaComment = new IdeaComment();
      ideaComment.comment = event.answer;
      ideaComment.date = dayjs();
      ideaComment.user = this.user;
      ideaComment.idea = this.idea;
      ideaComment.ideaComment = comment.body;
      this.ideaCommentService.create(ideaComment).subscribe(sc => {
        if(comment.body.ideaComments === null) {
          comment.body.ideaComments = [];
        }
        comment.body.ideaComments.push(sc.body);
        this.ideaCommentService.update(comment.body).subscribe(() => {
          this.loadComments();
        });
      });
    });
  }

  onChangesStars(val: any): void {
    const ideaStarsRating: IdeaStarRating = new IdeaStarRating();
    ideaStarsRating.comment = val.comment;
    ideaStarsRating.date = dayjs();
    ideaStarsRating.user = this.user;
    ideaStarsRating.idea = this.idea;
    ideaStarsRating.stars = val.stars;
    this.ideaStarRatingService.create(ideaStarsRating).subscribe(() => {
      this.ratedStars = true;
    });
  }

  onVoted(l: any): void {
    const liked = l.liked;
    const comment = l.comment;
    if (liked) {
      // this.like++;
      this.onLiked(comment);
    } else {
      // this.dislike++;
      this.onDislike(comment);
    }
  }

  onLiked(comment: string): void {
    const ideaLikeDislike: IdeaLikeDislike = new IdeaLikeDislike();
    ideaLikeDislike.like = 1;
    ideaLikeDislike.dislike = 0;
    ideaLikeDislike.idea = this.idea;
    ideaLikeDislike.user = this.user;
    ideaLikeDislike.date = dayjs();
    ideaLikeDislike.comment = comment;
    this.ideaLikeDislikeService.create(ideaLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

  onDislike(comment: string): void {
    const ideaLikeDislike = new IdeaLikeDislike();
    ideaLikeDislike.like = 0;
    ideaLikeDislike.dislike = 1;
    ideaLikeDislike.idea = this.idea;
    ideaLikeDislike.user = this.user;
    ideaLikeDislike.date = dayjs();
    ideaLikeDislike.comment = comment;
    this.ideaLikeDislikeService.create(ideaLikeDislike).subscribe(() => {
      this.rated = true;
    });
  }

}
