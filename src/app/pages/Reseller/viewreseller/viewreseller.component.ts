import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PasswordComponent } from '../Password/profilepass.component';
import { UsernameComponent } from '../username/username.component';
import { ResellerService, RoleService, S_Service } from '../../_service/indexService';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from 'ngx-loading';
import { EditNasComponent } from '../editnas/editnas.component';

@Component({
  selector: 'viewreseller',
  templateUrl: './viewreseller.component.html',
  styleUrls: ['./viewreseller.component.scss'],
})

export class ViewResellerComponent implements OnInit {
  data: any = []; page: any = 1; totalpage = 10; pages = [1, 2, 3, 4, 5]; datas;srvdata;subplandata;
  listflag;config;
  businessinfodata: boolean = false; agrmntdata: boolean = false; settingdata: boolean = false;
  business; settings; agreement; branchdata; branches: boolean = false;

  public ngxLoadingAnimationTypes = ngxLoadingAnimationTypes; servtype; custname;
  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  public loading = false;

  constructor(
    private router: Router,
    private nasmodel: NgbModal,
    private ser: ResellerService,
    private planser : S_Service,
    public role : RoleService,
    // private activeModal: NgbActiveModal,

  ) { 
    
    this.datas = JSON.parse(localStorage.getItem('resid'));
    this.listflag = JSON.parse(localStorage.getItem('lflag'));

  }

  async ngOnInit() {
    await this.view();
  }

  refresh() {
    this.view();
  }

  cancel() {
    this.router.navigate(['/pages/reseller/resellerList']);
    localStorage.removeItem('resid');
    localStorage.removeItem('lflag');
  }

  async view() {
    this.loading = true;
    if (this.role.getroleid() >= 775) {
      let result = await this.ser.ViewReseller({ id: this.datas })
      console.log("viewresel",result)
      if(result){
        this.data = result[0];
        this.branchdata = result[1];
        this.srvdata = result[2];
        for (var l = 0; l < this.srvdata.length; l++) {
          this.srvdata[l]['dlimit'] = this.srvdata[l]['downrate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['downrate']);
          this.srvdata[l]['ulimit'] = this.srvdata[l]['uprate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['uprate']);
        }
        this.loading = false;
      }
    }
    if (this.role.getroleid() < 775 && this.listflag == 1) {
      let result = await this.ser.ViewReseller({ id: this.datas })
      if (result) {
        // console.log("viewresel",result)
        this.data = result[0];
        this.branchdata = result[1];
        this.srvdata = result[2];
        for (var l = 0; l < this.srvdata.length; l++) {
          this.srvdata[l]['dlimit'] = this.srvdata[l]['downrate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['downrate']);
          this.srvdata[l]['ulimit'] = this.srvdata[l]['uprate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['uprate']);
        }
        this.loading = false;
      }
    }
    if (this.role.getroleid()<775 && this.listflag != 1){
      let result = await this.ser.ViewReseller({ id: this.role.getresellerid() });
      if (result) {
        // console.log("viewresel",result)
        this.data = result[0];
        this.branchdata = result[1];
        this.srvdata = result[2];
        for (var l = 0; l < this.srvdata.length; l++) {
          this.srvdata[l]['dlimit'] = this.srvdata[l]['downrate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['downrate']);
          this.srvdata[l]['ulimit'] = this.srvdata[l]['uprate'] == 0 ? 0 : this.bytefunc(this.srvdata[l]['uprate']);
        }
        this.loading = false;
      }
    }
  }

  bytefunc(datam) {
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(datam) / Math.log(k));
    return (parseFloat((datam / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i])
  }

  async view_subplan(resid,serid){
    let result = await this.planser.listprice({resel_id:resid,srvid:serid});
    this.subplandata = result[0];
    // console.log("subplan",result[0]);
    
  }

  Add_password(resid) {
    const activeModal = this.nasmodel.open(PasswordComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { resid:resid }
    activeModal.componentInstance.modalHeader = 'Change Password';
    activeModal.result.then((data) => {
      this.view();
    })
  }

  Add_username(resid) {
    const activeModal = this.nasmodel.open(UsernameComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { resid:resid }
    activeModal.componentInstance.modalHeader = 'Change Username';
    activeModal.result.then((data) => {
      this.view();
    })
  }
  Edit_res(item) {
    localStorage.setItem('array', JSON.stringify(item));
    // localStorage.setItem('view',JSON.stringify(view_id));
    this.router.navigate(['/pages/reseller/edit-reseller']);
  }

  nasedit(item) {
    console.log('Nasedit',this.data)
    const activeModal = this.nasmodel.open(EditNasComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.componentInstance.item = { id:this.data['id'],bus_id:this.data['isp_id'],groupid:this.data['group_id'],nas_id:this.data['prim_nas_id'] },
    activeModal.componentInstance.modalHeader = 'Edit Nas';
    activeModal.result.then((data) => {
      this.view();
    });
  }


}