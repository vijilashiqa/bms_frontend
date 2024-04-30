import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'depositpayment_report',
	templateUrl: './depositpayment_report.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class DepositPaymentReportComponent implements OnInit{
	submit:boolean=false;ReportsForm;addNas;
	constructor(
	 	private alert: ToasterService,
    private router: Router
	) {}
  ngOnInit(){
	  this.createForm();
  }
  

  createForm(){
  	this.ReportsForm=new FormGroup({
  		dep_reseller:new FormControl(''),
      User_Name:new FormControl(''),
      pay_status:new FormControl(''),
      gateway_name:new FormControl(''),
      start_date:new FormControl(''),
      end_date:new FormControl(''),
      substart_date:new FormControl(''),
      subend_date:new FormControl(''),
      transc_id:new FormControl(''),
      pay_id:new FormControl(''),

      
  	});
  }
}