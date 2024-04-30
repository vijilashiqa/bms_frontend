import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminuserService, RoleService, BusinessService, PagerService, ResellerService } from '../../_service/indexService';

@Component({
  selector: 'userprofilelist',
  templateUrl: './listuserprofile.component.html',
  styleUrls: ['./listuserprofile.component.scss']
})
export class UserProfileListComponent implements OnInit {
  data;tot;bus;pro;deptdata;resdata;userlogid;
  bus_name='';pro_name='';dept_name='';res_name='';login_id='';
  search;
  pager: any = {}; page: number = 1;pagedItems: any = []; limit = 25;

  constructor(
    private route: Router,
    public role: RoleService,
    private admin: AdminuserService,
    private busser: BusinessService,
    private resser : ResellerService,
    private reselser : ResellerService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    localStorage.removeItem('profile');
    await this.initiallist();
    await this.showBusName();
    if(this.role.getroleid()<=777){
      this.bus_name = this.role.getispid();
      await this.profile();
      await this.department();
      await this.showloginid();
    }
    // if(this.role.getroleid()<775){
    //   this.pro_name = this.role.getroleid();
    // }
  }

  async showBusName($event = '') {
    this.bus = await this.busser.showBusName({ like: $event })
    // console.log(result)
  }

  async profile($event='') {
    if (this.role.getroleid() <= 777) {
      this.pro = await this.admin.showProfileAdmin({ like:$event })
    }
    if (this.role.getroleid() > 777) {
      this.pro = await this.admin.showProfileAdmin({ like:$event,bus_id: this.bus_name });
    }
  }

  async department() {
    if (this.role.getroleid() > 777) {
      this.deptdata = await this.admin.showDepartment({ bus_id: this.bus_name });
      // console.log(res)
    } else {
      this.deptdata = await this.admin.showDepartment({});
    }
  }

  async showloginid($event = '') {
    if(this.role.getroleid()<775){
      if([666,555].includes(this.role.getroleid())){
        this.userlogid = await this.reselser.showResellerName({ bus_id:this.bus_name,manager_id:this.role.getresellerid() , l_like:$event })
      }else{
        this.userlogid = await this.reselser.showResellerName({ bus_id:this.bus_name,dep_id:this.dept_name,manager_id:this.role.getresellerid() , l_like:$event })
      }
    }else {
      this.userlogid = await this.reselser.showResellerName({ bus_id:this.bus_name,dep_id:this.dept_name,role:this.pro_name ,l_like:$event })
    }
  }

  changeclear(item) {
    if(item == 1){
      this.pro_name = '';
      this.dept_name = '';
      this.login_id = '';
    }
    if(item == 2){
      this.dept_name='';
      this.login_id='';
    }
  }

  async refresh(){
    this.bus_name='';
    this.pro_name='';
    this.dept_name='';
    this.login_id='';
    this.pro='';
    this.deptdata='';
    this.userlogid='';
    if(this.role.getroleid()<=777){
      await this.profile();
      await this.department();
      await this.showloginid();
    }
    await this.initiallist();
  }

  async initiallist() {
    let result = await this.admin.listAdminProfile({ 
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bus_id: this.bus_name,
      Role: this.pro_name,
      dep_id:this.dept_name,
      mid:this.login_id,
    });
    this.data = result[0];
    this.tot = result[1]['count']
    // console.log(this.data);
    this.setPage();
  }

  getlist(page) {
    var total = Math.ceil(this.tot / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    }
  }

  setPage() {
    this.pager = this.pageservice.getPager(this.tot, this.page, this.limit);
    this.pagedItems = this.data;
  }

  edit(item) {
    localStorage.setItem('profile', JSON.stringify(item));
    this.route.navigate(['/pages/administration/edituserprofile']);
  }
}