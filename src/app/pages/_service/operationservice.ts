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
export class OperationService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async subscriber_renewal(params) {
    return await this.http.post("/api/operations/subscriber_renewal", params).toPromise();
  }
  async cancel_renewal(params) {
    return await this.http.post("/api/operations/cancel_renewal", params).toPromise();
  }
  async invoiceBalanceReceipt(params) {
    return await this.http.post("/api/operations/invoiceBalanceReceipt", params).toPromise();
  }
  async cancel_schedule(params) {
    return await this.http.post("/api/operations/cancel_schedule", params).toPromise();
  }
  async cancelReceipt(params) {
    return await this.http.post("/api/operations/cancelReceipt", params).toPromise();
  }
  topup(params) {
    return this.http.post("/api/operations/subscriber_data_topup", params);
  }
  async changePaymentStatus(params) {
    return await this.http.post("/api/operations/changePaymentStatus", params).toPromise();
  }



}