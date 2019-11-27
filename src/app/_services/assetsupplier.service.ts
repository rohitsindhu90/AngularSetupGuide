import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { AssetSupplier } from '../_models/asset/assetsupplier';

@Injectable({
    providedIn: 'root'
})
export class AssetSupplierService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }


    GetSuppliersList(active?: boolean): Promise<AssetSupplier[]> {
        return this.http.get<AssetSupplier[]>(this.appSettingService.apiurl + '/AssetSupplier/GetSuppliersListAsync?active=' + active)
            .toPromise();
    }


    //getAllAssetSuppliersList(active?: boolean): Promise<AssetSupplier[]> {
    //    return this.http.get(this.appSettingService.apiurl + '/AssetSupplier/GetAllAssetSuppliersListAsync')
    //        .toPromise()
    //        .then(response => response.json() as AssetSupplier[]);
    //}

    getSupplierByGuid(supplierGuid: string): Promise<AssetSupplier> {
        return this.http.get<AssetSupplier>(this.appSettingService.apiurl + '/AssetSupplier/GetSupplierByGuidAsync?supplierGuid=' + supplierGuid)
            .toPromise();
    }


    saveAssetSupplier(model: AssetSupplier) {
        var obj = {
            "supplierguid": model.supplierguid,
            "supplierdescription": model.supplierdescription,
            "active": model.active
        };

        var body = JSON.stringify(obj);
        return this.http.post(this.appSettingService.apiurl + '/AssetSupplier/SaveAssetSupplier', body);
    }
}

