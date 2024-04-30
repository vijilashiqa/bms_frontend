import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {EnquiryService , S_Service} from '../../_service/indexService';

@Component({
	selector : 'enquiry',
	templateUrl: './add_enquiry.component.html',
  styleUrls:['./custstyle.scss'],
})

export class AddEnquiryComponent implements OnInit{
	submit:boolean=false;AddEnquiryForm;resell;pack;datas;file;
   grup;id:any[];editdatas;
  change :boolean;
	constructor(
	 	private alert: ToasterService,
    private router: Router,
    private enq:EnquiryService,
    private nas:S_Service
  ) {this.id=JSON.parse(localStorage.getItem('array'));}

  async showReseller(){
      let res = await  this.nas.showReseller()
        this.resell=res;
        // console.log(res)
    }
    // showLoc(){
    //   this.enq.showLoc().subscribe(res=>{
    //     this.file=res;
    //   });
    // }

 addNas(){
    console.log(this.AddEnquiryForm.value)
    if(this.AddEnquiryForm.invalid){
      this.submit=true;
      return;
    }
    let method = 'AddEnquiry';
    if(this.id){
      method='editEnquiry';
      this.AddEnquiryForm.value['id']=this.id;
    }
    this.enq[method](this.AddEnquiryForm.value).subscribe(result=>{
      this.datas=result;
      console.log(result)
      const toast: Toast = {
        type: result['status'] == 1 ?'success':'warning',
        title: result['status'] == 1 ?'Success':'Failure',
        body: result['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if(result['status'] == 1){
        this.router.navigate(['/pages/enquiry/list_enquiry'])
      }
    });
  }
  
  ngOnInit(){
	  this.createForm();
    this.showReseller();
    this.edit();
    // this.showLoc();
  }

  edit(){
  this.enq.GetEditEnquiry({id:this.id}).subscribe(result=>{
    if(result){
      this.editdatas=result;
      console.log(result)
    }
    this.createForm();
  });
}
  cancel(){
    this.router.navigate(['/pages/enquiry/list_enquiry']);

  }
  createForm(){
  	this.AddEnquiryForm=new FormGroup({
      reseller_name:new FormControl(this.editdatas?parseInt(this.editdatas['reseller_name']):'',Validators.required),
      branch :new FormControl(this.editdatas?this.editdatas['branch']:'',Validators.required),
      area :new FormControl(this.editdatas?this.editdatas['area']:'',Validators.required),
      assign_emp :new FormControl(this.editdatas?this.editdatas['assign_emp']:'',Validators.required),
      cust_name:new FormControl(this.editdatas?this.editdatas['cust_name']:'',Validators.required),
      enq_status:new FormControl(this.editdatas?this.editdatas['status']:'',Validators.required),
      enq_lead:new FormControl(this.editdatas?this.editdatas['lead']:'',Validators.required),
      enq_address:new FormControl(this.editdatas?this.editdatas['address']:'',Validators.required),
      enq_mobnum:new FormControl(this.editdatas?this.editdatas['mobnum']:'',Validators.required),
      enq_mail:new FormControl(this.editdatas?this.editdatas['mail']:'',Validators.required),
      enq_loc:new FormControl(this.editdatas?parseInt(this.editdatas['loc']):'',Validators.required),
      notes:new FormControl(this.editdatas?this.editdatas['descr']:'',Validators.required),
    });
  }
}