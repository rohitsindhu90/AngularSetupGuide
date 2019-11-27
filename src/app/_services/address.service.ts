import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { AddressModel } from '../_models/address';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';

@Injectable({
    providedIn:'root'
})
export class AddressService {

    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }

    getAddressList(active: boolean): Promise<AddressModel[]> {
        return this.http.get<AddressModel[]>(this.appSettingService.apiurl+ '/Address/GetAddressList?active=' + active)
            .toPromise();
    }


    GetAddressDetailByID(addressID: number): Promise<AddressModel> {
        return this.http.get<AddressModel>(this.appSettingService.apiurl+ '/Address/GetAddressDetailByID?addressID=' + addressID)
            .toPromise();
    }

    saveAddress(model: AddressModel) {

        //var body = JSON.stringify(model);
        return this.http.post<any>(this.appSettingService.apiurl+ '/address/SaveAddressAsync', model);
    }


}