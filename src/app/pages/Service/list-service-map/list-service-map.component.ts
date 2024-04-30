import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { S_Service } from '../../_service/indexService';
@Component({
  selector: 'list-service-map',
  templateUrl: './list-service-map.component.html',
})
export class ListServiceMapComponent implements OnInit {
  datas; config;
  constructor(
    private router: Router,
    private ser: S_Service,
  ) { }


  async ngOnInit() {
    localStorage.removeItem('array');
    await this.list();
  }

  async list() {
    let result = await this.ser.listservicemap({});
    this.datas = result;
    // console.log(result);
  }
  
  Edit_User(item) {
    localStorage.setItem('array', JSON.stringify(item));
    this.router.navigate(['/pages/service/edit-service-map']);
  }
}
