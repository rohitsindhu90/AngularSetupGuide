import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportingGroup2 } from '../_models/reportinggroup2';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroup2Service {
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
    getReportingGroup2List(active?: boolean, ctnGuid?: string, recordID?: number): Promise<ReportingGroup2[]> {
        return this.http.get<ReportingGroup2[]>(this.appSettingService.apiurl + '/ReportingGroup2/GetReportingGroup2ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}