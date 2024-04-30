import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../_service/indexService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'topup',
  templateUrl: './topup.component.html',
})

export class TopupComponent implements OnInit {
  submit: boolean = false; TopupForm; datas; id; modalHeader; config;
  item; data; condition;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private activeModal: NgbActiveModal,
    private alert: ToasterService,
    private payser: PaymentService,
    private router: Router,
  ) { }

  closeModal() {
    this.activeModal.close();
    // this.router.navigate(['/pages/cust/viewcust'])
  }

  async ngOnInit() {
    await this.createForm();
  }

  async addPay() {
    console.log(this.TopupForm.value['amt'])
    if (this.TopupForm.invalid) {
      window.alert('Please Enter amount Greater than or equal to 2000')
      return;
    }
    this.loading = true;
    if (this.item['res_flag'] == 1) {
      this.TopupForm.value['pay_type'] = 1;
    }
    if (this.item['subs_flag'] == 2) {
      this.TopupForm.value['pay_type'] = 3;
    }
    // console.log('Value', this.TopupForm.value)
    let res = await this.payser.payment(this.TopupForm.value);
    console.log('Response--', res);

    res = JSON.parse(res);
    console.log('Response-----------', res);

    if (res['error_msg'] == 0) {

      // let header = new HttpHeaders();
      // header = header.set('Content-Text', 'text/html');
      // header = header.append('Authorization', 'y8tNAC1Ar0Sd8xAHGjZ817UGto5jt37zLJSX/NHK3ok=')

      const div = document.createElement('div');
      div.innerHTML = res['ldata'];
      while (div.children.length > 0) {
        document.body.appendChild(div.children[0])
      }
      const form: any = document.getElementById("f1");
      form.submit()

      if (res) {
        this.loading = false
      }
    } else {
      this.loading = false;
      console.log('Error Msg.', res);
      const toast: Toast = {
        type: res['error_msg'] == 0 ? 'success' : 'warning',
        title: res['error_msg'] == 0 ? 'Success' : 'Failure',
        body: res['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      // console.log('Toast', toast)
      window.alert(toast.body);
      // this.alert.popAsync(toast);
    }
    // setTimeout(() => {
    //    this.paysucess()
    // }, 65000);

    // if (res['error_msg'] == 0 && res['gwtype'] == 2) {
    //   console.log(res['ldata']);
    //   document.location.href = res['ldata'];

    //  } 

  } 

  async paysucess() {
    let sucres = await this.payser.paysuccess({});
    // console.log(sucres);

  }



  createForm() {
    this.TopupForm = new FormGroup({
      amt: new FormControl('', Validators.required),
      // pay_mode : new FormControl('1',Validators.required),
      trnRemarks: new FormControl(''),
    });
  }

  onNavigate() {
    window.open("http://www.bluelotusservices.com/terms.php#Terms", "_blank");
  }
}