import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class GroupService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async listgroup(params) {
    return await this.http.post("/api/group/listGroup", params).toPromise();
  }

  async addgroup(params) {
    return await this.http.post("/api/group/addGroup", params).toPromise();
  }

  async editgroup(params) {
    return await this.http.post("/api/group/editgroup", params).toPromise();
  }
  async getgroupedit(params) {
    return await this.http.post("/api/group/getgroupedit", params).toPromise();
  }
  async showGroupName(params) {
    return await this.http.post("/api/group/showGroupName", params).toPromise();
  }
 
}