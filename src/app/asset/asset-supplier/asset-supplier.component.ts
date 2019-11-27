import { Component, OnInit, EventEmitter } from '@angular/core';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { AssetSupplierService } from '../../_services/assetsupplier.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { AssetSupplier } from '../../_models/asset/assetsupplier';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'manager-supplier',
    templateUrl: './asset-supplier.component.html'
})


export class AssetSupplierComponent implements OnInit {

    private loader: EventEmitter<any>;
    gridmodel: AssetSupplier[] = [];
    addNewSupplier: boolean = false;
    supplierArray: SelectItem[];
    //supplierguid: string;
    model: AssetSupplier;
    csvfilename: string = "SupplierReport";
    activelist: any[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "InActive" }];
    private active?: boolean = null;

    constructor(private assetSupplierService: AssetSupplierService
        , private globalEvent: GlobalEventsManager
        , private confirmationservice: ConfirmationService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.setModelValues();
        var process1 = this.loadSupplierList();

        this.loader.emit(Promise.all([process1]).then(() => {
            this.bindSupplierArray();
        }));

    }

    ngAfterViewChecked() {
    }

    setModelValues() {
        this.model = new AssetSupplier();
        this.addNewSupplier = false;
    }

    loadSupplierList(): Promise<any> {
        return this.assetSupplierService.GetSuppliersList().then((data) => {
            this.gridmodel = data;
        });
    }

    checkboxChange(form: NgForm) {
        form.resetForm({ addNewSupplier: this.addNewSupplier, active: this.model.active });
        this.model = new AssetSupplier();
        if (this.addNewSupplier) {
            this.model.active = true;

        }
        else {
            this.model.active = null;

        }

        this.model.supplierguid = null;


        // form.resetForm('supplierdescription');
    }

    onSupplierChange() {

        var p1 = this.getSupplierByGuid();

        this.loader.emit(Promise.all([p1]));

    }

    getSupplierByGuid() {
        if (this.model != null && this.model.supplierguid != null) {

            this.assetSupplierService.getSupplierByGuid(this.model.supplierguid).then((data) => {
                this.model.active = data.active;
                this.model.supplierdescription = data.supplierdescription;
            });
        }
        else {

            this.model.active = null;
        }
    }

    bindSupplierArray() {
        
        this.assetSupplierService.GetSuppliersList().then((data) => {
            if (data != null) {
                this.clearSupplier();
                this.supplierArray.push({ label: 'Select', value: null });
                data.forEach(item => this.supplierArray.push({
                    label: item.supplierdescription, value: item.supplierguid
                }));
            }
        });
    }

    clearSupplier() {
        this.supplierArray = [];
        // this.supplierguid = null;
    }

    save(form: NgForm) {

        this.loader.emit(this.assetSupplierService.saveAssetSupplier(this.model).subscribe((result: any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            this.ngOnInit();
                            form.resetForm();
                        }
                    }
                });
            }
        }));
    }


}