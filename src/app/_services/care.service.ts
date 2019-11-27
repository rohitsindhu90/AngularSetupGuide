import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
//import 'rxjs/add/operator/toPromise';
import { CareIssueType } from '../_models/care/careissueType';
import { CareReportType } from '../_models/care/CareReportType';
import { FaultReason } from '../_models/care/FaultReason';
import { CareViewModel } from '../_models/care/care';

@Injectable({
    providedIn: 'root'
})
export class CareService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    //getAddressList(): Promise<AddressModel[]>{
    //    return this.http.get(this.appSettingService.apiurl + '/Address/GetAddressList')
    //        .toPromise()
    //        .then(data => data.json() as AddressModel[]);
    //}


    getIssueTypeList(): Promise<CareIssueType[]> {
        return this.http.get<CareIssueType[]>(this.appSettingService.apiurl + '/CareEnquiry/GetIssueTypeListAsync')
            .toPromise();
    }

    getReportTypeByIssueTypeID(issueTypeID: number): Promise<CareReportType[]> {
        return this.http.get<CareReportType[]>(this.appSettingService.apiurl + '/CareEnquiry/GetReportTypeByIssueTypeIDAsync?issueTypeID=' + issueTypeID)
            .toPromise();
    }

    getFaultReasonByReportTypeID(reportTypeID: number): Promise<FaultReason[]> {
        return this.http.get<FaultReason[]>(this.appSettingService.apiurl + '/CareEnquiry/GetFaultReasonByReportTypeIDAsync?reportTypeID=' + reportTypeID)
            .toPromise();
    }
    saveCareEnqiury(careViewModel: CareViewModel) {

        var body = JSON.stringify(careViewModel);
        return this.http.post(this.appSettingService.apiurl + '/CareEnquiry/SaveCareEnquiryAsync', body);
    }

    getCareLogReportAsync(startDate: string, endDate: string): Promise<CareViewModel[]> {
        return this.http.get<CareViewModel[]>(this.appSettingService.apiurl + '/CareEnquiry/GetCareLogReportAsync?startDate=' + startDate + '&endDate=' + endDate)
            .toPromise();
    }

    GetCareEnquiryByID(careEnquiryID: number): Promise<CareViewModel> {
        return this.http.get<CareViewModel>(this.appSettingService.apiurl + '/CareEnquiry/GetCareEnquiryByID?careEnquiryID=' + careEnquiryID)
            .toPromise();
    }

}
