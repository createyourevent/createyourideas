import { Component, OnInit } from "@angular/core";
import { PointsCategory } from "app/entities/enumerations/points-category.model";
import { IPoint } from "app/entities/point/point.model";
import { PointService } from "app/entities/point/service/point.service";


@Component({
  selector: 'jhi-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss']
})
export class PointsComponent implements OnInit {
  points!: IPoint[];
  categories!: PointsCategory;

  pointsEvent: IPoint[] = [];
  pointsShop: IPoint[] = [];
  pointsService: IPoint[] = [];
  pointsComment: IPoint[] = [];
  pointsRating: IPoint[] = [];
  pointsRegister: IPoint[] = [];
  pointsMiscellaneous: IPoint[] = [];
  pointsProduct: IPoint[] = [];

  constructor(private pointService: PointService) {}

  ngOnInit(): void {
    this.pointService.query().subscribe(p => {
      this.points = p.body!;

      this.points.forEach(e => {
        switch (e.category) {
          case PointsCategory.EVENT:
            this.pointsEvent.push(e);
            break;
          case PointsCategory.SHOP:
            this.pointsShop.push(e);
            break;
          case PointsCategory.SERVICE:
            this.pointsService.push(e);
            break;
          case PointsCategory.COMMENT:
            this.pointsComment.push(e);
            break;
          case PointsCategory.RATING:
            this.pointsRating.push(e);
            break;
          case PointsCategory.MISCELLANEOUS:
            this.pointsMiscellaneous.push(e);
            break;
          case PointsCategory.PRODUCT:
            this.pointsProduct.push(e);
            break;
          case PointsCategory.REGISTER:
            this.pointsRegister.push(e);
            break;
          default:
            break;
        }
      });
    });
  }
}
