import { EventEmitter } from "@angular/core";
import { Component, OnInit, OnChanges, Input, Output, SimpleChanges } from "@angular/core";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";
import { GeneralService } from "app/general.service";
import { PointsDataService } from "app/points/points-display/points-display.service";
import { Subject, Subscription } from "rxjs";


@Component({
  selector: 'jhi-like-dislike',
  templateUrl: './like_dislike.component.html',
  styleUrls: ['like_dislike.component.scss']
})
export class LikeDislikeComponent implements OnInit, OnChanges {
  @Input() like!: number;
  @Input() dislike!: number;
  @Input() disabled = false;
  @Output() liked: EventEmitter<{ liked: boolean; comment: string; }> = new EventEmitter();

  refresh: Subject<{ liked: boolean; comment: string; }> = new Subject();

  userLoggedIn!: IUser;

  points = 0;
  subscription!: Subscription;

  comment = '';

  constructor(private generalService: GeneralService, private userService: UserService, private pointsDataService: PointsDataService) {
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled'] !== undefined) {
      this.disabled = changes['disabled'].currentValue;
    }
  }

  ngOnInit(): void {
    this.subscription = this.pointsDataService.currentPoint.subscribe(points => (this.points = points));
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.userLoggedIn = u.body!;
    });
  }

  onLikeClick(): void {
    this.generalService.findPointsByKey('rating_like').subscribe(p => {
      const points = p.body!.points;
      this.userLoggedIn.points! += points!;
      this.generalService.updatePointsKeycloak(this.userLoggedIn.points, this.userLoggedIn.id).subscribe(u => {
        this.pointsDataService.changePoint(this.userLoggedIn.points!);
        this.like++;
        const liked = {liked: true, comment: this.comment}
        this.comment = '';
        this.liked.emit(liked);
        this.disabled = true;
      });
    });
  }

  onDislikeClick(): void {
    this.generalService.findPointsByKey('rating_like').subscribe(p => {
      const points = p.body!.points;
      this.userLoggedIn.points! += points!;
      this.generalService.updatePointsKeycloak(this.userLoggedIn.points!, this.userLoggedIn.id!).subscribe(u => {
        this.pointsDataService.changePoint(this.userLoggedIn.points!);
        this.dislike++;
        const liked = {liked: false, comment: this.comment}
        this.comment = '';
        this.liked.emit(liked);
        this.disabled = true;
      });
    });
  }
}
