import { Component, OnInit,AfterViewChecked,ChangeDetectorRef} from '@angular/core';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { S_Service,OperationService } from '../../_service/indexService';
import { AddSuccessComponent } from './../success/add-success.component';
import { ngxLoadingAnimationTypes } from 'ngx-loading';

@Component({
  selector: 'ngx-topuprenewal',
  templateUrl: './topuprenewal.component.html',
  styleUrls: ['./topuprenewal.component.scss']
})
export class TopuprenewalComponent implements OnInit , AfterViewChecked{
  submit: boolean = false; modalHeader; item; TopupForm; pack; packitem;
  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private activeModal: NgbActiveModal,
    private activemodal: NgbModal,
    private packservice: S_Service,
    private opservice: OperationService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  closeModal() {
    this.activeModal.close(true);
  }


  async ngOnInit() {
    console.log('item---', this.item);
    this.showTopup();
    await this.createForm();
  }

  async showTopup($event = '') {
    this.pack = await this.packservice.showTopup({ like: $event, resel_id: this.item.resel_id })
    console.log('Topup plan----', this.pack);

  }

  showPlanDetail() {
    [this.packitem] = this.pack.filter(x => x.top_id == this.TopupForm.value['topup_id']);
    console.log('resp---', this.packitem);
    this.paidamount()
  }

  async topup() {
    this.submit = true;
    this.loading = true;
    if (this.TopupForm.invalid) {
      window.alert('Please fill mandatory fields');
      return;
    }
    this.TopupForm.value['cust_id'] = this.item['cust_id'];
    const result = await this.opservice.topup(this.TopupForm.value).toPromise();
    if(result){
      this.loading = false;
      this.result_pop(result)
      if(result[0]['error_msg'] == 0) this.closeModal();
    }

  }

  paidamount() {
    if (this.TopupForm.value['pay_status'] == 2) this.TopupForm.get('pay_amt').setValue(this.packitem['price']);
    else this.TopupForm.get('pay_amt').setValue('');
  }


  result_pop(item) {
    const activemodal = this.activemodal.open(AddSuccessComponent, { size: 'lg', container: 'nb-layout' });
    activemodal.componentInstance.modalHeader = 'Result';
    activemodal.componentInstance.item = item;
    activemodal.result.then((data) => {
    });
  }

  setPayValid(){
    if(this.TopupForm.value['pay_status'] == 2){
      this.TopupForm.get('pay_amt').setValidators(Validators.required);
      this.TopupForm.get('pay_date').setValidators(Validators.required);
    }else{
      this.TopupForm.get('pay_amt').clearValidators();
      this.TopupForm.get('pay_amt').updateValueAndValidity();

      this.TopupForm.get('pay_date').clearValidators();
      this.TopupForm.get('pay_date').updateValueAndValidity();

    }
  }


  createForm() {
    this.TopupForm = new FormGroup({
      topup_id: new FormControl('', Validators.required),
      pay_status: new FormControl('1', Validators.required),
      pay_amt: new FormControl(''),
      pay_date: new FormControl(''),
      comment: new FormControl('', Validators.required)

    });
  }

}
