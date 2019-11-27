import { Injectable } from '@angular/core';
import { BenDetail } from '../_models/ben-detail';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root',
    
  })
export class BENDetailService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }

    /**
     * Gets the active ben list for the given company
     * @param companyId: The companny id
     */
    getBenDetailList(invoicedateguid?: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<BenDetail[]> {
        //getBenDetailList(): Promise<[BenDetail]> {
        return this.http.get<BenDetail[]>(this.appSettingService.apiurl + '/BENDetail/GetBENDetailListAsync?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

    // IsBenExistForCompanyAsnyc(): Promise<boolean> {
    IsBenExistForCompanyAsnyc(invoicedateguid?: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/BENDetail/IsBenExistForCompanyAsnyc?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

    getBenDetailListForRGCost(networkguid?: string, billingplatformguid?: string): Promise<BenDetail[]>  {
        //getBenDetailList(): Promise<[BenDetail]> {
            return this.http.get<BenDetail[]>(this.appSettingService.apiurl + '/BENDetail/GetBENDetailListForRGCostAsync?networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid)
            .toPromise();
            
    }

    IsBenExistForFleet(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl +  '/BENDetail/IsBenExistForFleetAsync')
            .toPromise();
           
    }
}