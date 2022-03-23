import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  type: string;
  id: number;
  datatransTrxId: string;
  user: IUser;


  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService,
    protected router: Router,
  ) { }

  ngOnInit(): void {
  }

}
