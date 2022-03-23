import { Component, OnInit } from '@angular/core';
import { Properties } from 'app/entities/properties/properties.model';
import { PropertiesService } from 'app/entities/properties/service/properties.service';
import { GeneralService } from 'app/general.service';

@Component({
  selector: 'jhi-base_rate',
  templateUrl: './base_rate.component.html',
  styleUrls: ['./base_rate.component.scss']
})
export class BaseRateComponent implements OnInit {

  baseRate: number;

  constructor(private generalService: GeneralService, private propertiesService: PropertiesService) { }

  ngOnInit() {
    this.generalService.getPropertiesByKey('base_rate').subscribe(res => {
      const prop: Properties = res.body;
      this.baseRate = Number(prop.value);
    });
  }

}
