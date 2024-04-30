import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'ResellerPaymentReport',
	templateUrl: './resellerpaymentreport.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class ResellerPaymentReportComponent implements OnInit{
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
  		selectreseller:new FormControl(''),
      Payment:new FormControl(''),
      payment_from:new FormControl(''),
      payment_to:new FormControl(''),
      
  	});
  }
}