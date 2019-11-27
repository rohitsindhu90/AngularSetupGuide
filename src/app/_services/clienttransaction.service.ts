import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { ClientTransactionModel } from '../_models/report/clienttransaction';


@Injectable({
    providedIn:'root'
})
export class ClientTrnsactionService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {

    }

    getClientTransactionReport(fromDate: string, toDate: string): Promise<ClientTransactionModel> {
        return this.http.get<ClientTransactionModel>(this.appSettingService.apiurl + '/Report/GetClientTransactionReport?fromDate=' + fromDate + '&toDate=' + toDate)
            .toPromise();
    }

}