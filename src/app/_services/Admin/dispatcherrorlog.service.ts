import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DispatchErrorLogModel } from '../../_models/admin/dispatcherrorlog.model';
import { OrderConfirmedLoadViewModel } from '../../_models/Admin/orderconfirmedload.model';
import { AppSettingService } from 'src/app/_common/appsetting.service';

@Injectable(
    { providedIn:'root'}
)
export class DispatchErrorLogService {

    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }
    
    getDispatchErrorLogList(): Promise<DispatchErrorLogModel[]> {
        return this.http.get<DispatchErrorLogModel[]>(this.appSettingService.apiurl + '/DispatchErrorLog/GetDispatchErrorLogList')
            .toPromise();
    }

    getPendingDispatchOrders(): Promise<OrderConfirmedLoadViewModel[]> {
        return this.http.get<OrderConfirmedLoadViewModel[]>(this.appSettingService.apiurl+ '/DispatchErrorLog/GetPendingDispatchOrdersAsync')
            .toPromise();
    }

}


