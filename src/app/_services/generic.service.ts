import { Injectable } from '@angular/core';
import { CostCentre } from '../_models/costcentre';
import { Department } from '../_models/department';
import { ChargeGroup } from '../_models/chargegroup';
import { Team } from '../_models/team';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { ThemeModel } from '../_models/theme';
import { ConnectionType } from '../_models/ConnectionType';
import { CTNStatus } from '../_models/ctnstatus';
import { EffectiveDateModel } from '../_models/effective-date.model';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { PaymentMethodViewModel } from '../_models/paymentmethodviewmodel';
import { ReportingGroupBaseViewModel } from '../_models/reporting-group-base';
import { ReportingGroupRelMasterModel } from '../_models/reportinggrouprelmaster.model';
import { ProductTypeViewModel } from '../_models/producttype.model';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({ providedIn: 'root' })
export class GenericService {

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
    getCostCentreList(): Promise<CostCentre[]> {
        return this.http.get<CostCentre[]>(`${this.appSetting.apiurl}/Generic/GetCostCentreListAsync`)
            .toPromise();
    }

    /**
    * Gets the active department list for the given company
    * @param companyId: The companny id
    */
    getDepartmentList(): Promise<Department[]> {
        return this.http.get<Department[]>(`${this.appSetting.apiurl}/Generic/GetDepartmentListAsync`)
            .toPromise();
    }

    /**
    * Checks the billing platform more than 1 exists for the given company
    * @param companyId: The companny id
    */
    IsBillingExistForCompanyAsnyc(networkguid?: string, fromDate?: Date, toDate?: Date, invoiceDateGuid?: string): Promise<boolean> {
        return this.http.get<boolean>(`${this.appSetting.apiurl}/Generic/IsBillingExistForCompanyAsnyc?fromDate=` + fromDate + '&toDate=' + toDate + '&invoiceDateGuid=' + invoiceDateGuid + '&networkguid=' + networkguid)
            .toPromise();
            
    }

    CheckMultipleActiveBillingPlatform(networkguid?: string): Promise<boolean> {
        return this.http.get<boolean>(`${this.appSetting.apiurl}/Generic/CheckMultipleActiveBillingPlatform?&networkguid=` + networkguid)
            .toPromise();
            
    }

    /**
    * Gets the active charge list 
  
    */
    GetActiveChareGroupList(): Promise<ChargeGroup[]> {
        return this.http.get<ChargeGroup[]>(`${this.appSetting.apiurl}/Generic/GetActiveChareGroupList`)
            .toPromise();
            
    }

    /**
* Gets the Team list 
 
*/
    GetTeamList(): Promise<Team[]> {
        return this.http.get<Team[]>(`${ this.appSetting.apiurl }/Generic/GetTeams`)
            .toPromise();
            
    }

    UpdateDynamicTheme(theme:ThemeModel) {
        // let themeModel: any = {
        //     themeguid: themeGuid,
        //     cssvar: dynamicJSON.toString()
        // }; 
        return this.http.post(`${this.appSetting.apiurl}/Generic/UpdateDynamicThemeJson`, JSON.stringify(theme));
    }

    /**
* Gets the Theme by Guid 
 
*/
    GetThemeByGuid(themeGuid: string): Promise<ThemeModel[]> {
        return this.http.get <ThemeModel[]>(`${this.appSetting.apiurl }/Generic/GetThemeByGuidAsync?themeGuid=` + themeGuid)
            .toPromise();
    }

    /**
* Gets the Theme list 
 
*/
    GetThemeList(): Promise<ThemeModel[]> {
        return this.http.get<ThemeModel[]>(`${this.appSetting.apiurl }/Generic/GetThemeListAsync`)
            .toPromise();
            
    }


    /**
   * Gets the Connection Type List
 
   */
    GetConnectionTypeList(active?: boolean): Promise<ConnectionType[]> {
        return this.http.get<ConnectionType[]>(`${this.appSetting.apiurl }/Generic/GetConnectionTypeListAsync?active=` + active)
            .toPromise();
    }

    /**
 * Gets the Connection Type List
 
 */
    GetCTNStatusList(): Promise<CTNStatus[]> {
        return this.http.get<CTNStatus[]>(`${ this.appSetting.apiurl }/Generic/GetCTNStatusListAsync`)
            .toPromise();
    }

    GetEffectiveDate(lastMonthCount: number): Promise<EffectiveDateModel[]> {
        return this.http.get<EffectiveDateModel[]>(`${this.appSetting.apiurl }/Generic/GetEffectiveDate?lastMonthCount=` + lastMonthCount)
            .toPromise();
    }

    GetReportingGroupByGuid(reportingGroupGuid: string, active?: boolean): Promise<ReportingGroupViewModel> {
        return this.http.get<ReportingGroupViewModel>(`${this.appSetting.apiurl }/Generic/GetReportingGroupByGuid?reportingGroupGuid=` + reportingGroupGuid + '&active=' + active)
            .toPromise();
    }

    GetPaymentMethodList(): Promise<PaymentMethodViewModel[]> {
        return this.http.get<PaymentMethodViewModel[]>(`${ this.appSetting.apiurl }/Generic/GetPaymentMethodListAsync`)
            .toPromise();
    }

    CheckRefurbishedProductActive(): Promise<boolean> {
        return this.http.get<boolean>(`${ this.appSetting.apiurl }/Generic/CheckRefurbishedProductActiveAsync`)
            .toPromise();
            
    }

    CheckReplacementDeviceActive(): Promise<boolean> {
        return this.http.get<boolean>(`${ this.appSetting.apiurl }/Generic/CheckReplacementDeviceActiveAsync`)
            .toPromise();
            
    }

    GetReportingGroupListByChildRportingGroupId(childRportingGroupId: number, parentReportingGroupRecordId: number, active: boolean, recordID?:number): Promise<ReportingGroupBaseViewModel[]> {
        let query: string = [
            `childRportingGroupId=${childRportingGroupId}`,
            `parentReportingGroupRecordId=${parentReportingGroupRecordId}`,
            `active=${active}`,
            `recordID=${recordID}`
        ].join('&');

        var url = 'Generic/GetReportingGroupListByChildRportingGroupIdAsync';
        if (typeof (parentReportingGroupRecordId) == 'string' || (parentReportingGroupRecordId + '').toString().length == 36)
            url = 'Generic/GetReportingGroupListByChildRportingGroupGuidAsync'

        return this.http.get<ReportingGroupBaseViewModel[]>(`${ this.appSetting.apiurl }/${url}?${query}`)
            .toPromise();
            
    }

    GetReportingGroupRelationList(): Promise<ReportingGroupRelMasterModel[]> {
        return this.http.get<ReportingGroupRelMasterModel[]>(`${this.appSetting.apiurl }/Generic/GetReportingGroupRelationListAsync`)
            .toPromise();
            
    }

    GetCareIssueTypeAsync(): Promise<string[]> {
        return this.http.get<string[]>(`${ this.appSetting.apiurl }/Generic/GetCareIssueTypeAsync`)
            .toPromise();
            
    }

    GetProductTypeList(): Promise<ProductTypeViewModel[]> {
        return this.http.get<ProductTypeViewModel[]>(`${ this.appSetting.apiurl }/Generic/GetProductTypeListAsync`)
            .toPromise();
            
    }
}
