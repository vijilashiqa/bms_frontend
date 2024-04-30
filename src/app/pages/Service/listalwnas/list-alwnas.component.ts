import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S_Service } from '../../_service/indexService';
@Component({
  selector: 'listalwnas',
  templateUrl: './list-alwnas.component.html',

})
export class ListAllownasComponent implements OnInit {
  submit: boolean = false; groups; config;
  constructor(
    private route: Router,
    private ser: S_Service

  ) { }

  ngOnInit() {
    localStorage.removeItem('array')
    this.list();
  }

  async list() {
    let result = await this.ser.listalwnas({})
    this.groups = result;
    // console.log(this.groups)
  }

  Edit_User(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.route.navigate(['/pages/service/editalw-nas'])
  }
}