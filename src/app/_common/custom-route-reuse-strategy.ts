import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot, UrlSegment, } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service'
var $ = require('jquery');

interface RouteStorageObject {
    url: UrlSegment[];
    detach: boolean;
}


// This impl. bases upon one that can be found in the router's test cases.
export class CustomReuseStrategy implements RouteReuseStrategy {

    constructor(private authService: AuthenticationService) {

    }

    static handlers: { [key: string]: DetachedRouteHandle } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {

        if (Object.keys(route.params).length > 0 || Object.keys(route.queryParams).length > 0) {
            return false;
        }
        if (route.data["shouldDetach"] != undefined) {
            return route.data["shouldDetach"];
        }

        let config = (<any>route.routeConfig)._loadedConfig.routes[0];
        if (config.data["shouldDetach"] != undefined) {
            return config.data["shouldDetach"];
        }

        return true;

    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        CustomReuseStrategy.handlers[this.getKey(route)] = handle;

    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return !!route.routeConfig && !!CustomReuseStrategy.handlers[this.getKey(route)];
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
        if (!route.routeConfig || Object.keys(route.params).length > 0 || Object.keys(route.queryParams).length > 0) return null;
        return CustomReuseStrategy.handlers[this.getKey(route)];

    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        //work around for scrollable DataTable 

        //done using javascript function 
        //let element = document.getElementsByClassName('ui-datatable-scrollable-header-box');
        //for (var _i = 0; _i < element.length; _i++) {
        //     element[_i]["style"]["marginLeft"]=0;
        //}

        //done using Jquery
        $('.ui-datatable-scrollable-header-box').css("margin-left", "0");

        return future.routeConfig === curr.routeConfig;
    }

    getKey(route: ActivatedRouteSnapshot): string {
        let storage = this.authService ? this.authService.currentUserValue : null;
        // LocalStorageProvider.getUserStorage();
        let key: string = route.routeConfig.path;
        //==To Handle Lazt Loaded Modules
        if (!key) {
            //let firstRoute:any =route.children[0];
            key = (<any>route)._routerState.url.replace('/', '');
        }
        if (storage) {
            key += storage.username;
            if (storage.companydetails) {
                key += storage.companydetails.companyguid;
            }
        }
        //if (Object.keys(storage.companydetails).length>0)
        //{
        //    key += storage.companydetails.companyguid;
        //}
        return key;
    }

    static deactivateAllHandles(): void {
        let data = CustomReuseStrategy.handlers;
        let keys = Object.keys(data)
        if (keys != null && keys != undefined) {
            keys.forEach(x => {
                if (data[x] && data[x]["componentRef"]) {
                    this.deactivateOutlet(data[x]["componentRef"]);
                }
            });
        }

    }

    // Todo: we manually destroy the component view here. Since RouteReuseStrategy is experimental, it
    // could break anytime the protocol change. We should alter this once the protocol change.
    static deactivateOutlet(handle: any): void {
        const componentRef: ComponentRef<any> = handle
        if (componentRef) {
            componentRef.destroy();
        }
    }

    static clearCompSnapshot() {
        this.deactivateAllHandles();
        CustomReuseStrategy.handlers = {};
    }

    // static clearSnapshotByRoutePath(routepath: string) {
    //     // let allData = CustomReuseStrategy.handlers;
    //     let storage = this.getKey
    //     //LocalStorageProvider.getUserStorage();
    //     let key: string = routepath;
    //     if (storage) {
    //         key += storage.username;
    //         if (storage.companydetails) {
    //             key += storage.companydetails.companyguid;
    //         }
    //     }
    //     let dataWithKey = CustomReuseStrategy.handlers[key];
    //     if (dataWithKey) {
    //         this.deactivateOutlet(CustomReuseStrategy.handlers[key]["componentRef"]);
    //         delete CustomReuseStrategy.handlers[key];
    //     }
    // }

}