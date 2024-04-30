import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({ 
	selector : 'OnlineCustomer',
	templateUrl: './onlinecust.component.html',
  styleUrls:['./custstyle.scss'],
})

export class OnlineCustomerComponent implements OnInit{
	submit:boolean=false;SubsonlineForm;
	constructor(
	 	private alert: ToasterService,
    private router: Router
	) { }

  subsOnline(){
    // console.log(this.SubsonlineForm.value["checkbox2"])
  }
  
  ngOnInit(){
	  this.createForm();
  }
  cancel(){
    this.createForm();

  }
  

  createForm(){
  	this.SubsonlineForm=new FormGroup({
  		Name:new FormControl(''),
      Reason :new FormControl(''),
      Deposit :new FormControl(''),
      Description :new FormControl(''),
     Allow:new FormControl(''),
  		

  	});
  }
}