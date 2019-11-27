import { Injectable } from '@angular/core';
import { Router, Route, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service'
import { Observable } from "rxjs/observable";
import { AccessRightService } from '../_services/access-right.service';
import { FeatureService } from "../_services/feature.service";
import { SessionStroageProvider } from '../_helper/session.storage.provider';


export class DynamicRouteConfig {
    public static DYNAMICROUTELIST: string[] = ["manage-reporting-group"];
    public static IsActivated: boolean;
    public static DynamicRoute: Route[];
}

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
        private authService: AuthenticationService
        // private globalEventsManager: GlobalEventsManager,
        // private store: Store<IState>
    ) { }

    // this method returns true only after the user is authenticated by cheking local storage of browser otherwise false. 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
        if (this.authService.currentUserValue) {
           // this.store.dispatch({ type: USER_LOGGED_IN });
            return true;
        }
        else {
            // not logged in so redirect to login page
            //this.store.dispatch({ type: USER_LOGGED_OUT });
            //this.router.navigate(['/login']);
            this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
        }


    }
}

@Injectable()
export class CompanyAuthGuard implements CanActivate {

    constructor(private router: Router,
        //private globalEventsManager: GlobalEventsManager,
        private authenticationService: AuthenticationService,
        private accessrightservice: AccessRightService,
        private featureService: FeatureService) {

    }

    // this method returns true only after the user is authenticated by cheking local storage of browser otherwise false. 
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let routeConfig = next.routeConfig;
        let url:string= (<any>next)._routerState.url
        if (!this.authenticationService.currentUserValue) {
            this.router.navigate(['/login']);
            return false;
        }

        //clearing Temp Storage we use this one on invoice upload to store DNS name based on company dropdown selection 
        SessionStroageProvider.clearSessionStorage();
        // if (!DynamicRouteConfig.IsActivated) {
        //     for (let item of DynamicRouteConfig.DYNAMICROUTELIST) {
        //         return this.featureService.getFeatureList(item, false, true).then(f => {
        //             let secureRouteConfig:Route[] = this.router.config.filter(x => x.component['name'] =='SecureAppComponent');
        //             if(secureRouteConfig.length){
        //                 secureRouteConfig=secureRouteConfig[0].children;
        //             }
        //             f.forEach(i => {
        //                 secureRouteConfig.unshift({ path: i.routepath.substr(1).substr(0, (i.routepath.lastIndexOf('/') - 1)) + "/:rid", component: CompanyComponent, canActivate: [CompanyAuthGuard], data: { shouldDetach: false } });

        //             });
        //             if (f.length > 0) {
        //                 DynamicRouteConfig.IsActivated = true;
        //             }

        //             if (routeConfig.path.indexOf(item) != -1) {
        //                 let url = next["_routerState"]["url"];
        //                 debugger;
                        
        //                 let config = secureRouteConfig.filter(x => x.path == url.substr(0).substr(1, url.lastIndexOf("/")) + ':rid');
        //                 if (config.length > 0) {
        //                     routeConfig = config[0];
        //                 }
        //                 else {
        //                     return this.accessDenied();
        //                 }
        //             }
        //             return this.getAccess(routeConfig);
        //         });
        //     }
        // }
        // else {
        return this.getAccess(routeConfig,url);
        // }

    }

    getAccess(routeConfig: any,url:string): Promise<any> {
        return this.accessrightservice.checkAccess(routeConfig,url).then(res => {
            if (!res) {
                return this.accessDenied();
            }
            return true;

        });
    }

    accessDenied() {
        this.router.navigate(['access-denied']);
        return false;
    }
}

