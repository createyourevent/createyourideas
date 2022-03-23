import { Component, EventEmitter, Input, OnInit, Output, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JhiLanguageService } from 'ng-jhipster';
import { GeneralService } from 'app/general.service';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'jhi-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  providers: [MessageService]
})
export class PaymentComponent implements OnInit, OnChanges {


  @Input() value = 0;
  @Output() successEvent = new EventEmitter<any>();
  @Input() type = '';
  @Input() id = -1;

  transactionId: string;
  datatransTrxId: string;


  constructor(private fb: FormBuilder,
              private messageService: MessageService,
              private http: HttpClient,
              private translate: TranslateService,
              private generalService: GeneralService,
              private route: ActivatedRoute) { }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] !== undefined && changes['value'].currentValue !== undefined) {
      this.value = changes['value'].currentValue;
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.datatransTrxId = params['datatransTrxId'];
      if(this.datatransTrxId) {
        this.generalService.getStatusFromTransactionIdFromDatatrans(this.datatransTrxId).subscribe(res => {
          const z = res.body;
          if(z.status === "authorized" || z.status === "settled") {
            this.successEvent.emit(z);
          }
        });
      }
    });
  }

  onLoaded(e: any): void {
    console.log('OnLoaded');
  }
  onOpened(e: any): void {
    console.log('OnOpened');
  }
  onCancelled(e: any): void {
    console.log('OnCancelled');
  }
  onError(e: any): void {
    console.log('OnError');
  }
}
