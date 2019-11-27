import { Injectable } from '@angular/core';
import { Features } from '../_models/features';
import { HttpClient } from '@angular/common/http';
// import { ApiSettings } from '../_common/api-settings';
import 'rxjs/add/operator/toPromise';
import { UtilityMethod } from '../_common/utility-method'; 
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({ providedIn: 'root' })
export class FeatureService {
    // private currentFeatureListSubject: BehaviorSubject<Features[]>;
    // public currentFeatureList: Observable<Features[]>;
    
    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
        // this.currentFeatureListSubject = new BehaviorSubject<Features[]>(null);
        // this.currentFeatureList = this.currentFeatureListSubject.asObservable();
    }

    // public get currentFeatureListValue(): Features[] {
    //     return this.currentFeatureListSubject.value;
    // }

    //filter the features based on user unique id stored in local storage return objects of type feature from web api  method
    getFeatureList(routePath?: string, includeFeature?: boolean, checkAccess?: boolean): Promise<Features[]> {
        return this.http.get<Features[]>(`${this.appSettingService.apiurl}/Feature/GetFeatureListAsync?routePath=`+UtilityMethod.IfNull(routePath, '') + '&includeFeature=' + UtilityMethod.IfNull(includeFeature, '') + '&checkAccess=' + checkAccess)
            .toPromise();
    // promise.then(x=>{
    //            this.currentFeatureListSubject.next(x);
    //   });
    //         return promise;
            
    }

    getDefaultFeatureList(): Promise<Features[]> {
        return this.http.get <Features[]>(`${this.appSettingService.apiurl }/Feature/GetDefaultFeatureListAsync`)
            .toPromise()
            .then(response => response);
    }

    LoadFeatureTree(): Promise<any> {
        return this.http.get(`${this.appSettingService.apiurl }/Feature/LoadFeatureTreeAsync`)
            .toPromise()
            .then(response => response);
    }

    getFeaturesForScheduleReport(): Promise<Features[]> {
        return this.http.get<Features[]>(`${this.appSettingService.apiurl}/Feature/GetFeaturesForScheduleReportAsync`)
            .toPromise()
            .then(response => response);
    }
}

