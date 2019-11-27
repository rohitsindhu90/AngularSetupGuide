import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportingGroup6 } from '../_models/reportinggroup6';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroup6Service {
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
    getReportingGroup6List(active?: boolean, ctnGuid?: string, recordID?: number): Promise<ReportingGroup6[]> {
        return this.http.get<ReportingGroup6[]>(this.appSettingService.apiurl + '/ReportingGroup6/GetReportingGroup6ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}