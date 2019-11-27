import { Component, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { RefurbishedProduct } from 'src/app/_models/refurbishedproduct';
import { SelectItem } from 'primengdevng8/api';
import { AssetService } from 'src/app/_services/asset.service';



@Component({
    selector: 'app-refurbished-product',
    templateUrl: './refurbished-product.component.html'
})
/** RefurbishedProduct component*/
export class RefurbishedProductComponent {

    private loader: EventEmitter<any>;
    refurbishedProductsArray: RefurbishedProduct[];
    productArray: SelectItem[];
    allocationTypeArray: SelectItem[];
    productID: number = null;
    allocationType: boolean = false;
    csvfilename: string = "Refurbished Product";
    allocatefilterset: { value: string, label: string }[] = [{ value: null, label: "" }];

    qAllocateFilter:any;

    constructor(private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        let p1 = this.loadRefurbishedAssetList();
        let p2 = this.loadProductDropdown();
        this.loadAllocationTypeDropdown();
        this.loader.emit(Promise.all([p1, p2]));
    }

    loadRefurbishedAssetList(): Promise<any> {
        this.clearrefurbishedProducts();

        return this.assetService.loadRefurbishedAssetList(this.productID, this.allocationType).then((data) => {
            if (data && data.length > 0) {
                this.refurbishedProductsArray = data;

                //Getting  network  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.isallocated === obj.isallocated }) === index).map(q => {
                    return { 'value': q.isallocated, 'label': q.isallocated };
                }).forEach(q => {
                    if (this.allocatefilterset.filter(n => n.value == q.value).length == 0) {
                        this.allocatefilterset.push(q);
                    }
                });
            }
        });
    }

    clearrefurbishedProducts() {
        this.refurbishedProductsArray = [];

    }
    loadProductDropdown(): Promise<any> {
        this.clearProductDropdown();
        this.productArray.push({ label: '--Select--', value: null });

        return this.assetService.loadRefurbishedAssetProductList().then((data) => {
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
    loadAllocationTypeDropdown() {
        this.clearAllocationTypeDropdown();
        this.allocationTypeArray.push({ label: 'Both', value: null });
        this.allocationTypeArray.push({ label: 'Yes', value: true });
        this.allocationTypeArray.push({ label: 'No', value: false });
    }

    clearAllocationTypeDropdown() {
        this.allocationTypeArray = [];

    }

    onChangeProductID() {
        this.loader.emit(this.loadRefurbishedAssetList());
    }
}