import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpInterceptor, HttpClient, HttpBackend } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import { LogService } from './logservice';
import { RoleService } from './roleservice';
import { environment as env } from '../../../environments/environment'

// Handle Response
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private loginService: LogService,
        private role: RoleService,
        private http: HttpClient,
        private httpBackend: HttpBackend,
        private alert: ToasterService
    ) { this.http = new HttpClient(this.httpBackend) }

    getRefreshToken() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': this.role.getRefreshtoken()
            })
        };
        return this.http.get<any>(env.baseUrl + "/api/renewtoken/renewAccessToken", httpOptions)
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            const error = (err.error || {}).message || err.statusText || err;
            if (err.error.status === 401) {
                if (err.error.restore === true) {
                    //TODO: Token refreshing
                    this.getRefreshToken().subscribe((resp) => {
                        if (resp[0]['restore'] === false) {
                            const toast: Toast = {
                                type: resp[0]['status'] == 401 ? 'warning' : 'warning',
                                title: resp[0]['status'] == 401 ? 'Failure' : 'Failure',
                                body: 'Session Expired',
                                timeout: 3000,
                                showCloseButton: true,
                                bodyOutputType: BodyOutputType.TrustedHtml,
                            };
                            this.alert.popAsync(toast);
                            this.loginService.logout();
                        } else {
                            localStorage.setItem('token', JSON.stringify(resp[0]['token']))
                            request = request.clone({
                                setHeaders: {
                                    authorization: resp[0].token
                                }
                            });
                            window.alert('Session Restored Pls Click Again!')
                            return next.handle(request)
                        }
                    });
                }
                else {
                    //Logout from account if 401 response returned from api
                    const toast: Toast = {
                        type: err.error.status == 401 ? 'warning' : 'warning',
                        title: err.error.status == 401 ? 'Failure' : 'Failure',
                        body: 'LoggedIn On Another Device',
                        timeout: 3000,
                        showCloseButton: true,
                        bodyOutputType: BodyOutputType.TrustedHtml,
                    };
                    // this.alert.popAsync(toast);
                    // this.loginService.logout();
                    window.alert('Please Login Again')
                    this.loginService.logout();
                }
            }
            return throwError(error);
        }))
    }
}