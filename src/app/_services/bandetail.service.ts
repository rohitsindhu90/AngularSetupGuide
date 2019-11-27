import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { BanDetail } from '../_models/ban-detail';
import 'rxjs/add/operator/toPromise';

@Injectable({
    providedIn: 'root'
})
export class BANDetailService {

    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    IsBANDisplay(invoicedateguid?: string, networkguid?: string, billingplatformguid?: string, fromDate?: Date, toDate?: Date): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/BANDetail/IsBANDisplay?invoicedateguid=' + invoicedateguid + '&networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid + '&fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

    getBANDetailListForRGCost(networkguid?: string, billingplatformguid?: string): Promise<BanDetail[]> {
        return this.http.get<BanDetail[]>(this.appSettingService.apiurl + '/BANDetail/GetBANDetailListForRGCost?networkGUID=' + networkguid + '&billingPlatformGUID=' + billingplatformguid)
            .toPromise();
    }

    IsBANDisplayForSpareReport(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/BANDetail/IsBANDisplayForSpareReport')
            .toPromise();
    }
}