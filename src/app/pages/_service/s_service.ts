import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class S_Service {
  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }

  async listService(params: any) {
    return await this.http.post("/api/s_service/listService", params).toPromise();
  }
  async getService(params) {
    return await this.http.post("/api/s_service/getService", params).toPromise();
  }
  async ViewService(params) {
    return await this.http.post("/api/s_service/ViewService", params).toPromise();
  }
  async showServiceName(params) {
    return await this.http.post("/api/s_service/showServiceName", params).toPromise();
  }
  async showCustomerService(params) {
    return await this.http.post("/api/s_service/showCustomerService", params).toPromise();
  }
  async showCustomerSubplan(params) {
    return await this.http.post("/api/s_service/showCustomerSubplan", params).toPromise();
  }
  async showNas() {
    return await this.http.post("/api/s_service/showNas", httpOptions).toPromise();
  }
  async showLoc() {
    return await this.http.post("/api/s_service/showLoc", httpOptions).toPromise();
  }
  async addService(param) {
    return await this.http.post("/api/s_service/addService", param).toPromise();
  }
  async editService(param) {
    return await this.http.post("/api/s_service/editService", param).toPromise();
  }
  async listaddon() {
    return await this.http.post("/api/s_service/listaddon", httpOptions).toPromise();
  }
  async listdynamic() {
    return await this.http.post("/api/s_service/listdynamic", httpOptions).toPromise();
  }
  async insertAddSer(param) {
    return await this.http.post("/api/s_service/insertAddSer", param).toPromise();
  }
  async insertDynSer(param) {
    return await this.http.post("/api/s_service/insertDynSer", param).toPromise();
  }
  async updateAddSer(param) {
    return await this.http.post("/api/s_service/updateAddSer", param).toPromise();
  }
  async updateDynSer(param) {
    return await this.http.post("/api/s_service/updateDynSer", param).toPromise();
  }
  async listprice(param) {
    return await this.http.post("/api/s_service/listprice", param).toPromise();
  }
  async showSubPlan(param) {
    return await this.http.post("/api/s_service/showSubPlan", param).toPromise();
  }
  async addprice(param) {
    return await this.http.post("/api/s_service/addprice", param).toPromise();
  }
  async addBulkPrice(params) {
    return await this.http.post("/api/s_service/addBulkPrice", params).toPromise();
  }
  async updateprice(param) {
    return await this.http.post("/api/s_service/updateprice", param).toPromise();
  }
  async viewPrice(params) {
    return await this.http.post("/api/s_service/viewPrice", params).toPromise();
  }
  async viewSerResel(params) {
    return await this.http.post("/api/s_service/viewSerResel", params).toPromise();
  }
  async geteditprice(param) {
    return await this.http.post("/api/s_service/geteditprice", param).toPromise();
  }

  async showReseller() {
    return await this.http.post("/api/s_service/showReseller", httpOptions).toPromise();
  }
  async showBRname() {
    return await this.http.post("/api/s_service/showBRname", httpOptions).toPromise();
  }
  async addalwnas(param) {
    return await this.http.post("/api/s_service/addalwnas", param).toPromise();
  }
  async listalwnas(param) {
    return await this.http.post("/api/s_service/listalwnas", param).toPromise();
  }
  async editalwnas(param) {
    return await this.http.post("/api/s_service/editalwnas", param).toPromise();
  }
  async geteditalwnas(param) {
    return await this.http.post("/api/s_service/geteditalwnas", param).toPromise();
  }
  async addservicemap(param) {
    return await this.http.post("/api/s_service/addservicemap", param).toPromise();
  }
  async listservicemap(param) {
    return await this.http.post("/api/s_service/listservicemap", param).toPromise();
  }
  async updateservicemap(param) {
    return await this.http.post("/api/s_service/updateservicemap", param).toPromise();
  }
  async geteditservicemap(param) {
    return await this.http.post("/api/s_service/geteditservicemap", param).toPromise();
  }
  async showFallback(param) {
    return await this.http.post("/api/s_service/showFallback", param).toPromise();
  }
  async addBulkService(param) {
    return await this.http.post("/api/s_service/addBulkService", param).toPromise();
  }
  async showService(params) {
    return await this.http.post("/api/s_service/showService", params).toPromise();
  }
  async serviceMap(params) {
    return await this.http.post("/api/s_service/serviceMap", params).toPromise();
  }
  async showAssignService(params) {
    return await this.http.post("/api/s_service/showAssignService", params).toPromise();
  }
  async showAssignNas(params) {
    return await this.http.post("/api/s_service/showAssignNas", params).toPromise();
  }
  async serviceMapping(params) {
    return await this.http.post("/api/s_service/serviceMapping", params).toPromise();
  }
  async datasplitupdate(params) {
    return await this.http.post("/api/s_service/datasplitupdate", params).toPromise();
  }
  async priceMapping(params) {
    return await this.http.post("/api/s_service/priceMapping", params).toPromise();
  }
  async showAssignReseller(params) {
    return await this.http.post("/api/s_service/showAssignReseller", params).toPromise();
  }
  async addTopup(params) {
    return await this.http.post("/api/s_service/addTopup", params).toPromise();
  }
  async listTopup(params) {
    return await this.http.post("/api/s_service/listTopup", params).toPromise();
  }
  async getEditTopup(params) {
    return await this.http.post("/api/s_service/getEditTopup", params).toPromise();
  }
  async editTopup(params) {
    return await this.http.post("/api/s_service/editTopup", params).toPromise();
  }
  async showTopup(params) {
    return await this.http.post("/api/s_service/showTopup", params).toPromise();
  }
  async showOTTPlans(params) {
    return await this.http.post("/api/s_service/showOTTPlans", params).toPromise();
  }
  async sharingReports(params) {
    return await this.http.post("/api/s_service/sharingReports", params).toPromise();
  }
  async renewOtt(params) {
    return await this.http.post("/api/s_service/renewOtt", params).toPromise();
  }
  async getottplanname(params) {
    return await this.http.post("/api/s_service/getottplanname", params).toPromise();
  }
  async subscriberPlanMap(params){
    return await this.http.post("/api/s_service/subscriberPlanMap", params).toPromise();
  }
  async showCustPlanMap(params){
    return await this.http.post("/api/s_service/showCustPlanMap", params).toPromise();
  }


}