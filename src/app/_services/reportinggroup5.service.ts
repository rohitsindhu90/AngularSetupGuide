import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportingGroup5 } from '../_models/reportinggroup5';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })
export class ReportingGroup5Service {
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
    getReportingGroup5List(active?: boolean, ctnGuid?: string, recordID?: number): Promise<ReportingGroup5[]> {
        return this.http.get<ReportingGroup5[]>(this.appSettingService.apiurl  + '/ReportingGroup5/GetReportingGroup5ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}