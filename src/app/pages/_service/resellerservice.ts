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
export class ResellerService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  async listReseller(params) {
    return await this.http.post("/api/reseller/listReseller", params).toPromise();
  }

  async addReseller(params) {
    return await this.http.post("/api/reseller/addReseller", params).toPromise();
  }

  async editReseller(params) {
    return await this.http.post("/api/reseller/editReseller", params).toPromise();
  }
  async getResellerEdit(params) {
    return await this.http.post("/api/reseller/getResellerEdit", params).toPromise();
  }
  async ViewReseller(params) {
    return await this.http.post("/api/reseller/ViewReseller", params).toPromise();
  }
  async addResBranch(params) {
    return await this.http.post("/api/reseller/addResBranch", params).toPromise();
  }
  async editResBranch(params) {
    return await this.http.post("/api/reseller/editResBranch", params).toPromise();
  }
  async listResBranch(params) {
    return await this.http.post("/api/reseller/listResBranch", params).toPromise();
  }
  async getResBranch(params) {
    return await this.http.post("/api/reseller/getResBranch", params).toPromise();
  }
  async changepassword(params) {
    return await this.http.post("/api/reseller/changepassword", params).toPromise();
  }
  async changereselusername(params) {
    return await this.http.post("/api/reseller/changereselusername", params).toPromise();
  }
  async showResellerName(params) {
    return await this.http.post("/api/reseller/showResellerName", params).toPromise();
  }
  async getResellerName(params) {
    return await this.http.post("/api/reseller/getResellerName", params).toPromise();
  }
  async showResellerBranch(params) {
    return await this.http.post("/api/reseller/showResellerBranch", params).toPromise();
  }
  async showProfileReseller(params) {
    return await this.http.post("/api/reseller/showProfileReseller", params).toPromise();
  }
  async showResellerUnder(params) {
    return await this.http.post("/api/reseller/showResellerUnder", params).toPromise();
  }
  async showCountResel(params) {
    return await this.http.post("/api/reseller/showcountResel", params).toPromise();
  }
  async uploadResellerLogo(file) {
    return await this.http.post("/api/reseller/uploadResellerLogo", file).toPromise();
  }
  async getResellerLogo(params) {
    return await this.http.get("/api/reseller/getResellerLogo", { params }).toPromise();
  }
  async getPayGateway(params) {
    return await this.http.post("/api/reseller/getPayGateway", params).toPromise();
  }
  async listAggExp(params) {
    return await this.http.post("/api/reseller/listAggExp", params).toPromise();
  }
  async updateResellerNas(params) {
    return await this.http.post("/api/reseller/updateResellerNas", params).toPromise();
  }
  async updatePackageShare(params) {
    return await this.http.post("/api/reseller/updatePackageShare", params).toPromise();
  }
}