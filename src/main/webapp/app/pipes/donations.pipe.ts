import { Pipe, PipeTransform } from '@angular/core';
import { IIdea } from 'app/entities/idea/idea.model';
import { GeneralService } from 'app/general.service';

@Pipe({
  name: 'donations'
})
export class DonationsPipe implements PipeTransform {

  constructor(private generalService: GeneralService,) {}

  transform(ideaId: number, args?: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.generalService.queryIdeaByActiveTrueEagerAll(ideaId).subscribe(epo => {
        let total = 0;
        epo.body.donations.forEach(element => {
          total += element.amount;
        });
        resolve(total);
      });
    })
  }

}
