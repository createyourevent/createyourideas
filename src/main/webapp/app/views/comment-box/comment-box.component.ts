
import { Component, OnChanges, OnInit, Input, Output, ViewChild, SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SharedChatService } from 'app/chat.service';
import { UserPointAssociationService } from 'app/entities/user-point-association/service/user-point-association.service';
import { UserPointAssociation } from 'app/entities/user-point-association/user-point-association.model';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { IChatController } from 'ng-chat';
import { Subscription } from 'rxjs';
import * as dayjs from 'dayjs';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'jhi-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['comment-box.component.scss']
})
export class CommentBoxComponent implements OnChanges, OnInit {
  @Input() comments!: any[];
  @Output() comment: EventEmitter<string> = new EventEmitter();
  @Output() answer: EventEmitter<{commentId: number, answer: string}> = new EventEmitter();

  @ViewChild('op')
  private _op!: OverlayPanel;

  @ViewChild('ngChatInstance')
  protected ngChatInstance!: IChatController;

  userLoggedIn!: IUser;

  points: number = 0;
  subscription: Subscription = new Subscription();

  textareaInput = new FormControl(null, Validators.required);
  answerInput = new FormControl(null, Validators.required);

  constructor(
    private sharedChatService: SharedChatService,
    private generalService: GeneralService,
    private pointsDataService: PointsDataService,
    private userPointAssociationService: UserPointAssociationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.pointsDataService.currentPoint.subscribe(points => (this.points = points));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['comments'] !== undefined) {
      this.comments = changes['comments'].currentValue;
      this.generalService.findWidthAuthorities().subscribe(u => {
        this.userLoggedIn = u.body!;
      });
    }
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  clickAnswer(commentId: number): void {
    this.answer.emit({commentId: commentId, answer: this.answerInput.value});
    this.answerInput.reset();
    this._op.hide();
  }

  saveComment(): void {
    this.generalService.findPointsByKey('add_comment').subscribe(p => {
      const points = p.body!;
      this.generalService.findUserPointAssociationByUsersIdAndPointkey(this.userLoggedIn.id!, points.key!).subscribe(s => {
        const upa = s.body!;
        const day = dayjs();
        let i = 0;
        upa.forEach(element => {
          if (element.date === day) {
            i++;
          }
        });
        if (i < points.countPerDay!) {
          const iupa = new UserPointAssociation();
          iupa.users = this.userLoggedIn;
          iupa.points = points;
          iupa.date = dayjs();
          this.userPointAssociationService.create(iupa).subscribe();
          this.userLoggedIn.points! += points.points!;
          this.userLoggedIn.loggedIn = true;
          this.generalService
            .updateUserLoggedInAndPoints(this.userLoggedIn.id!, this.userLoggedIn.loggedIn, this.userLoggedIn.points!)
            .subscribe(t => {
              this.generalService.findWidthAuthorities().subscribe(k => {
                this.pointsDataService.changePoint(k.body!.points!);
              });
            });
        }
      });
    });
    this.comment.emit(this.textareaInput.value);
    this.textareaInput.reset();
  }
}
