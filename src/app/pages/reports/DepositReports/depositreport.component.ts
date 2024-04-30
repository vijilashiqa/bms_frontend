import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'DepositReports',
	templateUrl: './depositreport.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class DepositReportsComponent implements OnInit{
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
  		Reseller_name:new FormControl(''),
      Depositer:new FormControl(''),
      Deposit_to:new FormControl(''),
      Deposit_from:new FormControl(''),
      reason:new FormControl(''),
      
  	});
  }
}