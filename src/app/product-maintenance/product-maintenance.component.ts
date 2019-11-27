import { Component, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms'
import { GlobalEventsManager } from '../_common/global-event.manager';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { OrderProductDetailViewModel } from '../_models/orderproductdetail.model';
import { RegexExpression } from '../_common/regex-expression';
import { GenericService } from '../_services/generic.service';
import { ProductLibraryService } from '../_services/admin/productlibrary.service';
import { ModalPopupService } from '../_common/modelpopup.service';
import { ProductType } from '../_services/enumtype';
import { OrderProductDetailService } from '../_services/orderproductdetail.service';
import { AddBulkCtnConfirmComponent } from '../bulkupload/add-bulk-ctn-confirm/add-bulk-ctn-confirm.component';
@Component({
    selector: 'app-product-maintenance',
    templateUrl: './product-maintenance.component.html'
})
/** product-maintenance component*/
export class ProductMaintenanceComponent {
    private loader: EventEmitter<any>;
    csvfilename: string
    productLibraryArray: { value: string, label: string, imagename: string }[];
    orderProductDetailArray: SelectItem[];
    productArray: SelectItem[];
    statusarray: SelectItem[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "Inactive" }];
    producttypeArray: SelectItem[];
    /* Connection Type List */
    connectiontypeArray: SelectItem[];
    model: OrderProductDetailViewModel;
    addNewProduct: boolean;
    allRemoveCheckBox: boolean;
    gridModel: OrderProductDetailViewModel[];
    exisingOrderProducts: OrderProductDetailViewModel[];
    producttypefilterset: { value: string, label: string }[] = [{ value: null, label: "" }];
    connectiontypefilterset: { value: string, label: string }[] = [{ value: null, label: "" }];
    statusfilterset: { value: string, label: string }[] = [{ value: null, label: "" }];
    decimalregx: RegExp = RegexExpression.decimal;

    qproducttypeFilter: any;
    qConnectionTypeFilter: any;
    qStatusFilter: any;

    constructor(private globalEvent: GlobalEventsManager,
        private orderProductDetailService: OrderProductDetailService,
        private confirmationservice: ConfirmationService,
        private genericService: GenericService,
        private productLibraryService: ProductLibraryService,
        private modalPopupService: ModalPopupService,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.csvfilename = "ProductReport";
        this.addNewProduct = false;
        this.model = new OrderProductDetailViewModel();
        this.allRemoveCheckBox = false;
        let p1 = this.loadOrderProductDetailGridData();
        let p2 = this.loadConnectionTypeDropDown();
        let p3 = this.loadProductTypeDropDown();
        let p4 = this.loadProductLibraryDropdown();
        this.loader.emit(Promise.all([p1, p2, p3, p4]));
    }

    ngAfterViewChecked() {

    }

    checkboxChange(form: NgForm) {

        form.resetForm({ addNewProduct: this.addNewProduct, active: this.model.active });
        this.model = new OrderProductDetailViewModel();
        //  this.model.hadwareonlyprice = "0.00";

        if (this.addNewProduct) {
            this.model.active = true;

        }
        else {
            this.model.active = null;

        }
        this.clearexisingOrderProducts();

    }

    loadProductLibraryDropdown(): Promise<any> {
        this.clearProductLibraryDropdown();
        this.productLibraryArray.push({ label: 'Select', value: null, imagename: null });

        return this.productLibraryService.GetProductLibraryList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.productLibraryArray.push({
                    label: item.productdescription, value: item.productdescription, imagename: item.imagename
                }));
            }
        });
    }

    clearProductLibraryDropdown() {
        this.productLibraryArray = [];

    }

    loadProductTypeDropDown(): Promise<any> {
        this.clearProductTypeDropDown();
        return this.genericService.GetProductTypeList().then((data) => {
            if (data != null) {
                this.producttypeArray.push({ label: 'Select', value: null });
                data.forEach(item => this.producttypeArray.push({
                    label: item.description, value: item.id
                }));
            }
        });
    }

    clearProductTypeDropDown() {
        this.producttypeArray = [];
        //this.networkguid = null;
    }

    loadConnectionTypeDropDown(): Promise<any> {
        this.clearConnectionTypeDropDown();
        return this.genericService.GetConnectionTypeList(true).then((data) => {
            if (data != null) {
                this.connectiontypeArray.push({ label: 'Select', value: null });
                data.forEach(item => this.connectiontypeArray.push({
                    label: item.description, value: item.connectiontypeid
                }));
            }
        });
    }

    clearConnectionTypeDropDown() {
        this.connectiontypeArray = [];
        //this.networkguid = null;
    }

    loadOrderProductDetailGridData() {
        this.gridModel = [];
        this.orderProductDetailService.getOrderProductDetailList().then((data) => {
            if (data && data.length > 0) {
                this.gridModel = data;

                data.filter((obj, index, self) => self.findIndex((t) => { return t.producttypedescription === obj.producttypedescription }) === index).map(q => {
                    return { 'value': q.producttypedescription, 'label': q.producttypedescription };
                }).forEach(q => {
                    if (this.producttypefilterset.filter(n => n.value == q.value).length == 0) {
                        this.producttypefilterset.push(q);
                    }
                });


                //Getting  connection  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.connectiontypedescription === obj.connectiontypedescription }) === index).map(q => {
                    return { 'value': q.connectiontypedescription, 'label': q.connectiontypedescription };
                }).forEach(q => {
                    if (this.connectiontypefilterset.filter(n => n.value == q.value).length == 0) {
                        this.connectiontypefilterset.push(q);
                    }
                });

                //Getting  Status  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.activedescrption === obj.activedescrption }) === index).map(q => {
                    return { 'value': q.activedescrption, 'label': q.activedescrption };
                }).forEach(q => {
                    if (this.statusfilterset.filter(n => n.value == q.value).length == 0) {
                        this.statusfilterset.push(q);
                    }
                });

                //===Bind Drop Down Data========//
                this.clearorderProductDetailDropdown();
                this.orderProductDetailArray.push({ label: 'Select', value: null });
                let orderproductarray = data.map(element => {
                    return { label: element.orderproductdescription, value: element.id }
                });
                this.orderProductDetailArray.push(...orderproductarray);
            }
        });
    }

    clearorderProductDetailDropdown() {
        this.orderProductDetailArray = [];
    }

    onChangeOrderProduct(orderProductDetailEvent: any) {

        let orderProductDetailID: number;
        //======If VTariff selected from Tariff Grid Row===
        if (orderProductDetailEvent) {
            orderProductDetailID = orderProductDetailEvent.data.id;
        }
        else {
            orderProductDetailID = this.model.id;
        }
        this.GetOrderProductDetailByID(orderProductDetailID);
        this.addNewProduct = false;
    }
    GetOrderProductDetailByID(orderProductDetailID: number) {

        this.loader.emit(this.orderProductDetailService.GetOrderProductDetailByID(orderProductDetailID).then(data => {
            this.model = data;
        }));
    }
    onChangeProduct() {
        if (this.model.productdescription) {
            let productObj = this.productLibraryArray.find(a => a.label == this.model.productdescription);

            this.model.orderproductdescription = productObj.label;
            this.model.productimage = productObj.imagename;
            this.GetExistingOrderProductByProductDesc(productObj.label);
        }
        else {
            this.model.orderproductdescription = "";
            this.model.productimage = "";
        }
    }

    disabledConnectionType() {
        return (this.model.producttypeid == ProductType.Accessories || this.model.producttypeid == ProductType.SIM);
    }

    GetExistingOrderProductByProductDesc(productDesc: string) {

        this.clearexisingOrderProducts();
        this.loader.emit(this.orderProductDetailService.GetExistingOrderProductByProductDesc(productDesc).then(data => {
            this.exisingOrderProducts = data;
        }));
    }

    clearexisingOrderProducts() {
        this.exisingOrderProducts = [];
    }

    save(form: NgForm) {
        this.loader.emit(this.orderProductDetailService.SaveOrderProductDetail(this.model).subscribe((result: any) => {
            if (result) {
                if (!result.success) {
                    let controls: any = null;
                    let popupHeaderMessage: string = "This action will changes the Product Status from Inactive to active. <br/> Would you like to continue ?";
                    this.confirmationservice.confirm({
                        message: popupHeaderMessage,
                        rejectVisible: false,
                        accept: (params: any) => {
                            this.model.resave = true;
                            this.save(form);
                        }
                    });

                }
                else {

                    this.confirmationservice.confirm({
                        message: result.message,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result.success && !result.object) {
                                this.ngOnInit();
                                form.resetForm();

                            }
                        }
                    });
                }
            }
        }));
    }

    disableRemoveProduct() {
        return !this.gridModel.some(element => element.isremove == true);
    }


    onChangeRemoveCheckBox(value: any) {
        let allChecked = this.gridModel.every(a => a.isremove);
        this.allRemoveCheckBox = allChecked;
    }
    removeProducts() {


        let params: any = {};

        this.modalPopupService.displayViewInPopup("Remove Products", <any>AddBulkCtnConfirmComponent, params, "lg").result.then((res: any) => {
            if (res) {

                let orderProductArray = this.gridModel.filter(e => e.isremove);
                orderProductArray[0].removalreason = res;
                this.loader.emit(this.orderProductDetailService.RemoveOrderProducts(orderProductArray).subscribe((result: any) => {
                    if (result) {
                        this.confirmationservice.confirm({
                            message: result.message,
                            key: 'dialog',
                            rejectVisible: false,
                            accept: () => {
                                if (result.success) {
                                    this.ngOnInit();

                                }
                            }
                        });
                    }
                }));
            };
        });

        //let orderProductArray = this.gridModel.filter(e => e.isremove);
        //this.loader.emit(this.orderProductDetailService.RemoveOrderProducts(orderProductArray).subscribe(result => {
        //    if (result) {
        //        this.confirmationservice.confirm({
        //            message: result.message,
        //            key: 'dialog',
        //            rejectVisible: false,
        //            accept: () => {
        //                if (result.success) {
        //                    this.ngOnInit();

        //                }
        //            }
        //        });
        //    }
        //}));
    }

    enableDisableCheckBox(value: any) {
        for (let orderProduct of this.gridModel) {
            orderProduct.isremove = value;
        }
    }
}