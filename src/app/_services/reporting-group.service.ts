import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ReportingGroupBaseViewModel } from '../_models/reporting-group-base';
import { AppSettingService } from '../_common/appsetting.service';
import { ResponseModel } from '../_models/response';
import { ReportingGroupRel } from '../_models/reportinggrouprelmodel';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroupService {
    /**
  * The constructor to inejct service
  * @param http: The Http service to inject
  */
    constructor(private http: HttpClient, private appSettingService:AppSettingService ) {
    }

    /**
     * Gets the active costcentre list for the given company
     * @param companyId: The companny id
     */
    getReportingGroupListAsync(reortngGroupMasterID: number, active?: boolean): Promise<ReportingGroupBaseViewModel[]> {
        return this.http.get<ReportingGroupBaseViewModel[]>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupListAsync?reortngGroupMasterID=' + reortngGroupMasterID + '&active=' + active)
            .toPromise();
            
    }

    GetReportingGroupDetailByID(reortngGroupMasterID:number, reportingGroupDetailID:number): Promise<ReportingGroupBaseViewModel> {
        return this.http.get<ReportingGroupBaseViewModel>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupDetailByID?reortngGroupMasterID=' + reortngGroupMasterID + '&reportingGroupDetailID=' + reportingGroupDetailID)
            .toPromise();
           
    }

    Save(model: ReportingGroupBaseViewModel): Promise<ResponseModel> {
        let body = JSON.stringify(model);
        return this.http.post<ResponseModel>(this.appSettingService.apiurl + '/ReportingGroup/Save', body)
            .toPromise();
           
    }

    CheckActiveCTNLinked(reportingGroupDescription: string, reportingGroupDetailID: number): Promise<boolean>{
        return this.http.get<boolean>(this.appSettingService.apiurl + '/ReportingGroup/CheckActiveCTNLinked?reportingGroupDescription=' + reportingGroupDescription + '&reportingGroupDetailID=' + reportingGroupDetailID)
            .toPromise();
           
    }

    CheckReportingGroupNameExist(reortngGroupMasterID: number, reportingGroupDetailID: number, description: string, reportingDisplayName:string): Promise<ResponseModel>{
        return this.http.get<ResponseModel>(this.appSettingService.apiurl + '/ReportingGroup/CheckReportingGroupNameExist?reortngGroupMasterID=' + reortngGroupMasterID + '&reportingGroupDetailID=' + reportingGroupDetailID + '&description=' + description + '&reportingDisplayName=' + reportingDisplayName)
            .toPromise();
            
    }

    getReportingGroup1DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup1DetailByGuid?guid=' + guid)
            .toPromise();
            
    }
    getReportingGroup2DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup2DetailByGuid?guid=' + guid)
            .toPromise();
            
    }
    getReportingGroup3DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup3DetailByGuid?guid=' + guid)
            .toPromise();
            
    }
    getReportingGroup4DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup4DetailByGuid?guid=' + guid)
            .toPromise();
            
    }
    getReportingGroup5DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup5DetailByGuid?guid=' + guid)
            .toPromise();
            
    }
    getReportingGroup6DetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroup6DetailByGuid?guid=' + guid)
            .toPromise();
            
    }

    getReportingListForRGGroupAsync(active?: boolean): Promise<ReportingGroupBaseViewModel[]> {
        return this.http.get<ReportingGroupBaseViewModel[]>(this.appSettingService.apiurl + '/ReportingGroup/getReportingListForRGGroupAsync?active=' + active)
            .toPromise();
            
    }

    getHistoricCostByRG(reportinggroupguid: string, networkguid?: string, billingplatformguid?: string, banGuid?: string, benguid?: string): Promise<any[]> {
        return this.http.get<any[]>(this.appSettingService.apiurl + '/ReportingGroup/GetHistoryCostByReportingGroup?reportingGroupGuid=' + reportinggroupguid + '&networkGuid=' + networkguid + '&billingPlatformGuid=' + billingplatformguid + '&banGuid=' + banGuid + '&benGuid=' + benguid)
            .toPromise();
            
    }

    getReportingGroupDetailByGuid(guid: string): Promise<string> {
        return this.http.get<string>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupDetailByGuid?guid=' + guid)
            .toPromise();
            
    }

    getReportingGroupRelationShip(): Promise<number> {
        return this.http.get<number>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupRelationShip')
            .toPromise();
            
    }


    setRelation(relation: number): Promise<boolean> {
        let rel = {
            relation: relation
        };
        let body = JSON.stringify(rel);
        
        return this.http.post<boolean>(this.appSettingService.apiurl + '/ReportingGroup/SetReportingGroupRelationShip?relation=' + relation, null)
            .toPromise();
            
    }

    getReportingGroupRel(): Promise<ReportingGroupRel[]> {
        return this.http.get<ReportingGroupRel[]>(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupRel')
            .toPromise();
            
    }

    SaveReportingGroupRel(model: any): Promise<boolean> {
        let body = JSON.stringify(model);
        return this.http.post<boolean>(this.appSettingService.apiurl + '/ReportingGroup/SaveReportingGroupRel', body)
            .toPromise();
            
    }

    getReportingGroupRelDetails(parentid: number, masterid: number, currentItem: string): Promise<any> {
        return this.http.get(this.appSettingService.apiurl + '/ReportingGroup/GetReportingGroupRelDetails?parentId=' + parentid + '&masterId=' + masterid + '&currentItem=' + currentItem)
            .toPromise();
            
    }
}