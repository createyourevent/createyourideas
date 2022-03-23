import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GiftShoppingCart } from "app/entities/gift-shopping-cart/gift-shopping-cart.model";
import { GiftShoppingCartService } from "app/entities/gift-shopping-cart/service/gift-shopping-cart.service";
import { IGift } from "app/entities/gift/gift.model";
import { GiftService } from "app/entities/gift/service/gift.service";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";
import * as dayjs from "dayjs";
import { MessageService } from "primeng/api";
import { PointsDataService } from "../points-display/points-display.service";


@Component({
  selector: 'jhi-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss'],
  providers: [MessageService]
})
export class ExchangeComponent implements OnInit {
  gifts!: IGift[];
  user!: IUser;

  constructor(
    private generalService: GeneralService,
    private giftShoppingCartService: GiftShoppingCartService,
    private messageService: MessageService,
    private translate: TranslateService,
    private giftService: GiftService,
    private pointsData: PointsDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
    });

    this.generalService.findGiftsByActiveTrue().subscribe(res => {
      if (!this.gifts) {
        this.gifts = [];
      }
      res.body!.forEach(element => {
        if (element.stock! > 0) {
          this.gifts.push(element);
        }
      });
    });
  }

  exchange(gift: IGift): void {
    if (gift.points! > this.user.points!) {
      this.messageService.add({
        key: 'myKey1',
        severity: 'error',
        summary: this.translate.instant('select-products.error'),
        detail: this.translate.instant('exchange.too-few-points')
      });
      return;
    }
    const cart = new GiftShoppingCart();
    cart.user = this.user;
    cart.gift = gift;
    cart.amount = 1;
    cart.date = dayjs();
    this.giftShoppingCartService.create(cart).subscribe(() => {
      this.user!.points! -= gift.points!;
      this.pointsData.changePoint(this.user!.points!);
      this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user!.loggedIn!, this.user!.points!).subscribe();
      gift.stock! -= 1;
      this.giftService.update(gift).subscribe();
      this.router.navigate(['/my-gifts']);
    });
  }
}
