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

@Injectable({ providedIn: 'root' })
export class LogService {
  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }

  login(params) {
    return this.http.post<any>("/api/login/login1", params);
  }
  logout() {
    this.router.navigate(['/auth/login'])
    localStorage.clear();
  }
  httppost(url,params){
    // let httpOptions = this.httpHeade.authToken();
     return this.http.post(url,params,httpOptions).pipe(
      map(res=>{
        return res;
      })
    ); 
  }
}


