import { Component, OnInit } from "@angular/core";
import { IGiftShoppingCart } from "app/entities/gift-shopping-cart/gift-shopping-cart.model";
import { IUser } from "app/entities/user/user.model";
import { GeneralService } from "app/general.service";


@Component({
  selector: 'jhi-my-gifts',
  templateUrl: './my-gifts.component.html',
  styleUrls: ['./my-gifts.component.scss']
})
export class MyGiftsComponent implements OnInit {
  carts!: IGiftShoppingCart[];
  user!: IUser;

  constructor(private generalService: GeneralService) {}

  ngOnInit() {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;
      this.generalService.findAllIGiftShoppingCartsByUserId(this.user.id).subscribe(res => {
        this.carts = res.body!;
      });
    });
  }
}
