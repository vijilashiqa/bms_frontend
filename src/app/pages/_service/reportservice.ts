import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';



const httpOptions = {
   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ReportService {
   constructor(private http: HttpClient,
      private router: Router,

   ) { }
   
   async listBalanceLog(params) {
      return await this.http.post("/api/reports/listBalanceLog", params).toPromise();
   }
   async listInvoiceCreditNote(params){
      return await this.http.post("/api/reports/listInvoiceCreditNote", params).toPromise();
   }
   async listGSTInvoiceCreditNote(params){
      return await this.http.post("/api/reports/listBalanceLog", params).toPromise();
   }
   async checkSubscriberCount(params){
      return await this.http.post("/api/reports/checkSubscriberCount",params).toPromise();
   }
   async resellerRevenueShare(params){
      return await this.http.post("/api/reports/resellerRevenueShare",params).toPromise();
   }
   async topupReport(params){
      return await this.http.post("/api/reports/topupReport",params).toPromise();
   }
   async trafficReport(params){
      return await this.http.post("/api/reports/trafficReport",params).toPromise();
   }
   
}