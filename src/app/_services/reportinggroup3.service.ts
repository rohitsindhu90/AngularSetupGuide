import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ReportingGroup3 } from '../_models/reportinggroup3';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({
    providedIn: 'root',
    
  })

export class ReportingGroup3Service {
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
    getReportingGroup3List(active?: boolean, ctnGuid?: string, recordID?: number): Promise<ReportingGroup3[]> {
        return this.http.get<ReportingGroup3[]>(this.appSettingService.apiurl + '/ReportingGroup3/GetReportingGroup3ListAsync?active=' + active + '&ctnGuid=' + ctnGuid + "&recordID=" + recordID)
            .toPromise();
            
    }
}