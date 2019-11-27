import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

// import { ApiSettings } from '../_common/api-settings';
import { Client } from '../_models/client';
import { ClientControl } from '../_models/clientcontrol';
import { AppSettingService } from '../_common/appsetting.service';


@Injectable({
    providedIn: 'root'
})
export class ClientControlService {

  constructor(private http: HttpClient, private appSetting: AppSettingService) {
    }

    /**
    * Gets the client info
 
    */
    GetClientDetail(): Promise<Client[]> {
        return this.http.get<Client[]>(`${this.appSetting.apiurl}/ClientConfig/GetClientDetailAsync`)
            .toPromise()
            .then(response => response );
    }

    /**
   * Gets the client Controls info
 
   */
    GetClientControls(): Promise<ClientControl[]> {
        return this.http.get<ClientControl[]>(`${this.appSetting.apiurl}/ClientConfig/GetClientControlsListAsync`)
            .toPromise()
            .then(response => response);
    }
    SaveClientConfig(clientinfo: any, clientcontrolinfo: any, reportinggroupviewmodel: any, featuretree: any) {
        var obj = {
            "clientlist": clientinfo,
            "clientcontrollist": clientcontrolinfo,
            "reportinggrouplist": reportinggroupviewmodel,
            "featurelist": featuretree
        };

        var body = JSON.stringify(obj);
        return this.http.post(`${this.appSetting.apiurl}/ClientConfig/SaveClientConfig`, body);
    }

    GetClientControlByKey(clientControlKey: number): Promise<ClientControl> {
        return this.http.get<ClientControl>(`${ this.appSetting.apiurl }/ClientConfig/GetClientControlByKeyAsync?clientControlKey=` + clientControlKey)
            .toPromise()
            .then(response => response )
    }

    IsReportingGroupCascade(): Promise<{ iscascade: boolean, cascadevalue: number }> {
        return this.http.get<{ iscascade: boolean, cascadevalue: number }>(`${this.appSetting.apiurl }/ClientConfig/IsReportingGroupCascadeAsync`)
            .toPromise()
            .then(response => response )
    }

    passwordRegexPattern(): Promise<{ passwordregex: string, passwordmessage: string }> {
        return this.http.get<{ passwordregex: string, passwordmessage: string }>(`${this.appSetting.apiurl }/ClientConfig/PasswordRegexPatternAsync`)
            .toPromise()
            .then(response => response )
    }
}
