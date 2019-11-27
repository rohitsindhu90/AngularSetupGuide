
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PermissionSet, PermissionSetNew, } from '../_models/access-group/permissionset';
import { PermissionGroup } from '../_models/access-group/permissiongroup';
import { PermissionSetMainteneance } from '../_models/access-group/permissionsetmaintenance';
import { UtilityMethod } from '../_common/utility-method';
import { ResponseModel } from '../_models/response';
import { PermissionSetGroupMaintenance } from '../_models/access-group/permissionsetgroupmaintenance';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root'
})
export class AccessGroupService {
    constructor(private http: HttpClient, private appSetting: AppSettingService) {
    }

    getPermissionSet(active: boolean = null): Promise<PermissionSet[]> {

        return this.http.get<PermissionSet[]>(this.appSetting.apiurl + '/Permission/GetPermissionSetAsync?active=' + UtilityMethod.IfNull(active))
            .toPromise();
    }


    getPermissionSetNew(active: boolean = null, arrStr: number[]): Promise<PermissionSetNew[]> {
        return this.http.get<PermissionSetNew[]>(`${this.appSetting.apiurl}/Permission/GetPermissionSetAsyncNew?active=` + UtilityMethod.IfNull(active) + '&accesstypelist=' + arrStr)
            .toPromise();

    }


    getPermissionGroup(active: boolean = null): Promise<PermissionGroup[]> {
        return this.http.get<PermissionGroup[]>(`${this.appSetting.apiurl}/Permission/GetPermissionGroupAsync?active=` + UtilityMethod.IfNull(active))
            .toPromise();
    }

    GetPermissionSetDetailAsync(pSetID: number): Promise<PermissionSetMainteneance> {
        return this.http.get<PermissionSetMainteneance>(`${this.appSetting.apiurl}/Permission/GetPermissionSetDetailAsync?permissionSetID=` + pSetID)
            .toPromise();

    }

    UpdatePermissionSetDetailAsync(model: PermissionSetMainteneance): Promise<ResponseModel> {
        var body = JSON.stringify(model);
        return this.http.post<ResponseModel>(`${this.appSetting.apiurl}/Permission/UpdatePermissionSetDetailAsync`, body)
            .toPromise();

    }
    GetPermissionSetUserRelAsync(userID: number): Promise<number[]> {
        return this.http.get<number[]>(`${this.appSetting.apiurl}/Permission/GetPermissionSetUserRelAsync?userID=` + userID)
            .toPromise();

    }


    GetPermissionSetUserRelAsyncNew(userID: number): Promise<PermissionSetNew[]> {
        return this.http.get<PermissionSetNew[]>(`${this.appSetting.apiurl}/Permission/GetPermissionSetUserRelAsyncNew?userID=` + userID)
            .toPromise();

    }


    GetPermissionGroupForUserAsync(userID: number): Promise<number[]> {
        return this.http.get<number[]>(`${this.appSetting.apiurl}/Permission/GetPermissionGroupForUserAsync?userID=` + userID)
            .toPromise();

    }

    GetPermissionGroupForCompanyAsync(): Promise<number[]> {
        return this.http.get<number[]>(`${this.appSetting.apiurl}/Permission/GetPermissionGroupForCompanyAsync`)
            .toPromise();

    }

    GetRecordByPermissionSetGroupID(guid: string): Promise<PermissionSetGroupMaintenance> {
        return this.http.get<PermissionSetGroupMaintenance>(`${this.appSetting.apiurl}/Permission/GetRecordByPermissionSetGroupID?pSetGroupGuid=` + guid)
            .toPromise();

    }

    GetDataByPermissionGroupID(id: number): Promise<any> {
        return this.http.get(`${this.appSetting.apiurl}/Permission/GetDataByPermissionGroupID?pGroupID=` + id)
            .toPromise();

    }

    UpdatePermissionSetGroupRelRecord(data: any): Promise<ResponseModel> {
        var body = JSON.stringify(data);
        return this.http.post<ResponseModel>(`${this.appSetting.apiurl}/Permission/UpdatePermissionSetGroupRelRecord`, body)
            .toPromise();

    }
}
