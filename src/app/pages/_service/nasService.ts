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
export class NasService {
   constructor(private http: HttpClient,
      private router: Router,

   ) { }

   async listNas(params) {
      return await this.http.post("/api/nas/listNas", params).toPromise();
   }
   async addNas(params) {
      return await this.http.post("/api/nas/addNas", params).toPromise();
   }
   async editNas(params) {
      return await this.http.post("/api/nas/editNas", params).toPromise();
   }
   async getnasedit(params){
      return await this.http.post("/api/nas/getnasedit",params).toPromise();
   }
   async getnas(params){
      return await this.http.post("/api/nas/getnas",params).toPromise();
   }
   async showGroupNas(params){
      return await this.http.post("/api/nas/showGroupNas",params).toPromise();
   }
   async showCountNas(params){
      return await this.http.post("/api/nas/showCountNas",params).toPromise();
   }
   async listresellernas(params){
      return await this.http.post("/api/nas/listresellernas",params).toPromise();
   }
}