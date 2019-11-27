import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { SavedReportViewModel, ScheduleReportViewModel, ViewReportViewModel, SendNowViewModel } from '../_models/schedulereportviewmodel'

@Injectable({
    providedIn: 'root'
})
export class ScheduleReportService {
    constructor(private http: HttpClient,
        private appSettingService: AppSettingService,) {
    }


    loadScheduleReportByGUID(reportGuid: string): Promise<ScheduleReportViewModel> {
        return this.http.get<ScheduleReportViewModel>(this.appSettingService.apiurl + '/ScheduleReport/LoadScheduleReportByGUIDAsync?reportGuid=' + reportGuid)
            .toPromise();
    }

    saveScheduleReport(model: ScheduleReportViewModel) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/ScheduleReport/SaveScheduleReportAsync', body);
    }

    getSavedScheduleReports(): Promise<SavedReportViewModel[]> {
        return this.http.get<SavedReportViewModel[]>(this.appSettingService.apiurl + '/ScheduleReport/GetSavedScheduleReportsAsync')
            .toPromise();
    }

    deleteScheduleReportByGuid(model: string) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/ScheduleReport/DeleteScheduleReportByGuidAsync', body);

    }

    getViewRepotsByGuidID(reportGuid: string): Promise<ViewReportViewModel[]> {
        return this.http.get<ViewReportViewModel[]>(this.appSettingService.apiurl + '/ScheduleReport/GetViewRepotsByGuidIDAsync?reportGuid=' + reportGuid)
            .toPromise();
    }

    getEmailToByGuidId(reportGuid: string): Promise<SendNowViewModel> {
        return this.http.get<SendNowViewModel>(this.appSettingService.apiurl + '/ScheduleReport/GetEmailToByGuidIdAsync?reportGuid=' + reportGuid)
            .toPromise();
    }

    sendNowByGuid(model: string) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/ScheduleReport/SendNowByGuidAsync', body);
    }
}