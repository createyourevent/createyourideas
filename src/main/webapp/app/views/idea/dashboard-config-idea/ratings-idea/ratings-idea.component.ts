import { Component, OnInit } from '@angular/core';
import { IdeaLikeDislikeService } from 'app/entities/idea-like-dislike/service/idea-like-dislike.service';
import { IIdea } from 'app/entities/idea/idea.model';
import { GeneralService } from 'app/general.service';
import { ConfigIdeaService } from '../config-idea.service';

@Component({
  selector: 'jhi-ratings-idea',
  templateUrl: './ratings-idea.component.html',
  styleUrls: ['./ratings-idea.component.scss'],
})
export class RatingsIdeaComponent implements OnInit {
  likes: any[] = [];
  dislikes: any[] = [];
  stars: any[] = [];
  idea: IIdea;

  constructor(private ideaLikeDislikeService: IdeaLikeDislikeService, private configIdeaService: ConfigIdeaService, private generalService: GeneralService) {}

  ngOnInit() {
    this.idea = this.configIdeaService.idea;
    this.generalService.findIdeaLikeDislikeByIdeaId(this.idea.id).subscribe(res => {
      res.body!.forEach(element => {
        if (element.like === 1) {
          this.likes.push(element);
        }
        if (element.dislike === 1) {
          this.dislikes.push(element);
        }
      });
    });
    this.generalService.findIdeaStarRatingsByIdeaId(this.idea.id).subscribe(res => {
      res.body!.forEach(element => {
        this.stars.push(element);
      })
    });
  }


  previousState(): void {
    window.history.back();
  }

  onDeleteDislikes(id: number): void {
    this.ideaLikeDislikeService.delete(id).subscribe();
  }

  onDeleteLikes(id: number): void {
    this.ideaLikeDislikeService.delete(id).subscribe();
  }
}
