import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { OverUsageReportModel } from "../_models/report/over-usage-report.model";
import { AppSettingService } from 'src/app/_common/appsetting.service';

@Injectable({
    providedIn:'root'
})

export class OverUsageReportService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }

    getOverUsageReportAsync(InvoiceMonth: string, Status: string, Networkid: string, billingplatformid: string ): Promise<OverUsageReportModel[]> {
        return this.http.get<OverUsageReportModel[]>(this.appSettingService.apiurl + '/Report/GetOverUsageReportAsync?InvoiceMonth=' + InvoiceMonth + '&Status=' + Status + '&Networkid=' + Networkid + '&billingplatformid=' + billingplatformid)                
            .toPromise();
    }


    save(data: OverUsageReportModel): Promise<boolean> {                        
        var body = JSON.stringify(data);
        return this.http.post<boolean>(this.appSettingService.apiurl + '/Invoice/Save',body)
            .toPromise();
    }


    getCompanyDataAllowance(InvoiceMonth: string, NetworkGuid: string, billingplatformguid: string): Promise<number> {
        
        return this.http.get<number>(this.appSettingService.apiurl + '/Invoice/GetCompanyDataAllowance?InvoiceMonth=' + InvoiceMonth + '&Networkid=' + NetworkGuid
            + '&billingplatformid=' + billingplatformguid)
            .toPromise();
    }

    getDataAccessLimitGridData(): Promise<any[]> {

        return this.http.get<any[]>(this.appSettingService.apiurl + '/Report/GetDataAccessLimitGridDataAsync')
            .toPromise();
    }
}