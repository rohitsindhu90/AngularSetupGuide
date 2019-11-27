/// <reference path="authentication.service.ts" />

import { Injectable } from '@angular/core';
import { Company } from '../_models/company';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/observable';
import { AuthenticationService } from './authentication.service';
import { CompanyMaintenanceViewModel } from '../_models/company-maintenance';
import { CompanyBAN } from '../_models/companyban';
import { NewCompanySetUpViewModel, NewClientValidateViewModel } from '../_models/Admin/newcompanysetupviewmodel';
import { ResponseModel } from '../_models/response';
import { AppSettingService } from '../_common/appsetting.service';



@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient, private authenticationservice: AuthenticationService, private appSetting: AppSettingService) {
    }

    //filter the features based on user unique id stored in local storage retun objects of type feature from web api  method
    getCompanyDetails(): Promise<Company> {
        return this.http.get<Company>(`${this.appSetting.apiurl}/Company/GetCompanyDetailsAsync`)
            .toPromise();

    }

    getCompanyList(): Promise<Company[]> {
        return this.http.get<Company[]>(`${this.appSetting.apiurl}/Company/GetCompanyListAsync`)
            .toPromise();
    }

    getAllCompanyList(): Promise<Company[]> {
        return this.http.get<Company[]>(`${this.appSetting.apiurl}Company/GetAllCompanyListAsync`)
            .toPromise();

    }



    //SetCompanyDetailsInStorage(localStorage: UserDetail): Promise<UserDetail> {
    //    return this.authenticationservice.regenerateToken(localStorage);
    //}

    checkCompanyExists(company: string): Promise<boolean> {
        return this.http.get<boolean>(`${this.appSetting.apiurl}/Company/CheckCompanyExistsAsync?company=` + company)
            .toPromise();

    }

    getCompanyUserDetailByCompanyGuid(companyGuid: string): Promise<CompanyMaintenanceViewModel> {
        return this.http.get<CompanyMaintenanceViewModel>(`${this.appSetting.apiurl}/Company/GetCompanyUserDetailByCompanyGuid?companyGuid=` + companyGuid)
            .toPromise();
    }

    updateCompanyUserDetail(model: CompanyMaintenanceViewModel): Promise<string> {
        var body = JSON.stringify(model);
        return this.http.post<string>(`${this.appSetting.apiurl}/Company/UpdateCompanyUserDetail`, body)
            .toPromise();

    }

    GetCompanyBANDetailByCompanyGuidAsync(companyGuid: string): Promise<CompanyBAN[]> {
        return this.http.get<CompanyBAN[]>(`${this.appSetting.apiurl}/Company/GetCompanyBANDetailByCompanyGuidAsync?companyGuid=` + companyGuid)
            .toPromise();
    }

    UpdateCompanyBANDetail(model: CompanyBAN): Promise<string> {
        var body = JSON.stringify(model);
        return this.http.post<string>(`${this.appSetting.apiurl}/Company/UpdateCompanyBANDetail`, body)
            .toPromise();

    }

    GetCompanyBANDetailByIDAsync(id: number): Promise<CompanyBAN> {
        return this.http.get<CompanyBAN>(`${this.appSetting.apiurl}/Company/GetCompanyBANDetailByIDAsync?id=` + id)
            .toPromise();
    }
    GetRelatedCompanyListAsync(companyid: number): Promise<Company[]> {
        return this.http.get<Company[]>(`${this.appSetting.apiurl}/Company/GetRelatedCompanyListAsync?companyID=` + companyid)
            .toPromise();

    }

    newCompanySetUp(model: NewCompanySetUpViewModel): Promise<ResponseModel> {

        var body = JSON.stringify(model);
        return this.http.post<ResponseModel>(`${this.appSetting.apiurl}/Company/NewCompanySetUpAsync`, body)
            .toPromise();


    }

    getNewCompanyFileUploadUrl() {
        return `${this.appSetting.apiurl}/Company/NewCompanyFileUploadsAync`;
    }

    processValidateData(model: NewClientValidateViewModel): Promise<ResponseModel> {

        var body = JSON.stringify(model);
        return this.http.post<ResponseModel>(`${this.appSetting.apiurl}/Company/ValidateDataAsync`, body)
            .toPromise();

    }

    getNewCompanySetupProtoType(): Observable<any> {
        return this.http.get<any>(`${this.appSetting.apiurl}/Company/GetNewCompanySetupProtoTypeAsync`, { responseType: 'blob' as 'json' })

    }
    //TODO
    getNewCompanySetupIPAddress(): string {
        return this.appSetting.newcompanyip;
    }

    getValidationExcel(guid: string, newClientDataType: number) {

        return this.http.get(`${this.appSetting.apiurl}/Company/GetValidationExcelAsync?guid=` + guid + '&newClientDataType=' + newClientDataType, { responseType: 'blob' });


    }
}
