import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { GeneralService } from 'app/general.service';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jhi-star-rating',
  templateUrl: './starRating.component.html',
  styleUrls: ['./starRating.component.scss']
})
export class StarRatingComponent implements OnInit {

  userLoggedIn!: IUser;

  points!: number;
  subscription!: Subscription;

  stars = 10;
  @Input() val!: number;
  comment = '';
  @Input() disabled = false;
  @Output() rated = new EventEmitter<any>();

  constructor(private generalService: GeneralService, private userService: UserService, private pointsDataService: PointsDataService) {}

  ngOnInit(): void {
    this.subscription = this.pointsDataService.currentPoint.subscribe(points => (this.points = points));
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.userLoggedIn = u.body!;
    });
  }

  onStarsChange(e: any): void {
    this.disabled = true;
    this.generalService.findPointsByKey('rating_stars').subscribe(p => {
      const points = p.body!.points;
      this.userLoggedIn.points! += points!;
      this.generalService.updatePointsKeycloak(this.userLoggedIn.points!, this.userLoggedIn.id!).subscribe(u => {
        this.pointsDataService.changePoint(this.userLoggedIn.points!);

        const r = {stars: this.val, comment: this.comment}
        this.comment = '';
        this.rated.emit(r);
        this.disabled = true;
      });
    });
  }
}
