import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class PointsDataService {
  private messageSource = new BehaviorSubject(0);
  currentPoint = this.messageSource.asObservable();

  constructor() {}

  changePoint(points: number): void {
    this.messageSource.next(points);
  }
}
