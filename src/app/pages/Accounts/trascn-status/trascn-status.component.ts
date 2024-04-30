import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { Router } from '@angular/router';
import { RoleService, PaymentService } from '../../_service/indexService';

@Component({
   selector: 'trascn-status',
   templateUrl: './trascn-status.component.html',
})

export class TransactionStatusComponent implements OnInit {
   config; queryparams; msg; status; orderid; txnid;


   constructor(
      private router: Router,
      private alert: ToasterService,
      public role: RoleService,
      public payser: PaymentService,

   ) {
      let URL = this.router.url;
      // console.log("url",URL);
      let URL_AS_LIST = URL.split('/')
      this.queryparams = URL_AS_LIST[3].split('?')[1].split('&');
      // console.log('QUERY PARAMS', this.queryparams);
      var pair = null,
         data = [];

      this.queryparams.forEach(function (d) {
         pair = d.split('=');
         data.push({ key: pair[0], value: pair[1] });

      });
      // console.log('Data', data,'Data 1',data[0],data[0].value)

      this.status = data[0].value
      if (data.length == 4) {
         let msg = data[1].value.split('%20')
         this.msg = msg.join(' ');
         this.txnid = data[2].value
         this.orderid = data[3].value
      }
      if (data.length == 3) {
         this.msg = data[1].value
         this.orderid = data[2].value
      }
   }

   async ngOnInit() {
      setTimeout(() => {
         this.router.navigate(['/pages/iot-dashboard'])
      }, 5000)
   }

   redirect() {
      this.router.navigate(['/pages/iot-dashboard'])

   }
}