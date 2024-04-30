import { Component, OnInit } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { BusinessService, ComplaintService, ResellerService, RoleService, S_Service } from '../../_service/indexService';

@Component({
  selector: 'addcomptype',
  templateUrl: './add-comptype.component.html'
})

export class AddComplaintTypeComponent implements OnInit {
  submit: boolean = false; AddComptypeForm; groups; id: any[]; editdatas; busname; profile; resell;
  config;compType=[];
  constructor(
    private alert: ToasterService,
    private service: ComplaintService,
    private busser: BusinessService,
    private reselser: ResellerService,
    public role: RoleService,
    private router: Router,
    private aRoute : ActivatedRoute
  ) { }

  async ngOnInit() {
    this.createForm();
    this.aRoute.queryParams.subscribe(param => {
      this.id = param.id || null
    });
    if (this.id) {
      await this.edit();
    }
    await this.main();
  }

  async main(){
    await this.business();
    if (this.role.getroleid() <= 777) {
      this.AddComptypeForm.get('bus_id').setValue(this.role.getispid());
      await this.showProfileReseller();
    }
    if(this.role.getroleid()<775){
      this.AddComptypeForm.get('Role').setValue(this.role.getroleid());
      this.AddComptypeForm.get('reseller').setValue(this.role.getresellerid());
    }
  }

  async business() {
    this.busname = await this.busser.showBusName({})
  }

  async showProfileReseller($event = '') {
    this.profile = await this.reselser.showProfileReseller({ bus_id: this.AddComptypeForm.value['bus_id'], like: $event })
    // console.log("prof:", this.profile)
  }

  async showResellerName($event = '') {
    // console.log('inside', this)
    this.resell = await this.reselser.showResellerName({ bus_id: this.AddComptypeForm.value['bus_id'],role: this.AddComptypeForm.value['Role'], like: $event })
    // console.log("resname",this.resell)
  }


  async addcomptype() {
    if (this.AddComptypeForm.invalid) {
      this.submit = true;
      return;
    }
    // console.log("inside", this.AddComptypeForm.value);
    let method = 'addComplType';
    if (this.id) {
      method = 'editComplType';
      this.AddComptypeForm.value['id'] = this.id;
    }
    let comptypedata = [this.AddComptypeForm.value];
    let result = await this.service[method]({ compType: comptypedata });
    // console.log(result);
    const toast: Toast = {
      type: result[0]['error_msg'] == 0 ? 'success' : 'warning',
      title: result[0]['error_msg'] == 0 ? 'Success' : 'Failure',
      body: result[0]['msg'],
      timeout: 3000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };
    this.alert.popAsync(toast);
    if (result[0]['error_msg'] == 0) {
      this.router.navigate(['/pages/complaint/list-comptype'])
    }
  }

  async edit() {
    let result = await this.service.getEditComplType({ id: this.id })
    // console.log("getedit",result);
    if(result){
      this.editdatas = result[0];
    }
    await this.createForm();
    await this.showProfileReseller();
    await this.showResellerName();
  }

  createForm() {
    this.AddComptypeForm = new FormGroup({
      bus_id: new FormControl(this.editdatas ? this.editdatas['isp_id'] :'',Validators.required),
      Role: new FormControl(this.editdatas ? this.editdatas['role']:'',Validators.required),
      reseller: new FormControl(this.editdatas ? this.editdatas['reseller_id'] : '', Validators.required),
      comp_type: new FormControl(this.editdatas ? this.editdatas['comp_type'] : '', Validators.required),
      status : new FormControl(this.editdatas ? this.editdatas['status']==1 ? true : false:true ),
      descp: new FormControl(this.editdatas ? this.editdatas['descr'] : '')
    });
  }
}