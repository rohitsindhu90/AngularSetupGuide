import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { DeviceFilter } from '../../_models/order/devicefilter';
import { RefubrishedDeviceFilter } from '../../_models/order/refubrisheddevicefilter';
import { OrderType } from '../../_models/order/ordertype'
import { OrderConfirmViewModel } from '../../_models/order/orderconfirmviewmodel';
import { NewConnectionModel } from '../../_models/newconnectionmodel';
import { BenDetail } from '../../_models/ben-detail';
import { BanDetail } from '../../_models/ban-detail';
import { HardwareViewModel } from '../../_models/order/hardwareorderviewmodel';
import { OrderReportViewModel } from '../../_models/order/orderreportviewmodel';
import { Observable } from 'rxjs/observable';
import { UserDetail } from '../../_models/user-detail';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';

@Injectable(
    { providedIn:'root'}
)

export class OrderService {

    constructor(private http: HttpClient,private appSettingService: AppSettingService) {
    }

    getDeviceByFilter(name: string, isExcludeWifiOnly: boolean = false, productIDs: number[] = null): Promise<DeviceFilter[]> {

        let object: any = {};
        object.name = name;
        object.productIDs = productIDs;
        //  object.forNewConnection = forNewConnection;

        // object.isAccessories = isAccessories;
        // object.accessoriesProductIDs = accessoriesProductIDs;


        var body = JSON.stringify(object);
        return this.http.post<DeviceFilter[]>(this.appSettingService.apiurl + '/order/LoadProductListByFilterAsync', body)
            .toPromise();

    }

    loadProductListByConnectionType(name: string, connectionTypeID?: number, tariffguid?: string, orderTypeID?: number, productIDs: number[] = null): Promise<DeviceFilter[]> {

        let object: any = {};
        object.name = name;
        object.connectionTypeID = connectionTypeID;
        object.tariffguid = tariffguid;
        object.orderTypeID = orderTypeID;
        object.productIDs = productIDs;

        var body = JSON.stringify(object);
        return this.http.post<DeviceFilter[]>(this.appSettingService.apiurl + '/order/LoadProductListByConnectionTypeAsync', body)
            .toPromise();

    }

    getOrderTypes(networkguid: string, billingplatformguid: string, connectiontypeid: number, tariffguid: string): Promise<[OrderType]> {
        return this.http.get<[OrderType]>(this.appSettingService.apiurl + '/order/GetOrderTypes?networkguid=' + networkguid + '&billingplatformguid=' + billingplatformguid + '&connectionTypeid=' + connectiontypeid + '&tariffguid=' + tariffguid)
            .toPromise();
    }

    showRebrished(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/order/ShowRebrished')
            .toPromise();
    }

    showQuantity(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/order/ShowQuantity')
            .toPromise();
    }

    getRefubrishedDeviceByFilter(name: string, connectionTypeId: number): Promise<RefubrishedDeviceFilter[]> {
        return this.http.get<RefubrishedDeviceFilter[]>(this.appSettingService.apiurl + '/order/LoadRefubrishedProductListByFilterAsync?name=' + name + '&connectionTypeId=' + connectionTypeId)
            .toPromise();
    }

    loadOrderConfirm(orderGuid: string): Promise<OrderConfirmViewModel> {
        return this.http.get<OrderConfirmViewModel>(this.appSettingService.apiurl + '/order/LoadOrderConfirm?orderGuid=' + orderGuid)
            .toPromise();
    }


    saveOrderConfirm(model: OrderConfirmViewModel) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/order/saveorderconfirm', body);
    }

    saveNewConnection(model: NewConnectionModel): Promise<any> {
        var body = JSON.stringify(model);
        return this.http.post<any>(this.appSettingService.apiurl + '/order/savenewconnection', body)
            .toPromise();
    }

    getBenForNewConnection(ctnGuid?: string): Promise<BenDetail[]> {
        return this.http.get<BenDetail[]>(this.appSettingService.apiurl + '/BENDetail/getBENDetailListForNewOrder/?ctnGuid=' + ctnGuid)
            .toPromise();
    }

    getBanForNewConnection(networkguid: string, billingplatformguid: string): Promise<BanDetail[]> {
        return this.http.get<BanDetail[]>(this.appSettingService.apiurl + '/BANDetail/getBANDetailListForNewOrder?networkGuid=' + networkguid + '&billlingPlatformGuid=' + billingplatformguid)
            .toPromise();
    }

    saveHardwareOrder(model: HardwareViewModel[], orderGuid: string) {
        let object: any = {};
        object.lineitems = model;
        object.orderguid = orderGuid == "" ? null : orderGuid;
        var body = JSON.stringify(object);
        return this.http.post(this.appSettingService.apiurl + '/order/SaveHardwareOrder', body);
            //.map((response: Response) => response.json());

    }

    gethardwareorderbyguid(orderguid: string): Promise<HardwareViewModel[]> {
        return this.http.get<HardwareViewModel[]>(this.appSettingService.apiurl + '/Order/GetHardwareOrderByGuidAsync?Guid=' + orderguid)
            .toPromise();
    }

    getnewconnectionorderbyguid(orderguid: string): Promise<NewConnectionModel> {
        return this.http.get<NewConnectionModel>(this.appSettingService.apiurl + '/Order/GetNewConnectionOrderByGuidAsync?Guid=' + orderguid)
            .toPromise();
    }

    GetOrderReportAsync(filterType: string, startDate: string, endDate: string): Promise<OrderReportViewModel> {
        return this.http.get<OrderReportViewModel>(this.appSettingService.apiurl + '/order/GetOrderReportAsync?filterType=' + filterType + '&startDate=' + startDate + '&endDate=' + endDate)
            .toPromise();
    }

    getOrderDetailByOrderGuid(orderGUID: string): Promise<OrderReportViewModel> {
        return this.http.get<OrderReportViewModel>(this.appSettingService.apiurl + '/order/GetOrderDetailByOrderGuidAsync?orderGUID=' + orderGUID)
            .toPromise();
    }

    cancelOrderByGuid(orderGUID: string, reason: string, userDetail: UserDetail): Observable<any> {
        let object: any = {};
        object.orderGUID = orderGUID;
        object.reason = reason;
        object.userprofileview = userDetail;
        var body = JSON.stringify(object);
        return this.http.post<any>(this.appSettingService.apiurl + '/order/CancelOrderByGuidAsync', body);
            //.toPromise();
    }
}