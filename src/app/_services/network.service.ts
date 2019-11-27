import { Injectable } from '@angular/core';
import { Network } from '../_models/network';
import { BillingPlatform } from '../_models/billingplatform';
import { NetworkBillingPlatformRel } from '../_models/networkbillingplatformrel';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root',
    
  })
export class NetworkService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    /**
     * Gets the available network list for given company
     * @param companyId: The companny id
     */
    getNetworkList(fromDate?: Date, toDate?: Date, invoiceDateGuid?: string): Promise<Network[]> {
        return this.http.get<Network[]>(this.appSettingService.apiurl + '/Network/GetNetworkListAsync?fromDate=' + fromDate + '&toDate=' + toDate + '&invoiceDateGuid=' + invoiceDateGuid)
            .toPromise();
            
    }

    getAllActiveNetworkList() {
        return this.http.get<Network[]>(this.appSettingService.apiurl + '/Network/GetAllActiveNetworkListAsync')
            .toPromise();
         
    }

    /**
     * Gets the billing platform for given company and selected network
     * @param companyId: The company id
     * @param networkId: The selected network id
     */

    getBillingPlatforms(networkGuid?: string, fromUploadInvoice: boolean = false, fromDate?: Date, toDate?: Date, invoiceDateGuid?: string): Promise<BillingPlatform[]> {
        return this.http.get<BillingPlatform[]>(this.appSettingService.apiurl + '/Network/GetBillingPlatformListAsync?fromDate=' + fromDate + '&toDate=' + toDate + '&invoiceDateGuid=' + invoiceDateGuid + '&networkGuid=' + networkGuid + '&fromUploadInvoice=' + fromUploadInvoice)
            .toPromise();
            
    }

    getNetworkBillingPlatforms(networkGuid?: string, fromUploadInvoice: boolean = false): Promise<BillingPlatform[]> {
        return this.http.get<BillingPlatform[]>(this.appSettingService.apiurl + '/Network/GetBillingPlatformListAsync?networkGuid=' + networkGuid + '&fromUploadInvoice=' + fromUploadInvoice)
            .toPromise();
            
    }


    getNetworkBillingPlatformsbyid(networkid?: number): Promise<BillingPlatform[]> {
        return this.http.get<BillingPlatform[]>(this.appSettingService.apiurl + '/Network/GetBillingPlatformListAsync?networkid=' + networkid)
            .toPromise();
            
    }

    getnetworkplatformrel(): Promise<NetworkBillingPlatformRel[]> {
        return this.http.get<NetworkBillingPlatformRel[]>(this.appSettingService.apiurl + '/Network/GetNetworkPlatformRelAsync')
            .toPromise();
            
    }
    updatenetworkbillingpaltformstatus(networkid: number ,status: boolean, billingplatformid?: number) {
        var obj = {
            "networkid": networkid,
            "billingplatformid": billingplatformid,
            "status": status
        }; 

        var body = JSON.stringify(obj);
        return this.http.post(this.appSettingService.apiurl + '/Network/UpdateNetworkBillingpaltformStatus', body);
    }

    IsNetworkDisplay(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/Network/IsNetworkDisplay')
            .toPromise();
            
    }



    CheckBillingPlatformForHideTaxAsync(networkGuid?: string): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/Network/CheckBillingPlatformForHideTaxAsync?networkGuid=' + networkGuid)
            .toPromise();
            
    }

    getNetworkListForRGCost(): Promise<Network[]> {
        return this.http.get<Network[]>(this.appSettingService.apiurl + '/Network/GetNetworkLisForRGCosttAsync')
            .toPromise();
           
    }

    getBillingPlatformsForRGCost(networkGuid?: string): Promise<BillingPlatform[]> {
        return this.http.get<BillingPlatform[]>(this.appSettingService.apiurl + '/Network/GetBillingPlatformListForRGCostAsync?networkGuid=' + networkGuid)
            .toPromise();
            
    }

}