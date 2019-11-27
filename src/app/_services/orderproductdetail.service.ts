import { Injectable } from '@angular/core';
import { OrderProductDetailViewModel } from '../_models/orderproductdetail.model'
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';

@Injectable({
    providedIn: 'root'
})
export class OrderProductDetailService {
    constructor(private http: HttpClient,
        private appSettingService: AppSettingService) {

    }

    getOrderProductDetailList(): Promise<OrderProductDetailViewModel[]> {
        return this.http.get<OrderProductDetailViewModel[]>(this.appSettingService.apiurl + '/OrderProductDetail/LoadOrderProductListAsync')
            .toPromise();
    }


    GetOrderProductDetailByID(orderProductDetailID: number): Promise<OrderProductDetailViewModel> {
        return this.http.get<OrderProductDetailViewModel>(this.appSettingService.apiurl + '/OrderProductDetail/GetOrderProductDetailByIDAsync?orderProductDetailID=' + orderProductDetailID)
            .toPromise();
    }


    GetExistingOrderProductByProductDesc(productDescription: string): Promise<OrderProductDetailViewModel[]> {
        return this.http.get<OrderProductDetailViewModel[]>(this.appSettingService.apiurl + '/OrderProductDetail/GetExistingOrderProductByProductDescAsync?productDescription=' + productDescription)
            .toPromise();
    }
    SaveOrderProductDetail(model: OrderProductDetailViewModel) {
        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/OrderProductDetail/SaveOrderProductDetailAsync', body);
    }

    RemoveOrderProducts(model: OrderProductDetailViewModel[]) {
        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/OrderProductDetail/RemoveOrderProductsAsync', body);
    }

}