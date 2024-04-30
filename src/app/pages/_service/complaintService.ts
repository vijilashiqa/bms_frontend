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
export class ComplaintService {
  constructor(
    private http: HttpClient,
    private router: Router,
 ) {}

 async listComplType(params){
  return await this.http.post("/api/comp/listComplType",params).toPromise();
 }
 async addComplType(params){
  return await this.http.post("/api/comp/addComplType",params).toPromise();
 }
 async getEditComplType(params){
  return await this.http.post("/api/comp/getEditComplType",params).toPromise();
 }
 async editComplType(params){
  return await this.http.post("/api/comp/editComplType",params).toPromise();
 }
 async listComplaint(params){
  return await this.http.post("/api/comp/listComplaint",params).toPromise();
 }
 async addComplaint(params){
  return await this.http.post("/api/comp/addComplaint",params).toPromise();
 }
 async getEditComplaint(params){
  return await this.http.post("/api/comp/getEditComplaint",params).toPromise();
 }
 async editComplaint(params){
  return await this.http.post("/api/comp/editComplaint",params).toPromise();
 }
 async showEmployee(params){
   return await this.http.post("/api/comp/showEmployee",params).toPromise();
 }
 async showComplaintType(params){
   return await this.http.post("/api/comp/showComplaintType",params).toPromise();
 }
 async getComplaintHistory(params){
   return await this.http.post("/api/comp/getComplaintHistory",params).toPromise();
 }
 async updateComplaintHistory(params){
   return await this.http.post("/api/comp/updateComplaintHistory",params).toPromise();
 }
}