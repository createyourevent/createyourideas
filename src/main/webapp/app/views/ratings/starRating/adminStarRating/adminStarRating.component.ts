import { Component, Input, OnInit } from '@angular/core';
import { SharedChatService } from 'app/chat.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-admin-star-rating',
  templateUrl: './adminStarRating.component.html',
  styleUrls: ['./adminStarRating.component.scss']
})
export class AdminStarRatingComponent implements OnInit {



  userLoggedIn!: IUser;
  @Input() stars: any[] = [];


  constructor( private sharedChatService: SharedChatService, private generalService: GeneralService) { }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(us => {
      this.userLoggedIn = us.body!;
    });
  }

  clickUserName(user: IUser): void {
    this.sharedChatService.callClickName(user);
  }

  onRowSelect(event: any): void {
    console.log(event);
    this.sharedChatService.callClickName(event.user);
  }

  onRowUnselect(event: any): void {
    console.log(event);
  }

}
