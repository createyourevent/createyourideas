import { EventEmitter } from "@angular/core";
import { Component, OnChanges, Input, Output, SimpleChanges } from "@angular/core";
import { SharedChatService } from "app/chat.service";
import { IdeaCommentService } from "app/entities/idea-comment/service/idea-comment.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-admin-comment-box',
  templateUrl: './admin-comment-box.component.html',
  styleUrls: ['admin-comment-box.component.scss']
})
export class AdminCommentBoxComponent implements OnChanges {
  @Input() comments!: any[];

  @Output() deleted: EventEmitter<number> = new EventEmitter();

  userLoggedIn!: IUser;

  constructor(private sharedChatService: SharedChatService, private generalService: GeneralService, private ideaCommentService: IdeaCommentService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments'] !== undefined) {
      this.comments = changes['comments'].currentValue;
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.userLoggedIn = u.body!;
      });
    }
  }

  deleteComment(id: number): void {
      this.deleted.emit(id);
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }
}
