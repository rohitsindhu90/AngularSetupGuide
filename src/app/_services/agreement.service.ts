/// <reference path="authentication.service.ts" />

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { UserAgreement } from '../_models/useragreement';
import { Agreement } from '../_models/agreement';
import { CompanyUserAgreement } from '../_models/companyuseragreement';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root'
})
export class AgreementService {

    constructor(private http: HttpClient, private appSetting: AppSettingService) {
    }

    getActiveAgreement(): Promise<Agreement> {
        return this.http.get<Agreement>(`${this.appSetting.apiurl}/Agreement/LoadAgreementAsync`)
            .toPromise();

    }
    acceptAgreement(userAgreementGuid: string) {
        var body = JSON.stringify(userAgreementGuid);
        return this.http.post(`${this.appSetting.apiurl}/Agreement/AcceptAgreement`, body);

    }

    getUserAgreementList(): Promise<CompanyUserAgreement[]> {
        return this.http.get<CompanyUserAgreement[]>(`${this.appSetting.apiurl}/Agreement/GetUserAgreementList`)
            .toPromise();
    }

    CheckAgreementAcceptedAsnyc(userAgreementGuid: string): Promise<boolean> {
        // get users from api
        return this.http.get<boolean>(`${this.appSetting.apiurl}/Agreement/CheckAgreementAcceptedAsnyc?userAgreementGuid=` + userAgreementGuid)
            .toPromise();
    }

    CheckActiveAgreement(userAgreementGuid: string) {
        // get users from api
        return this.http.get(`${this.appSetting.apiurl}/Agreement/CheckActiveAgreement?userAgreementGuid=` + userAgreementGuid)
            .toPromise();
    }

    CreateAgreement(userAgreement: UserAgreement) {
        var body = JSON.stringify(userAgreement);
        return this.http.post<string>(`${this.appSetting.apiurl}/Agreement/CreateAgreement`, body);
    }



    resendCompanyAgreement(userAgreementGuid: string) {
        //var body = JSON.stringify(userAgreementGuid);
        return this.http.get<string>(`${this.appSetting.apiurl}/Agreement/ResendCompanyAgreement?userAgreementGuid=` + userAgreementGuid);
    }
}
