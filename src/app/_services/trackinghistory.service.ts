import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { CompanyAccessHistory } from "../_models/report/company-access-history";


@Injectable(
    {
        providedIn:'root'
    }
)
export class TrackingHistoryService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor( private http: HttpClient,private appSettingService: AppSettingService) {
    }

    /**
     * Gets the tracking report detail list for the given company
     * @param companyId:  companyid
      * @param fromDate: fromDate
      * @param toDate: toDate
     */
    getCompanyAccessReportListByCompany(companyGuid: string, fromDate: string, toDate: string): Promise<CompanyAccessHistory[]> {
        return this.http.get<CompanyAccessHistory[]>(this.appSettingService.apiurl + '/report/GetCompanyAccessReportListByCompanyGuidAsync?CompanyGuid=' + companyGuid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }


    /**
     * Get Report Tracking Grid Data
     * @param fromdate: From Date
    * @param todate: To Date
     */
    getCompanyAccessReportListAsync(fromDate: string, toDate: string): Promise<CompanyAccessHistory[]> {
        return this.http.get<CompanyAccessHistory[]>(this.appSettingService.apiurl + '/Report/GetCompanyTrackReportListAsync?fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

  /**
     * Gets the tracking report detail drill list for the given company and user
     * @param companyId: The companyid id
     */
    getCompanyAccessDetailDrillReportListAsync(companyGuid: string, userGuid: string, fromDate: string, toDate: string): Promise<CompanyAccessHistory[]> {
        
        return this.http.get<CompanyAccessHistory[]>(this.appSettingService.apiurl + '/report/GetCompanyAccessReportListByUserGuidAsync?CompanyGuid=' + companyGuid + '&userGuid=' + userGuid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

}