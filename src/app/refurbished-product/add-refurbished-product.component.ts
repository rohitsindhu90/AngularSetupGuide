import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { AssetService } from '../_services/asset.service';
import { RefurbishedProduct } from '../_models/refurbishedproduct';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';

@Component({
    selector: 'app-add-refurbished-product',
    templateUrl: './add-refurbished-product.component.html'
})
/** AddRefurbished-Product component*/
export class AddRefurbishedProductComponent implements OnInit {
    private loader: EventEmitter<any>;
    productArray: SelectItem[];
    imeiArray: SelectItem[];
    model: RefurbishedProduct;
    constructor(private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private confirmationservice: ConfirmationService, ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.model = new RefurbishedProduct();
        let p1 = this.loadProductDropdown();
        this.loader.emit(Promise.all([p1]));
    }

    loadProductDropdown(): Promise<any> {
        this.clearProductDropdown();
        this.productArray.push({ label: '--Select--', value: null });

        return this.assetService.loadDistinctAssetProductList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.productArray.push({
                    label: item.productdescription, value: item.productid
                }));
            }
        });
    }

    clearProductDropdown() {
        this.productArray = [];

    }

    loadIMEIDropdown(): Promise<any> {
        this.clearIMEIDropdown();
        this.imeiArray.push({ label: '--Select--', value: null });

        return this.assetService.getIMEIByProductID(this.model.productid, "").then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.imeiArray.push({
                    label: item.imeinumber, value: item.assetid
                }));
            }
        });
    }

    clearIMEIDropdown() {
        this.imeiArray = [];

    }

    onProductidChange() {
        this.loader.emit(this.loadIMEIDropdown());
    }

    saveProduct(form: NgForm) {


        //Get IMEI 
        let imei = this.imeiArray.find(a => a.value == this.model.assetid);
        if (imei) {
            this.model.imeinumber = imei.label;
        }
        


        this.loader.emit(this.assetService.addRefurbishedProduct(this.model).subscribe((result:any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            form.resetForm();
                            this.ngOnInit();

                            //this.model = new AddAsset();
                            //this.model.purchasedate = new Date();

                        }
                    }
                });

            }
        }));
    }
}