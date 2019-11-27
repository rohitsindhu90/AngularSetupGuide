import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { Injectable } from '@angular/core';
import { CompanyInformationViewModel } from "../_models/companyinformationviewmodel";

import 'rxjs/add/operator/toPromise';

@Injectable()
export class CompanyInformationService {
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    getCompanyInformation(): Promise<CompanyInformationViewModel> {
        return this.http.get<CompanyInformationViewModel>(this.appSettingService.apiurl + '/CompanyInformation/GetCompanyInformationAsync')
            .toPromise();
    }

    updateCompanyInformation(model: CompanyInformationViewModel) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/UpdateCompanyInformationAsync', model)
            .toPromise();
    }
}