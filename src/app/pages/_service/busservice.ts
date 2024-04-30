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
export class BusinessService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async listbusiness(params) {
    return await this.http.post("/api/bus/listbusiness", params).toPromise();
  }

  async addbusiness(params) {
    return await this.http.post("/api/bus/addbusiness", params).toPromise();
  }

  async editbusiness(params) {
    return await this.http.post("/api/bus/editbusiness", params).toPromise();
  }
  async getbusinessedit(params) {
    return await this.http.post("/api/bus/getbusinessedit", params).toPromise();
  }
  async showBusName(params) {
    return await this.http.post("/api/bus/showBusName", params).toPromise();
  }
  
  async showBusMob(params) {
    return await this.http.post("/api/bus/showBusMob", params).toPromise();
  }
  async showServiceType(params) {
    return await this.http.post("/api/bus/showServiceType", params).toPromise();
  }
  async showPlanSerType(params) {
    return await this.http.post("/api/bus/showPlanSerType", params).toPromise();
  }
  async listbusinesstax(params) {
    return await this.http.post("/api/bus/listbusinesstax", params).toPromise();
  }
  async uploadLogo(file) {
    return await this.http.post("/api/bus/uploadLogo", file).toPromise();
  }
  async getIspLogo(params){
    return await this.http.get("/api/bus/getIspLogo",{params}).toPromise();
  }

}