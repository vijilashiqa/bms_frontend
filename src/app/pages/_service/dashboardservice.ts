import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class DashboardService {
  constructor(
    private http: HttpClient,
  ) { }

  async getBalance(params) {
    return await this.http.post("/api/dashboard/getBalance", params).toPromise();
  }
  async getYexp(params) {
    return await this.http.post("/api/dashboard/getYexp", params).toPromise();
  }
  async getTodayexp(params) {
    return await this.http.post("/api/dashboard/getTodayexp", params).toPromise();
  }
  async getTomorrowExp(params) {
    return await this.http.post("/api/dashboard/getTomorrowExp", params).toPromise();
  }
  async getDFT(params) {
    return await this.http.post("/api/dashboard/getDFT", params).toPromise();
  }
  async getAggExp(params) {
    return await this.http.post("/api/dashboard/getAggExp", params).toPromise();
  }
  async getcount(params) {
    return await this.http.post("/api/dashboard/getcount", params).toPromise();
  }
  async search(params) {
    return await this.http.post("/api/dashboard/search", params).toPromise();
  }
  async chart(params) {
    return await this.http.post("/api/dashboard/chart", params).toPromise();
  }
  async payment(params) {
    return await this.http.post("/api/dashboard/payment", params).toPromise();
  }
  async getCAFPending(params) {
    return await this.http.post("/api/dashboard/getCAFPending", params).toPromise();
  }
  async getDeposit(params) {
    return await this.http.post("/api/dashboard/getDeposit", params).toPromise();
  }
  async getLMD(params) {
    return await this.http.post("/api/dashboard/getLMD", params).toPromise();
  }
  async getLMO(params) {
    return await this.http.post("/api/dashboard/getLMO", params).toPromise();
  }
  async getNasStatus(params) {
    return await this.http.post("/api/dashboard/getNasStatus", params).toPromise();
  }
}