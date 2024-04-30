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
export class IppoolService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // showNas(): Observable<any> {
  //   return this.http.post("/api/Ippool/showNas", httpOptions).toPromise();
  //  }

  async listIppool(params) {
    return await this.http.post("/api/Ippool/listIppool", params).toPromise();
  }
  async addIppool(params) {
    return await this.http.post("/api/Ippool/addIppool", params).toPromise();
  }
  async editIppool(params) {
    return await this.http.post("/api/Ippool/editIppool", params).toPromise();
  }
  async getIppooledit(params) {
    return await this.http.post("/api/Ippool/getIppooledit", params).toPromise();
  }
  async GenerateIppool(params) {
    return await this.http.post("/api/Ippool/GenerateIppool", params).toPromise();
  }
  async showPoolName(params) {
    return await this.http.post("/api/Ippool/showPoolName",params).toPromise();
  }
  async addStaticIp(params){
    return await this.http.post("/api/Ippool/addStaticIp",params).toPromise();
  }
  async listStaticIp(params){
    return await this.http.post("/api/Ippool/listStaticIp",params).toPromise();
  }
  async getStaticIp(params){
    return await this.http.post("/api/Ippool/getStaticIp",params).toPromise();
  }
  async editStaticIp(params){
    return await this.http.post("/api/Ippool/editStaticIp",params).toPromise();
  }
  async showPublicIp(params){
    return await this.http.post("/api/Ippool/showPublicIp",params).toPromise();
  }
}