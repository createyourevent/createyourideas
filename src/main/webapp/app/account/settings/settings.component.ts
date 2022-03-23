import { Component, OnInit } from "@angular/core";
import { Validators, FormBuilder } from "@angular/forms";
import { LANGUAGES } from "app/config/language.constants";
import { ADDRESS_REGEX } from "app/constants";
import { GeneralService } from "app/general.service";
import { IUser } from 'app/entities/user/user.model';
import { ibanValidator } from "ngx-iban";



@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  success = false;
  languages = LANGUAGES;
  formatedAddress = '';
  user!: IUser;

  settingsForm = this.fb.group({
    address: [
      undefined,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.pattern(ADDRESS_REGEX)
      ]
    ],
    phone: [undefined, [Validators.required]],
    iban: [undefined, [Validators.required, ibanValidator()]],
    bankname: [undefined, [Validators.required]],
    bankaddress: [
      undefined,
      [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
        Validators.pattern(ADDRESS_REGEX)
      ]
    ],
  });

  constructor(
    private fb: FormBuilder,
    private generalService: GeneralService,
  ) {}

  ngOnInit(): void {
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body;
      this.generalService.findWidthAuthoritiesWidthId(this.user.id).subscribe(r => {
        this.user = r.body;
        if (this.user) {
          this.settingsForm.patchValue({
            address: this.user.address,
            phone: this.user.phone,
            iban: this.user.iban,
            bankname: this.user.bankname,
            bankaddress: this.user.bankaddress
          });
        }
      });
    });
  }

  public addressChange(address: any): void {
    this.settingsForm.patchValue({ address: address.formatted_address });
  }

  public bankaddressChange(address: any): void {
    this.settingsForm.patchValue({ bankaddress: address.formatted_address });
  }

  save(): void {
    this.success = false;
    this.generalService.findWidthAuthorities().subscribe(usr => {
      const user = usr.body!;
      user.address = this.settingsForm.get('address')!.value;
      user.phone = this.settingsForm.get('phone')!.value;
      user.iban = this.settingsForm.get('iban')!.value;
      user.bankname = this.settingsForm.get('bankname')!.value;
      user.bankaddress = this.settingsForm.get('bankaddress')!.value;
      this.generalService.updateAddressAndPhoneAndIBanAndBanknameAndBankaddressFromUser(user.id, user.address, user.phone, user.iban, user.bankname, user.bankaddress).subscribe(() => {
        this.success = true;
      });
    });
  }
}
