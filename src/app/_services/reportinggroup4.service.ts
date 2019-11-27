import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportingGroup4 } from '../_models/reportinggroup4';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroup4Service {
    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService:AppSettingService) {
    }

    /**
     * Gets the active costcentre list for the given company
     * @param companyId: The companny id
     */
    getReportingGroup4List(active?: boolean, ctnGuid?: string, recordID?: number): Promise<ReportingGroup4[]> {
        return this.http.get<ReportingGroup4[]>(this.appSettingService.apiurl + '/ReportingGroup4/GetReportingGroup4ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}