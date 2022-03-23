
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IIdea } from 'app/entities/idea/idea.model';
import { IdeaService } from 'app/entities/idea/service/idea.service';
import { IUser } from 'app/entities/user/user.model';
import { GeneralService } from 'app/general.service';
import dayjs from 'dayjs';

@Component({
  selector: 'jhi-successfull',
  templateUrl: './successfull.component.html',
  styleUrls: ['./successfull.component.scss']
})
export class SuccessfullComponent implements OnInit {

  type: string;
  id: number;
  datatransTrxId: string;
  user: IUser;
  refNo: string;
  idea: IIdea;


  constructor(
    private route: ActivatedRoute,
    private generalService: GeneralService,
    protected router: Router,
    private ideaService: IdeaService,
  ) { }

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.route.queryParams.subscribe(params => {
        this.datatransTrxId = params['datatransTrxId'];
        this.type = this.route.snapshot.params.type;
        this.id = this.route.snapshot.params.id;
        this.refNo = this.route.snapshot.params.refNo;
        this.router.navigate(['/ideas/' + this.id + '/donation'], { queryParams: { txId: this.datatransTrxId, refNo: this.refNo } });
      });
    });
  }

}
