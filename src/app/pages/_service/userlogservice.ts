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
export class UserLogService {
   constructor(private http: HttpClient,
      private router: Router,

   ) { }

   async listActivityLog(params) {
      return await this.http.post("/api/log/listActivityLog", params).toPromise();
   }
   async listBandwidthLog(params) {
      return await this.http.post("/api/log/listBandwidthLog", params).toPromise();
   }
   async listEditProfileLog(params){
      return await this.http.post("/api/log/listEditProfileLog",params).toPromise();
   }
   async listResellerShareLog(params){
      return await this.http.post("/api/log/listResellerShareLog",params).toPromise();
   }
   async listNaslog(params) {
      return await this.http.post("/api/log/listNaslog",params).toPromise();
   }
   async userMailLog(params) {
      return await this.http.post("/api/log/userMailLog",params).toPromise();
   }
   async userDatausage(params) {
      return await this.http.post("/api/log/userDatausage",params).toPromise();
   }
   async resellerShareLog(params){
      return await this.http.post("/api/log/resellerShareLog",params).toPromise();
   }
   downloadFile(params){
      return this.http.get(`/api/log/download`, {params, responseType: 'blob'}).catch(error => { 
      return this.handleError(error);
    });
   
   }
   handleError(error: Response) {
        return Observable.throwError(error);
   }
}