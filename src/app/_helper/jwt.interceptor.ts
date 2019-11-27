import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/observable';

import { AuthenticationService } from '../_services/authentication.service';
import { SessionStroageProvider } from './session.storage.provider';
import { UtilityMethod } from '../_common/utility-method';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        let dnsname = UtilityMethod.IfNull(SessionStroageProvider.getDNSSessionStorage(), '')
        if (!dnsname) {
            dnsname = currentUser && currentUser.companydetails ? currentUser.companydetails.dnsname : "";
        }

        if (currentUser && currentUser.userbasetoken) {
            request = request.clone({
                setHeaders: {
                    Authorization: currentUser.userbasetoken,
                    DNSName: dnsname||''
                }
            });
        }
        // request.headers.set("Accept","application/json");
        // request.headers.set("Content-Type","application/json");
        request=request.clone({
            setHeaders: {
                Accept:"application/json",
                "Content-Type": "application/json"
            }
        });

        return next.handle(request);
    }
}
