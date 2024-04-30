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
export class EnquiryService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  ListEnquiry(params) {
    return this.http.post("/api/enquiry/ListEnquiry", params);
  }

  AddEnquiry(params) {
    return this.http.post("/api/enquiry/AddEnquiry", params);
  }

  editEnquiry(params) {
    return this.http.post("/api/enquiry/editEnquiry", params);
  }
  GetEditEnquiry(params) {
    return this.http.post("/api/enquiry/GetEditEnquiry", params);
  }
}