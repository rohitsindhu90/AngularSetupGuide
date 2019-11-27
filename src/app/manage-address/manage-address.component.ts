import { Component, EventEmitter, OnInit } from '@angular/core';
import {NgForm } from '@angular/forms';
import { AddressService } from '../_services/address.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { AddressModel } from '../_models/address';
import { RegexExpression } from '../_common/regex-expression';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';


@Component({

    templateUrl: './manage-address.component.html'
})

export class ManageAddressComponent implements OnInit {

    private loader: EventEmitter<any>;
    mobilenumberregx: RegExp = RegexExpression.recipientnumber;
    addressArray: SelectItem[];
    statusarray: SelectItem[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "Inactive" }];
    model: AddressModel;
    mailRegex = RegexExpression.emailRegex;
    constructor(private globalEvent: GlobalEventsManager
        //, private route: ActivatedRoute
        //, private router: Router
        //, private orderService: OrderService
        //, private genericService: GenericService
        , private addressService: AddressService
        , private confirmationservice: ConfirmationService
        //, private cdRef: ChangeDetectorRef
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.model = new AddressModel();

        var p1 = this.loadAddressList();
        this.loader.emit(Promise.all([p1]));
    }
    ngAfterViewChecked() {

    }
    loadAddressList() {
        this.clearAddressList();

        this.addressService.getAddressList(null).then((data) => {
            if (data != null) {
                this.addressArray.push({ label: 'Select', value: null });
                data.forEach(item => this.addressArray.push({
                    label: item.addresscombined, value: item.addressid
                }));
            }
        });
    }

    clearAddressList() {
        this.addressArray = [];
    }

    checkboxChange(form: NgForm) {
        let isnewaddress = this.model.isnewaddress;
        this.model = new AddressModel();
        this.model.isnewaddress = isnewaddress;
        if (this.model.isnewaddress) {
            this.model.active = true;

        }
        //else {
        //    this.model.active = null;

        //}

        ////this.model.addressid = null;

    }


    onChangeAddress() {
        if (this.model.addressid) {
            this.loader.emit(this.addressService.GetAddressDetailByID(this.model.addressid).then((data) => {
                if (data != null) {
                    this.model = data;

                }
            }));
        }

    }

    save(form: NgForm) {

        this.loader.emit(this.addressService.saveAddress(this.model).subscribe((result: any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            // this.model.orderstatus = result.object.orderstatusid;
                            this.ngOnInit();
                            form.resetForm();
                        }
                    }
                });
            }
        }));
    }

}