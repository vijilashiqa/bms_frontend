import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustService,RoleService } from '../../_service/indexService';

@Component({
   selector: 'otp',
   templateUrl: './add-otp.component.html'
})

export class OTPComponent implements OnInit {
   submit: boolean = false; item; modalHeader; otp_num = '';config;
   constructor(
      private alert: ToasterService,
      private custser: CustService,
      private router: Router,
      public activeModal: NgbActiveModal,
      public role : RoleService,

   ) { }

   closeModal() {
      // console.log(this.item)
      this.activeModal.close(true);
   }

   async otpsubmit(flag) {
      if(this.otp_num == ''){
         window.alert('Please Enter OTP to verify');
         return;
      }
      if (this.item['mobflag'] == 1 && this.role.getroleid()==111) {
         let res = await this.custser.mobileverify({ flag: flag, mobileotp: this.otp_num });
         // console.log(res);
         if (res) {
            const toast: Toast = {
               type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
               title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
               body: res[0]['msg'],
               timeout: 4000,
               showCloseButton: true,
               bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.alert.popAsync(toast);
            if(res[0]['error_msg'] == 0) this.activeModal.close(true);

         }
      }
      if(this.item['mobflag'] == 1 && this.role.getroleid()!=111){
         let res = await this.custser.mobileverify({ flag: flag, mobileotp: this.otp_num,uid:this.item['custid'] });
         // console.log(res);
         if (res) {
            const toast: Toast = {
               type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
               title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
               body: res[0]['msg'],
               timeout: 4000,
               showCloseButton: true,
               bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.alert.popAsync(toast);
            if(res[0]['error_msg'] == 0) this.activeModal.close(true);
         }
      }
      if (this.item['mailflag'] == 2 && this.role.getroleid()==111) {
         let res = await this.custser.emailverify({ flag: flag, emailotp: this.otp_num });
         // console.log(res);
         if (res) {
            const toast: Toast = {
               type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
               title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
               body: res[0]['msg'],
               timeout: 4000,
               showCloseButton: true,
               bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.alert.popAsync(toast);
            if(res[0]['error_msg'] == 0) this.activeModal.close(true);
         }
      }
      if(this.item['mailflag'] == 2 && this.role.getroleid()!=111){
         let res = await this.custser.emailverify({ flag: flag, emailotp: this.otp_num,uid:this.item['custid'] });
         // console.log(res);
         if (res) {
            const toast: Toast = {
               type: res[0]['error_msg'] == 0 ? 'success' : 'warning',
               title: res[0]['error_msg'] == 0 ? 'Success' : 'Failure',
               body: res[0]['msg'],
               timeout: 4000,
               showCloseButton: true,
               bodyOutputType: BodyOutputType.TrustedHtml,
            };
            this.alert.popAsync(toast);
            if(res[0]['error_msg'] == 0) this.activeModal.close(true);
         }
      }

   }

   ngOnInit() {

   }
}

