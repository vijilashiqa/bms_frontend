import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment as env } from '../../../environments/environment';
import { RoleService } from './roleservice';

// Handle Request
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private commonSrv: RoleService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //Add Base Url
        request = request.clone({ url: env.baseUrl + request.url });

        // add authorization header with jwt token if available
        const token = this.commonSrv.getToken();
        const ref_token = this.commonSrv.getRefreshtoken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    authorization: token,
                    refresh: ref_token
                }
            });
        }

        return next.handle(request);
    }
}