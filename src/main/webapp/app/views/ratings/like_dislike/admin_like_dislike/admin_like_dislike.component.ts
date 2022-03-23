import { EventEmitter } from "@angular/core";
import { Component, OnInit, Input, Output } from "@angular/core";
import { SharedChatService } from "app/chat.service";
import { IdeaLikeDislikeService } from "app/entities/idea-like-dislike/service/idea-like-dislike.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-like-dislike',
  templateUrl: './admin_like_dislike.component.html',
  styleUrls: ['admin_like_dislike.component.scss']
})
export class AdminLikeDislikeComponent implements OnInit {
  @Input() likes: any[] = [];
  @Input() dislikes: any[] = [];

  @Output() deletedLikes: EventEmitter<number> = new EventEmitter();
  @Output() deletedDislikes: EventEmitter<number> = new EventEmitter();

  userLoggedIn!: IUser;

  constructor(private ideaLikeDislikeService: IdeaLikeDislikeService, private sharedChatService: SharedChatService, private generalService: GeneralService) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.userLoggedIn = u.body!;
    });
  }

  deleteLikes(id: number): void {
    this.likes = this.likes.filter(element => element.id !== id);
    this.deletedLikes.emit(id);
  }

  deleteDislikes(id: number): void {
    this.dislikes = this.dislikes.filter(element => element.id !== id);
    this.deletedDislikes.emit(id);
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }
}
