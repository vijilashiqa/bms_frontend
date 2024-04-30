import { Component,OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl,FormGroup,Validators } from '@angular/forms';
import { SelectService,S_Service,NasService } from '../../_service/indexService';

@Component({
	selector : 'dynamicAdd',
	templateUrl: './dynamicadd.component.html'
})

export class dynamicAddComponent implements OnInit{
	submit:boolean=false;dynamicForm;hr=[];minsec=[];pack;grup;busname;
  item;datas;service;modalHeader;
	constructor(
    private ser : S_Service,
	 	private activeModal: NgbActiveModal,
	 	private alert: ToasterService,
     private nas : NasService,
     private select : SelectService
	) {  }

  closeModal() {
    this.activeModal.close();
  }

  group() {
    // this.select.showBusGroup({ business_id: this.dynamicForm.value['bus_name'] }).subscribe(res => {
    //   this.grup = res;
    //   console.log(res)
    // })
  }

  business() {
    // this.select.showBusName({}).subscribe(result => {
    //   this.busname = result;
    //   console.log(result)
    // })
  }
  
  busservice(){
    // this.select.showBusSer({isp_id:this.dynamicForm.value['bus_name']}).subscribe(res =>{
    //   this.pack = res;
    //   console.log(res)
    // });
    
  }

  burst(){
    if(this.dynamicForm.value['enable']==false){
      this.dynamicForm.controls.Limit.setValue('')
      this.dynamicForm.controls.Limit1.setValue('')
      this.dynamicForm.controls.Treshold.setValue('')
      this.dynamicForm.controls.Treshold1.setValue('')
      this.dynamicForm.controls.Time.setValue('')
      this.dynamicForm.controls.Time1.setValue('')
    }
  }

  grupser(){
    if(this.dynamicForm.value['group_name']!=''){
      // this.select.showBusGrpSer({isp_id:this.dynamicForm.value['bus_name'],group_id:this.dynamicForm.value['group_name']}).subscribe(result=>{
      //   this.pack=result;
      //   console.log(result)
      // })
    }
    
  }

  AddDyn(){
    // console.log(this.item)
    // this.submit = true;
    // console.log(this.dynamicForm.value)
    // if(this.dynamicForm.invalid){
    //   return;
    // }
    //    let method = 'insertDynSer';
    // if(this.item){
    //   method = 'updateDynSer';
    //   this.dynamicForm.value['id']=this.item['id'];
    //   console.log(this.dynamicForm.value['id'])
    // }
    // this.ser[method](this.dynamicForm.value).subscribe(result=>{
    //   this.datas=result;
    //     console.log(result.msg.msg)
    //     const toast: Toast = {
    //     type: result.msg.status == 1 ? 'success':'warning',
    //     title: result.msg.status == 1 ? 'Success':'Failure',
    //     body: result.msg.msg,
    //     timeout: 5000,
    //     showCloseButton: true,
    //     bodyOutputType: BodyOutputType.TrustedHtml,
    //   };
    //   this.alert.popAsync(toast);
    //   if(result.msg.status == 1)
    //       this.closeModal();
    // });
  }

  ngOnInit(){
    this.createForm();
    this.business();
   if(this.item){
    this.busservice();
    this.grupser();
   }
  }

   createForm(){
    this.dynamicForm=new FormGroup({
      bus_name: new FormControl(this.item? this.item['isp_id']:''),
      group_name: new FormControl(this.item ? this.item['group_id']:''),
      pack:new FormControl(this.item ? this.item['srvid']:'',Validators.required),
      shr:new FormControl(this.item ? this.item['starttime']:''),
      ehr:new FormControl(this.item ? this.item['endtime']:''),
      enable:new FormControl(this.item ? this.item['enableburst']:false),
      mon:new FormControl(this.item ? this.item['mon']:true),
      tue:new FormControl(this.item ? this.item['tue']:true),
      wed:new FormControl(this.item ? this.item['wed']:true),
      thur:new FormControl(this.item ? this.item['thu']:true),
      fri:new FormControl(this.item ? this.item['fri']:true),
      sat:new FormControl(this.item ? this.item['sat']:true),
      sun:new FormControl(this.item ? this.item['sun']:true),
      Limit:new FormControl(this.item ? this.item['dlburstlimit']:'',Validators.pattern('^[0-9]*$')),
      Limit1:new FormControl(this.item ? this.item['ulburstlimit']:'',Validators.pattern('^[0-9]*$')),
      Treshold:new FormControl(this.item ? this.item['dlburstthreshold']:'',Validators.pattern('^[0-9]*$')),
      Treshold1:new FormControl(this.item ? this.item['ulburstthreshold']:'',Validators.pattern('^[0-9]*$')),
      Time:new FormControl(this.item ? this.item['dlbursttime']:'',Validators.pattern('^[0-9]*$')),
      Time1:new FormControl(this.item ? this.item['ulbursttime']:'',Validators.pattern('^[0-9]*$')),
      dlrate:new FormControl(this.item ? this.item['dlrate']:'',[Validators.required,Validators.pattern('^[0-9]*$')]),
      ulrate:new FormControl(this.item ? this.item['ulrate']:'',[Validators.required,Validators.pattern('^[0-9]*$')]),
      priority:new FormControl(this.item ? this.item['priority']:'',[Validators.required,Validators.pattern('^[0-8]{1}$')])
    });
  }
 }