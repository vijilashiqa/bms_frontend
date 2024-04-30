import { Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SelectService, S_Service } from '../../_service/indexService';
@Component({
  selector: 'allownas',
  templateUrl: './allow-nas.component.html'
})

export class AllowNasComponent implements OnInit {
  @ViewChild('multiSelect') multiSelect;
  public loadContent: boolean = false;
  submit: boolean = false; AddNasForm; groups; id; editgroups;
  grup; resell; serv; alnas; nassettings; config;
  constructor(
    private alert: ToasterService,
    private router: Router,
    private service: S_Service,
    private select: SelectService

  ) { this.id = JSON.parse(localStorage.getItem('array')); }

  async ngOnInit() {
    this.createForm();
    await this.group();
    await this.edit();
  }

  async group() {
    // this.select.showGroupName({}).subscribe(res=>{
    //   this.grup=res;
    //   // console.log(this.grup)
    // });
  }

  listresell() {
    // this.select.showgr({group_id:this.AddNasForm.value['group']}).subscribe(res=>{
    //   this.resell=res;
    //   // console.log(this.resell)
    // });
  }

  nas() {
    // this.select.showgn({group_id:this.AddNasForm.value['group']}).subscribe(result=>{
    //   this.alnas=result;
    //   // console.log(this.alnas)
    // });
  }

  listservice() {
    // this.select.showgs({nas_id:this.AddNasForm.value['pri_nas']}).subscribe(res=>{
    //   this.serv=res;
    //   // console.log(this.serv)
    // })
  }

  checkAll(checked) {
    this.serv.forEach(x => x.state = checked)
  }

  addNas() {

    // console.log(this.AddNasForm.value)
    if (this.AddNasForm.invalid) {
      this.submit = true;
      return;
    }
    let checkedList = this.serv.filter(item => item.state == true);
    // console.log(checkedList)
    let method = 'addalwnas';
    if (this.id) {
      method = 'editalwnas';
      this.AddNasForm.value['id'] = this.id;
    }
    this.service[method]({
      grup: this.AddNasForm.value['group'],
      prim_nas: this.AddNasForm.value['pri_nas'],
      sec_nas: this.AddNasForm.value['sec_nas'],
      allowedser: checkedList
    }).subscribe(result => {
      this.groups = result;
      const toast: Toast = {
        type: result['status'] == 1 ? 'success' : 'warning',
        title: result['status'] == 1 ? 'Success' : 'Failure',
        body: result['msg'],
        timeout: 5000,
        showCloseButton: true,
        bodyOutputType: BodyOutputType.TrustedHtml,
      };
      this.alert.popAsync(toast);
      if (result['status'] == 1) {
        this.router.navigate(['/pages/service/list-alwnas'])
      }
    });
  }

  async edit() {
    let result = await this.service.geteditalwnas({ id: this.id })
    if (result) {
      this.editgroups = result;
      // console.log(this.editgroups) 
    }
    this.createForm();
    this.listresell();
    this.nas();
    this.listservice();
  }



  createForm() {
    this.AddNasForm = new FormGroup({
      group: new FormControl(this.editgroups ? this.editgroups['grup'] : ''),
      pri_nas: new FormControl(this.editgroups ? this.editgroups['prim_nas'] : ''),
      sec_nas: new FormControl(this.editgroups ? this.editgroups['sec_nas'] : ''),
    });
  }
}