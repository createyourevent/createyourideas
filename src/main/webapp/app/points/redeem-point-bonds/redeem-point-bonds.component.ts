import { PointsDataService } from './../points-display/points-display.service';
import { IUser } from './../../entities/user/user.model';
import { BondService } from './../../entities/bond/service/bond.service';
import { GeneralService } from './../../general.service';
import { Component, OnInit } from '@angular/core';
import * as dayjs from "dayjs";

@Component({
  selector: 'jhi-redeem-point-bonds',
  templateUrl: './redeem-point-bonds.component.html',
  styleUrls: ['./redeem-point-bonds.component.scss']
})
export class RedeemPointBondsComponent implements OnInit {

  code: string;
  codeValide: boolean;
  user: IUser;

  constructor(private generalService: GeneralService, private pointsDataService: PointsDataService) { }

  ngOnInit(): void {
  }

  checkCode(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;

      this.generalService.findBondsByCode(this.code).subscribe(b => {
        const bond = b.body;
        if(bond.length === 1) {
          this.codeValide = true;
          bond.forEach(ele => {
            if(ele.redemptionDate !== null) {
              this.codeValide = false;
              return;
            }
            ele.redemptionDate = dayjs();
            ele.user = this.user;
            this.user.points += ele.points;
            this.generalService
            .updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points!)
            .subscribe(t => {
              this.generalService.findWidthAuthorities().subscribe(k => {
                this.pointsDataService.changePoint(k.body.points);
              });
            });

            this.generalService.updateBond(ele).subscribe();
          });
        }else if(bond.length > 1 || bond.length === 0) {
          this.codeValide = false;
        }

      });
    });
  }

}
