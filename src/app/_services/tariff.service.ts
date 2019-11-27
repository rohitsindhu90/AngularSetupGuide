import { Injectable } from '@angular/core';
import { Tariff } from '../_models/tariff';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
@Injectable({
    providedIn: 'root'
})

export class TariffService {
    /**
     * The constructor to inejct service
     * @param http: The Http service to inject
     */
    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    /**
     * Gets the active costcentre list for the given company
     * @param companyId: The companny id
     */
    getTariffList(active?: boolean): Promise<Tariff[]> {
        return this.http.get<Tariff[]>(this.appSettingService.apiurl + '/Tariff/GetTariffListAsync?active=' + active)
            .toPromise();
    }

    GetTariffByTariffGuid(tarrfGuid: string): Promise<Tariff> {
        return this.http.get<Tariff>(this.appSettingService.apiurl + '/Tariff/GetTariffByTariffGuidAsync?tariffGuid=' + tarrfGuid)
            .toPromise();
    }


    BindTariffDropDown(active?: boolean, networkguid?: string, billingplatformguid?: string, currentTariffGuid?: string): Promise<Tariff[]> {
        return this.http.get<Tariff[]>(this.appSettingService.apiurl + '/Tariff/BindTariffDropDownAsync?active=' + active + '&networkGuid=' + networkguid + '&billingplatformguid=' + billingplatformguid + '&currentTariffGuid=' + currentTariffGuid)
            .toPromise();
    }

    BindTariffDropDownByID(active?: boolean, networkid?: number, billingplatformid?: number, currentTariffid?: number): Promise<Tariff[]> {
        return this.http.get<Tariff[]>(this.appSettingService.apiurl + '/Tariff/BindTariffDropDownAsync?active=' + active + '&networkid=' + networkid + '&billingplatformid=' + billingplatformid + '&currentTariffid=' + currentTariffid)
            .toPromise();
    }

    SaveTariff(tariff: Tariff) {
        //var obj = {
        //    "id": userRole.id,
        //    "roledescription": userRole.roledescription,
        //    "active": userRole.active,
        //    "FeatureRoleTree": lstOfFeatureRole,
        //    "defaultfeatureid": userRole.defaultfeatureid
        //};

        var body = JSON.stringify(tariff);
        return this.http.post(this.appSettingService.apiurl + '/Tariff/SaveTariff', body);
    }

    getTariffListforNewConnection(networkguid: string, billingplatformkguid: string, connectiontypeid: number, active: boolean): Promise<Tariff[]> {
        return this.http.get<Tariff[]>(this.appSettingService.apiurl + '/Tariff/GetTariffListforNewConnection?networkGuid=' + networkguid + '&billingplatformguid=' + billingplatformkguid + '&connectionType=' + connectiontypeid + '&active=' + active)
            .toPromise();
    }

}
