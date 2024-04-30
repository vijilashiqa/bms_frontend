import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpClient
  ) { }

  async payment(params) {
    return await this.http.post("/api/pay/meTrnPay", params, { responseType: 'text' }).toPromise();
  }

  async paysuccess(params) {
    return await this.http.post("/api/pay/meTrnSuccess",params).toPromise();
  }

  async paystatus(params){
    return await this.http.post("/api/pay/meTrnStaus",params).toPromise();
  }

  async pumstatus(params){
    return await this.http.post("/api/pay/pumTrnStaus",params).toPromise();
  }

  async payStarStatus(params){
    return await this.http.post("/api/pay/payStarTrnStaus",params).toPromise();
  }

  async paystatusCust(params){
    return await this.http.post("/api/pay/meTrnStausSub",params).toPromise();
  }

  async pumstatusCust(params){
    return await this.http.post("/api/pay/pumTrnStausSub",params).toPromise();
  }

  async paytmStatus(params){
    return await this.http.post("/api/pay/paytmtranstatus",params).toPromise();
  }
    
  async payStarCustStatus(params){
    return await this.http.post("/api/pay/payStarTrnCustStatus",params).toPromise();
  }
  async easyBuzzTrnStaus(params){
    return await this.http.post("/api/pay/easyBuzzTrnStaus",params).toPromise();
  }
  async easyBuzzTrnStausSub(params){
    return await this.http.post("/api/pay/easyBuzzTrnStausSub",params).toPromise();
  }

  async checkAggregatorStatus(params){
    return await this.http.post("/api/pay/checkAggregatorStatus",params).toPromise();
  }
  
}