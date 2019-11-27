import { Injectable } from '@angular/core';
import { Invoice, InvoiceCTNGraphViewModel } from '../_models/invoice';
import { BenDetail } from '../_models/ben-detail';
import { BanDetail } from '../_models/ban-detail';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { Network } from '../_models/network';
import { InvoiceItemisedViewModel } from "../_models/invoiceitemised";
import { UtilityMethod } from '../_common/utility-method'; 

@Injectable({
    providedIn: 'root',
    
  })
export class InvoiceService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    /**
     * Gets the available network list for given company
     */
    IsBENDetailExits(invoicedateguid: string, networkguid?: string, billingplatformguid?: string): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/Invoice/IsBENDetailExits?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + UtilityMethod.IfNull(billingplatformguid, ''))
            .toPromise();
          
    }

    /**
     * Gets the available ben list for given company
   
     */
    getBenList(invoicedateguid: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<BenDetail[]> {
        return this.http.get<BenDetail[]>(this.appSettingService.apiurl + '/BENDetail/GetBENDetailListAsync?invoiceDateGuid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
          
    }

    /**
    * Gets the available ben list for given company

    */
    getBanList(invoicedateguid?: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<BanDetail[]> {
        return this.http.get<BanDetail[]>(this.appSettingService.apiurl  + '/Invoice/GetBANListForInvoiceMonth?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
           
    }


    /**
    * Gets the available ben list for given company
  
    */
    getNetworkListForInvoiceMonth(invoicedateguid: string): Promise<Network[]> {
        return this.http.get<Network[]>(this.appSettingService.apiurl + '/Network/GetNetworkListAsync?invoiceDateGuid=' + invoicedateguid)
            .toPromise();
        
    }

    /**
     * Gets the invoice ctn for given company based on parameters

     */
   
    getInvoiceList(linktype: string, invoicedateguid: string, mobilenumber: string, networkguid: string, linksourceguid: string, rtypeguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string, isobservationdrilldown : boolean): Promise<Invoice[]> {
        return this.http.get<Invoice[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceLoadAsync?invoicedateguid=' + invoicedateguid + '&mobilenumber=' + UtilityMethod.IfNull(mobilenumber, '') + '&linktype=' + UtilityMethod.IfNull(linktype, '') + '&networkGuid=' + networkguid + '&linksourceguid=' + linksourceguid + '&rtypeGuid=' + rtypeguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&banguid=' + banGuid + '&isobservationdrilldown=' + isobservationdrilldown)
            .toPromise();
         
    }


    GetCTNInvoiceSummaryGraph(linktype: string, invoicedateguid: string, networkguid: string, linksourceguid: string, rtypeguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string, isobservationdrilldown : boolean): Promise<InvoiceCTNGraphViewModel[]> {
        return this.http.get<InvoiceCTNGraphViewModel[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceSummaryData?invoicedateguid=' + invoicedateguid + '&linktype=' + UtilityMethod.IfNull(linktype, '') + '&networkGuid=' + networkguid + '&linksourceguid=' + linksourceguid + '&rtypeGuid=' + rtypeguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&banguid=' + banGuid + '&isobservationdrilldown=' + isobservationdrilldown)
            .toPromise();
          
    }

    GetCTNInvoiceUsageGraph(linktype: string, invoicedateguid: string, networkguid: string, linksourceguid: string, rtypeguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string, isobservationdrilldown: boolean): Promise<InvoiceCTNGraphViewModel[]> {
        return this.http.get<InvoiceCTNGraphViewModel[]>(this.appSettingService.apiurl + '/invoice/GetCTNInvoiceUsageGraphByDate?invoicedateguid=' + invoicedateguid + '&linktype=' + UtilityMethod.IfNull(linktype, '') + '&networkGuid=' + networkguid + '&linksourceguid=' + linksourceguid + '&rtypeGuid=' + rtypeguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&banguid=' + banGuid + '&isobservationdrilldown=' + isobservationdrilldown)
            .toPromise();
          
    }
    /**
     * Gets the invoice ctn for given company by Link Type
    */
    GetCTNInvoiceLoadGroupByLinkSource(linktype: string, rtypeGuid: string, invoicedateguid: string, networkguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string, isobservationdrilldown:boolean): Promise<Invoice[]> {
        return this.http.get<Invoice[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceFleetLoadByLinkSource?invoicedateguid=' + invoicedateguid + '&linktype=' + UtilityMethod.IfNull(linktype, '') + '&rtypeGuid=' + UtilityMethod.IfNull(rtypeGuid, '') + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&banguid=' + banGuid + '&isobservationdrilldown='+isobservationdrilldown)
            .toPromise();
           
    }


    IsMPAYExist(invoicedateguid: string): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + "/Invoice/IsMPAYExistAsnyc?invoicedateguid=" + invoicedateguid)
            .toPromise();
          
     }

    IsMPAYBetweenInvoiceDateExist(fromDate?: Date, ToDate?: Date): Promise<boolean> {
        return  this.http.get<boolean>(this.appSettingService.apiurl  + "/Invoice/IsMPAYBetweenInvoiceDateExist?fromDate=" + fromDate + '&toDate=' + ToDate)
            .toPromise();
           
    }
    
    IsMPAYExistForAny(): Promise<boolean> {
        return  this.http.get<boolean>(this.appSettingService.apiurl+ "/Invoice/IsMPAYExistAsnyc")
            .toPromise();
          
    }

    GetTopInvoiceCTNUsageGraphByLinkSource(linktype: string, rtypeGuid: string, invoicedateguid: string, networkguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string): Promise<InvoiceCTNGraphViewModel[]> {
        return  this.http.get<InvoiceCTNGraphViewModel[]>(this.appSettingService.apiurl + '/invoice/GetTopInvoiceCTNUsageGraphByLinkSource?invoicedateguid=' + invoicedateguid + '&linktype=' + linktype + '&rtypeGuid=' + UtilityMethod.IfNull(rtypeGuid, '') + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&banguid=' + banGuid)
            .toPromise();
           
    }

    /*
    * gets the available invoice data itemised summary for given company
    */
    //GetCTNInvoiceForItemisedSummary(invoicedateguid: string, mobilenumber: string, benguid?: string): Promise<Invoice[]> {
    //    return this.http.get(ApiSettings.api_url + '/Invoice/GetCTNInvoiceForItemisedSummary?invoicedateguid=' + invoicedateguid + '&mobileNumber=' + mobilenumber + '&benGUID=' + benguid)
    //        .toPromise()
    //        .then(response => response.json() as Invoice[]);
    //}

    /**
    * gets the available invoice data itemised summary for given company
    */
    GetCTNInvoiceItemised(invoicedateguid: string, mobilenumber: string, benguid?: string, banguid?: string
        , reportinggroup1guid?: string
        , reportinggroup2guid?: string
        , reportinggroup3guid?: string
        , reportinggroup4guid?: string
        , reportinggroup5guid?: string
        , reportinggroup6guid?: string
        , dashboardOption?: string
        , networkguid?: string
        , billingplatformguid?: string
        ): Promise<InvoiceItemisedViewModel[]> {
            return  this.http.get<InvoiceItemisedViewModel[]>(this.appSettingService.apiurl + '/Invoice/GetCTNInvoiceItemised?invoiceDateGuid=' + invoicedateguid
            + '&mobileNumber=' + mobilenumber
            + '&BenGuid=' + benguid
            + '&BANGuid=' + banguid        
            + '&reportingGroup1Guid=' + reportinggroup1guid        
            + '&reportingGroup2Guid=' + reportinggroup2guid        
            + '&reportingGroup3Guid=' + reportinggroup3guid        
            + '&reportingGroup4Guid=' + reportinggroup4guid        
            + '&reportingGroup5Guid=' + reportinggroup5guid        
            + '&reportingGroup6Guid=' + reportinggroup6guid        
            + '&dashboardOption=' + dashboardOption        
            + '&networkguid=' + networkguid        
            + '&billingplatformguid=' + billingplatformguid        
            )
            .toPromise();
          
    }
    IsBenValueExistForInvoiceMonth(invoicedateguid: string): Promise<boolean> {
        return  this.http.get<boolean>(this.appSettingService.apiurl + "/Invoice/IsBenValueExistAsnyc?invoicedateguid=" + invoicedateguid)
            .toPromise();
           
    }

    IsBanDisplay(invoicedateguid?: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/Invoice/IsBANDisplay?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
        
    }

    loadSpendTime(): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl + '/Invoice/loadSpendTime')
            .toPromise();
          
    }

    loadMyNumberInvoiceDropDown(): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl + '/Invoice/loadMyNumberInvoiceDropDown')
            .toPromise();
           
    }

    loadFleetDetails(invoiceDateId: number): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl + '/Invoice/loadFleetDetails?invoiceDateId=' + invoiceDateId)
            .toPromise();
           
    }

    loadAssetDetails(invoiceDateId: number): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl + '/Invoice/loadAssetDetails?invoiceDateId=' + invoiceDateId)
            .toPromise();
         
    }

    getUserDetailsForMyNumber(): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl  + '/User/GetUserDetailsForMyNumber')
            .toPromise();
          
    }

    getCTNBenBanDetails(mobilenumber: string): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl  + '/CTNDetail/GetCTNBenBanDetails?mobilenumber=' + mobilenumber)
            .toPromise();
          
    }

}