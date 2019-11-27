import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';



@Injectable({ providedIn: 'root' })
export class TermsConditionService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSetting: AppSettingService) {
    }


    IsTermsConditionAlreadyAccepted(): Promise<boolean> {
        return this.http.get<boolean>(this.appSetting.apiurl + "/TermsCondition/IsTermsConditionAlreadyAccepted")
            .toPromise();
    }

    GetTermsCondition(): Promise<string>
    {
        return this.http.get<string>(this.appSetting.apiurl + "/TermsCondition/GetTermsCondition")
            .toPromise();
            
    }

    AcceptTermsCondition(): Promise<boolean>{                               
        return this.http.post<boolean>(this.appSetting.apiurl + "/TermsCondition/Insert",'')
            .toPromise();
            
    }

}