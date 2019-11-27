import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReportingGroup1 } from '../_models/reportinggroup1';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroup1Service {
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
    getReportingGroup1List(active?: boolean, ctnGuid?: string, recordID?:number): Promise<ReportingGroup1[]> {        
        return this.http.get<ReportingGroup1[]>(this.appSettingService.apiurl  + '/ReportingGroup1/GetReportingGroup1ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}