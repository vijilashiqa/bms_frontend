import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector : 'ConnectiondataReports',
	templateUrl: './connectiondata.component.html',
  // styleUrls:['./custstyle.scss'],
})

export class ConnectionDataComponent implements OnInit{
	submit:boolean=false;ReportsForm;hr=[];minsec=[];
	constructor(
	 	private alert: ToasterService,
    private router: Router
	) {
     this.hr=[
          {value:'00'},
          {value:'01'},
          {value:'02'},
          {value:'03'},
          {value:'04'},
          {value:'05'},
          {value:'06'},
          {value:'07'},
          {value:'08'},
          {value:'09'},
          {value:'11'},
          {value:'12'},
          {value:'13'},
          {value:'14'},
          {value:'15'},
          {value:'16'},
          {value:'17'},
          {value:'18'},
          {value:'19'},
          {value:'20'},
          {value:'21'},
          {value:'22'},
          {value:'23'},
      ];
      this.minsec=[
          {value:'00'},
          {value:'01'},
          {value:'02'},
          {value:'03'},
          {value:'04'},
          {value:'05'},
          {value:'06'},
          {value:'07'},
          {value:'08'},
          {value:'09'},
          {value:'11'},
          {value:'12'},
          {value:'13'},
          {value:'14'},
          {value:'15'},
          {value:'16'},
          {value:'17'},
          {value:'18'},
          {value:'19'},
          {value:'20'},
          {value:'21'},
          {value:'22'},
          {value:'23'},
          {value:'24'},
          {value:'25'},
          {value:'26'},
          {value:'27'},
          {value:'28'},
          {value:'29'},
          {value:'30'},
          {value:'31'},
          {value:'32'},
          {value:'33'},
          {value:'34'},
          {value:'35'},
          {value:'36'},
          {value:'37'},
          {value:'38'},
          {value:'39'},
          {value:'40'},
          {value:'41'},
          {value:'42'},
          {value:'43'},
          {value:'44'},
          {value:'45'},
          {value:'46'},
          {value:'47'},
          {value:'48'},
          {value:'49'},
          {value:'50'},
          {value:'51'},
          {value:'52'},
          {value:'53'},
          {value:'54'},
          {value:'55'},
          {value:'56'},
          {value:'57'},
          {value:'58'},
          {value:'59'}
      ];
    }

   

  addNas(){
    console.log(this.ReportsForm.value["checkbox2"])
  }
  
  ngOnInit(){
	  this.createForm();
  }
  

  createForm(){
  	this.ReportsForm=new FormGroup({
  		UserName:new FormControl(''),
      Protocol :new FormControl(''),
      Port:new FormControl(''),
      Source:new FormControl(''),
      Destination:new FormControl(''),
      Port1:new FormControl(''),
      FromDate:new FormControl(''),
      FromTime:new FormControl('00'),
      second:new FormControl('00'),
      ToDate:new FormControl(''),
      ToTime:new FormControl('00'),
      second1:new FormControl('00'),
      ID:new FormControl(''),

  	});
  }
}