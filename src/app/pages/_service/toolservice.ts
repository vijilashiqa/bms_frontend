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
export class ToolService {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  async radiusserver(params) {
    return await this.http.post("/api/tools/radiusserver", params).toPromise();
  }
 
}