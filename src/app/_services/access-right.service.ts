import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { FeatureService } from "../_services/feature.service";
// var $ = require('jquery');
import * as $ from 'jquery';


@Injectable({
    providedIn: 'root'
})
export class AccessRightService {
    constructor(private featureservice: FeatureService) {

    }

    checkAccess(routeConfig: Route, url: string): Promise<boolean> {
        let apiUrl = '';
        // if (url) {
        //     apiUrl = url.split("/")[1];
        // }
        if (routeConfig.path != '') {
            apiUrl = routeConfig.path.split("/:")[0];
        }
        else {
            apiUrl = url.split("/")[1];
        }
        if (apiUrl) {
            apiUrl = apiUrl.split("?")[0];
        }
        apiUrl = `/${apiUrl}`;
        return this.featureservice.getFeatureList(apiUrl, true, true).then(res => {
            if (res.length > 0) {

                if (res[0].menureadonly) {
                    routeConfig.component.prototype.ngAfterViewChecked = function (evt: any) {
                        let nativeElement: any = $(document);
                        let modalElement = $('ngb-modal-window')
                        if (modalElement.is(':visible')) {
                            nativeElement = modalElement;
                        }
                        nativeElement.find('form :input').not($('.exclude_readonly :input')).attr('disabled', 'disabled');
                        nativeElement.find('form p-dropdown,form p-multiselect').not($('.exclude_readonly :input')).each(function (i: any, v: any) {
                            let that = $(v);
                            if (that.find('.ui-blockui').length == 0) {
                                that.append('<div class="ui-blockui cursor-not-allowed" style="display:block"></div>')
                            }
                        });
                    };
                } else {
                    routeConfig.component.prototype.ngAfterViewChecked = function (evt: any) {

                    };

                }

                return true;
            }
            else {
                return false;
            }
        });
    }
}