 import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
};

@Injectable()
export class CompanyService {
  constructor(
    private http: HttpClient,
    private router: Router,
) {}

	async listcmpny(params){
     return await this.http.post("/api/cmpny/listcmpny", params).toPromise();  
    }
   async addcmpny(params){
      return await this.http.post("/api/cmpny/addcmpny", params).toPromise();
   }
   async editcmpny(params){
       return await this.http.post("/api/cmpny/editcmpny", params).toPromise();
   }
   async getcmpnyedit(params){
     return await this.http.post("/api/cmpny/getcmpnyedit",params).toPromise();
   }
   
}