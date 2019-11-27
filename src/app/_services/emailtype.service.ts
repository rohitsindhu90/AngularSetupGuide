/// <reference path="../_common/utility-method.ts" />
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmailConfigViewModel } from '../_models/emailconfig.model';
import { AppSettingService } from '../_common/appsetting.service';
@Injectable({
    providedIn: 'root'
})

export class EmailTypeService {
    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }


    getEmailTypeList(): Promise<EmailConfigViewModel[]> {
        return this.http.get<EmailConfigViewModel[]>(this.appSettingService.apiurl + '/emailtype/getemailtypelistasync')
            .toPromise();
    }


    SaveEmailTypes(emailConfigViewModel: EmailConfigViewModel[]) {

        var body = JSON.stringify(emailConfigViewModel);
        return this.http.post(this.appSettingService.apiurl + '/emailtype/SaveEmailType', body);
    }

}
