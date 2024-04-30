import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import {EnquiryService} from '../../_service/indexService';


@Component({
  selector: 'list_enquiry',
  templateUrl: './list_enquiry.component.html',
})
export class ListEnquiryComponent implements OnInit {
 data;page:any=1;totalpage=10;pages=[1,2,3,4,5];search;reseller_name;loc;bus_loc;cust_name;
  constructor(
    private router : Router,
    private enq:EnquiryService,
    private alert: ToasterService,

  ) {}

   ngOnInit(){
    localStorage.removeItem('array');
    this.list();
  }
  list(){
    this.enq.ListEnquiry({}).subscribe(result=>{
      this.data=result;
      console.log(result)
    });

  }
 Edit_User(item){
    localStorage.setItem('array', JSON.stringify(item));    
    this.router.navigate(['/pages/enquiry/edit_enquiry'])
  }
  
}