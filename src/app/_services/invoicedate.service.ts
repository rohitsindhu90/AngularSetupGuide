import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';
import { InvoiceDate } from '../_models/InvoiceDate';
import 'rxjs/add/operator/toPromise';
import { InvoiceLoadMonitoring } from '../_models/invoiceloadmonitoring';

@Injectable({
    providedIn: 'root',
    
  })
export class InvoiceDateService {

    /**
     * Constructor to inject services
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }

    /**
     * Gets the invoice month for given company
     * @param companyId: The companyId
     */
    getInvoiceMonth(): Promise<InvoiceDate[]> {
        return this.http.get<InvoiceDate[]>(this.appSettingService.apiurl + '/Invoice/GeInvoiceDateListAsync')
            .toPromise();
           
     
    }

    /**
  * Gets the last four invoice month by current month
  */
    getInvoiceMonthList(): Promise<InvoiceDate[]> {
        return this.http.get<InvoiceDate[]>(this.appSettingService.apiurl + '/Invoice/GeInvoiceDateList')
            .toPromise();
           
    }

        /**
     * Gets the last four invoice month by current month
     */
    geInvoiceMonitoringData(): Promise<InvoiceLoadMonitoring[]> {
        return this.http.get<InvoiceLoadMonitoring[]>(this.appSettingService.apiurl + '/InvoiceUpload/GetInvoiceLoadMonitoringList')
            .toPromise();
           
    }

    validateInvoiceDateRange(fromdate: Date, todate: Date): string {
        return (fromdate > todate)?'From date must less than to date.':'';
    }

    getInvoiceDateList(): Promise<string[]> {
        return this.http.get<string[]>(this.appSettingService.apiurl + '/Invoice/GetInvoiceDateListAsync')
            .toPromise();
           
    }

    getNetworkList(): Promise<any[]> {
        return this.http.get<any[]>(this.appSettingService.apiurl + '/Invoice/GetNetworks')
            .toPromise();
         

    }

    getBillingPlatforms(networkid: string): Promise<any[]> {
        return this.http.get<any[]>(this.appSettingService.apiurl + '/Invoice/GetBillingplatform?networkid=' + networkid)
            .toPromise();
     
    }

}