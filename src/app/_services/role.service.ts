import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserRole, } from '../_models/user-roles';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSetting: AppSettingService) {
    }

    /**
     * Gets the active costcentre list for the given company
     * @param companyId: The companny id
     */
    getRoleList(): Promise<UserRole[]> {
        return this.http.get<UserRole[]>(this.appSetting.apiurl + '/Role/LoadRoleListAsync')
            .toPromise();
            //.then(response => response.json() as UserRole[]);
    }

    LoadRoleByRoleID(roleID: number): Promise<UserRole> {
        return this.http.get<UserRole>(this.appSetting.apiurl + '/Role/LoadRoleByRoleIDAsync?roleID=' + roleID)
            .toPromise();
            //.then(response => response.json() as UserRole);
    }


    LoadFeatureRoleTreeViewByRoleID(roleID?: number): Promise<any> {
        return this.http.get<any>(this.appSetting.apiurl + '/Role/LoadFeatureRoleTreeViewByRoleIDAsync?roleID=' + roleID)
            .toPromise();
            //.then(response => response.json() as any);
    }
    SaveRole(userRole: UserRole, lstOfFeatureRole: any) {
        var obj = {
            "id": userRole.id,
            "roledescription": userRole.roledescription,
            "active": userRole.active,
            "FeatureRoleTree": lstOfFeatureRole,
            "defaultfeatureid": userRole.defaultfeatureid
        };

        var body = JSON.stringify(obj);    
        return this.http.post(this.appSetting.apiurl+ '/Role/SaveRole', body);
            // .map((response: Response) => 
            //       response
            // );
    }
    GetUserWithUserCount(): Promise<UserRole[]> {
        return this.http.get<UserRole[]>(this.appSetting.apiurl+ '/Role/GetUserWithUserCount')
            .toPromise();
            //.then(response => response.json() as UserRole[]);
    }   

    //getUserRoleWiseReport(): Promise<UserRole[]> {
    //    return this.http.get(ApiSettings.api_url + '/Role/GetUserRoleWiseReportAsync')
    //        .toPromise() 
    //        .then(response => response.json() as UserRole[]);
    //}
}
