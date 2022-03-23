import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';
import { HttpHeaders } from '@angular/common/http';
import { GeneralService } from 'app/general.service';

@Pipe({
  name: 'transactionId'
})
export class TransactionIdPipe implements PipeTransform {

  msgBackend: string;

  constructor(private http: HttpClient, private languageService: JhiLanguageService, private generalService: GeneralService) {}

  transform(value: any, type: string, id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const b = this.genround(value, 0.05);
      const a = this.genround(b * 100, 0.05);
      this.generalService.getTransactionIdFromDatatrans(a, type, id).subscribe(res => {
        const z = res.body;
        resolve(z.transactionId);
      });
    });
  }

  genround(amt: number, prec: number): number {
    var rndd = Number((Math.round(amt / prec) * prec).toFixed(2));
    return rndd ;
  }

}
