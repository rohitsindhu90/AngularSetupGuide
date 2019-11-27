import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { DashboardChart,} from '../_models/dashboardchart';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private http: HttpClient,private appSettingService: AppSettingService) {

    }

    /**
    * binds the charts for user company and given  
    * @param titleName:
    * @param networkGuid:
     * @param billingPlatFormGuid:
       @param departmentGuid:
       @param costCentreGuid:
       @param benGuid:
    */

    GetSpendUsageAnalysis(titleName: string, networkGuid: string, billingPlatFormGuid: string, reportinggroup1Guid: string, reportinggroup2Guid: string, reportinggroup3Guid: string, reportinggroup4Guid: string, reportinggroup5Guid: string, reportinggroup6Guid: string, benGuid: string, banGuid: string, mobilenumber: string, invoicemonthcount: string, invoiceMonthID: string): Promise<DashboardChart> {
        return this.http.get<DashboardChart>(this.appSettingService.apiurl + '/dashboard/GetSpendUsageAnalysis?type=' + titleName
            + '&networkGuid=' + networkGuid
            + '&billingPlatFormGuid=' + billingPlatFormGuid
            + '&reportinggroup1Guid=' + reportinggroup1Guid
            + '&reportinggroup2Guid=' + reportinggroup2Guid
            + '&reportinggroup3Guid=' + reportinggroup3Guid
            + '&reportinggroup4Guid=' + reportinggroup4Guid
            + '&reportinggroup5Guid=' + reportinggroup5Guid
            + '&reportinggroup6Guid=' + reportinggroup6Guid
            + '&benGuid=' + benGuid
            + '&banGuid=' + banGuid
            + '&mobilenumber=' + mobilenumber
            + '&invoicemonthcount=' + invoicemonthcount
            + '&invoiceMonthID=' + invoiceMonthID

        )
            .toPromise();
           // .then(response => response.json() as DashboardChart);
    }

    GetInvoiceMonths(invoicemonthcount: string) {
        return this.http.get(this.appSettingService.apiurl + '/dashboard/GetInvoiceMonths?invoicemonthcount=' + invoicemonthcount
        )
            .toPromise();
            //.then(response => response.json() as InvoiceDate[]);
    }


    GetLastMonthDataAnalysis(networkGuid: string, billingPlatFormGuid: string, reportinggroup1Guid: string, reportinggroup2Guid: string, reportinggroup3Guid: string, reportinggroup4Guid: string, reportinggroup5Guid: string, reportinggroup6Guid: string, benGuid: string, banGuid: string, mobilenumber: string, invoicemonthcount: string, invoiceMonthID: string): Promise<DashboardChart> {
        return this.http.get<DashboardChart>(this.appSettingService.apiurl + '/dashboard/GetLastMonthDataAnalysis?'
            + '&networkGuid=' + networkGuid
            + '&billingPlatFormGuid=' + billingPlatFormGuid
            + '&reportinggroup1Guid=' + reportinggroup1Guid
            + '&reportinggroup2Guid=' + reportinggroup2Guid
            + '&reportinggroup3Guid=' + reportinggroup3Guid
            + '&reportinggroup4Guid=' + reportinggroup4Guid
            + '&reportinggroup5Guid=' + reportinggroup5Guid
            + '&reportinggroup6Guid=' + reportinggroup6Guid
            + '&benGuid=' + benGuid
            + '&banGuid=' + banGuid
            + '&mobilenumber=' + mobilenumber
            + '&invoicemonthcount=' + invoicemonthcount
            + '&invoiceMonthID=' + invoiceMonthID
        )
            .toPromise();
            //.then(response => response.json() as DashboardChart);
    }

    ObservationData(networkGuid: string, billingPlatFormGuid: string, reportinggroup1Guid: string, reportinggroup2Guid: string, reportinggroup3Guid: string, reportinggroup4Guid: string, reportinggroup5Guid: string, reportinggroup6Guid: string, benGuid: string, banGuid: string, mobilenumber: string, invoiceMonthID: string): Promise<DashboardChart> {
        return this.http.get<DashboardChart>(this.appSettingService.apiurl+ '/dashboard/ObservationData?'
            + '&networkGuid=' + networkGuid
            + '&billingPlatFormGuid=' + billingPlatFormGuid
            + '&reportinggroup1Guid=' + reportinggroup1Guid
            + '&reportinggroup2Guid=' + reportinggroup2Guid
            + '&reportinggroup3Guid=' + reportinggroup3Guid
            + '&reportinggroup4Guid=' + reportinggroup4Guid
            + '&reportinggroup5Guid=' + reportinggroup5Guid
            + '&reportinggroup6Guid=' + reportinggroup6Guid
            + '&benGuid=' + benGuid
            + '&banGuid=' + banGuid
            + '&mobilenumber=' + mobilenumber
            + '&invoiceMonthID=' + invoiceMonthID
        )
            .toPromise();
            //.then(response => response.json() as DashboardChart);
    }

    showPDF(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/Dashboard/ShowPDF')
            .toPromise();
            //.then(response => response.json() as boolean);
    }


}