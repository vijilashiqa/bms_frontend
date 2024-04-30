import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminuserService, RoleService, BusinessService, PagerService } from '../../_service/indexService';

@Component({
  selector: 'Profilelist',
  templateUrl: './listprofile.component.html',
  styleUrls: ['./listprofile.component.scss']
})
export class ProfileListComponent implements OnInit {
  data;
  pager: any = {}; page: number = 1;
  pagedItems: any = [];

  constructor(
    private route: Router,
    public role: RoleService,
    private admin: AdminuserService,
    private bus: BusinessService,
    public pageservice: PagerService,

  ) { }

  async ngOnInit() {
    // console.log(this.role.getmenurole(73));
    await this.initiallist();
    localStorage.removeItem('profile_e');
  }

  async initiallist() {
    if (this.role.getroleid() >= 775) {
      this.data = await this.admin.listprofile({ index: (this.page - 1) * 10, limit: 10 })
      // console.log(result);
      // this.setPage();
    }
    if (this.role.getroleid() < 775) {
      this.data = await this.admin.listAdminProfile({ index: (this.page - 1) * 10, limit: 10 })
      // console.log(result);
      // this.setPage();
    }
  }

  // list(page) {
  //   var total = Math.ceil(this.data[1]['count'] / 10);
  //   let result = this.pageservice.pageValidator(this.page, page, total);
  //   this.page = result['value'];
  //   if (result['result']) {
  //     this.initiallist();
  //   }
  // }

  // setPage() {
  //   this.pager = this.pageservice.getPager(this.data[1]['count'], this.page, 10);
  //   this.pagedItems = this.data[0];
  // }

  edit(item) {
    localStorage.setItem('profile_e', JSON.stringify(item));
    this.route.navigate(['/pages/administration/AddProfile']);
  }
}