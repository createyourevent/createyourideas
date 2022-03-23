import { Component, OnInit, OnDestroy } from "@angular/core";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import { Subscription } from "rxjs";
import { PointsDataService } from "./points-display.service";


@Component({
  selector: 'jhi-points-display',
  templateUrl: './points-display.component.html',
  styleUrls: ['./points-display.component.scss']
})
export class PointsDisplayComponent implements OnInit, OnDestroy {
  user!: IUser;
  points = 0;
  subscription!: Subscription;

  constructor(private generalService: GeneralService, private pointsData: PointsDataService) {}

  ngOnInit(): void {
    this.subscription = this.pointsData.currentPoint.subscribe(points => {
      this.points = points;
    });
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
      if (this.user.points) {
        this.points = this.user.points;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
