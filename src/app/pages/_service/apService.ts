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
export class APService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async listap(params) {
    return await this.http.post("/api/ap/listAp", params).toPromise();
  }
  async addap(params) {
    return await this.http.post("/api/ap/addAp", params).toPromise();
  }
  async editap(params) {
    return await this.http.post("/api/ap/editAp", params).toPromise();
  }
  async getapedit(params) {
    return await this.http.post("/api/ap/getapedit", params).toPromise();
  }
  async showip(params) {
    return await this.http.post("/api/ap/showip", params).toPromise();
  }
  async showApName(params){
    return await this.http.post("/api/ap/showApName",params).toPromise();
  }
}