/// <reference path="../_models/report/euroworldtravellerinternationalsummaryviewmodel.ts" />
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { EuroWordItemisedViewModel } from "../_models/euro-world-itemised";
import { EuroWorldTravellerInternationalSummaryViewModel } from '../_models/report/euroworldtravellerinternationalsummaryviewmodel';


@Injectable({
    providedIn: 'root'
})
export class EuroWorldTravellerService {
    /**
     * Constructor to inject services
     * @param http
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    getEuroWorldTravellerData(invoiceDateGuid: string, networkguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string): Promise<EuroWorldTravellerInternationalSummaryViewModel[]> {
        return this.http.get<EuroWorldTravellerInternationalSummaryViewModel[]>(this.appSettingService.apiurl + '/Report/GetEuroWorldTravellerDataAsync?invoiceDateGuid=' + invoiceDateGuid + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&BanGuid=' + banGuid)
            .toPromise();
    }

    GetEuroWorldInvoiceItemised(invoicedateguid: string, countryoforigin: string, networkguid: string, billingPlatFormGuid: string, benguid: string, ban: string): Promise<EuroWordItemisedViewModel[]> {
        return this.http.get<EuroWordItemisedViewModel[]>(this.appSettingService.apiurl + '/Report/GetEuroWorldInvoiceItemised?invoiceDateGuid=' + invoicedateguid + '&countryofOrigin=' + countryoforigin.replace('&', '!') + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&BanGuid=' + ban)
            .toPromise();
    }
}