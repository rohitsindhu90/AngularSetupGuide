
import { Component, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
//import { AuthenticationService } from '../_services/authentication.service';

//import { ModalPopupService } from '../_common/modelpopup.service';
import { GenericService } from '../../_services/generic.service';
import { AddressService } from '../../_services/address.service';
import { OrderService } from '../../_services/order/order.service';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { OrderConfirmViewModel } from '../../_models/order/orderconfirmviewmodel';
import { PaymentMethodViewModel } from '../../_models/paymentmethodviewmodel';
import { AddressModel } from '../../_models/address';
import { RegexExpression } from '../../_common/regex-expression';
import { OrderStatus } from '../../_services/enumtype';


@Component({
    //moduleId: module.id,

    templateUrl: './order-confirmation.component.html',
    styles: ['.lblmaginleft {margin-left: 35px;}']
})

export class OrderConfirmationComponent implements OnInit {

    private loader: EventEmitter<any>;
    mobilenumberregx: RegExp = RegexExpression.numberWith15Digit;
    model: OrderConfirmViewModel;
    paymentMethodArray: SelectItem[];
    addressArray: SelectItem[];
    orderStatusEnum = OrderStatus;
    sub: any;
    orderGuidExist: boolean = false;
    mailRegex = RegexExpression.emailRegex;
    constructor(private globalEvent: GlobalEventsManager
        , private route: ActivatedRoute
        , private router: Router
        , private orderService: OrderService
        , private genericService: GenericService
        , private addressService: AddressService
        , private confirmationservice: ConfirmationService
        , private cdRef: ChangeDetectorRef

    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.model = new OrderConfirmViewModel();
        this.route.params.subscribe(params => {
            this.sub = this.route.queryParams.subscribe(params => {

                this.model.orderguid = params['orderguid'] || "";
                var process1 = this.loadOrderConfirm();
                var process2 = this.loadPaymentMethods();
                var process3 = this.loadAddressList();
                this.loader.emit(Promise.all([process1, process2, process3]));
            });

        });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    loadPaymentMethods() {
        this.clearPaymentMethods();

        this.genericService.GetPaymentMethodList().then((data) => {
            if (data != null) {
                this.paymentMethodArray.push({ label: 'Select', value: null });
                data.forEach(item => this.paymentMethodArray.push({
                    label: item.description, value: item.id
                }));
            }
        });

    }


    clearPaymentMethods() {
        this.paymentMethodArray = [];
    }


    loadAddressList() {
        this.clearAddressList();

        this.addressService.getAddressList(true).then((data) => {
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

    loadOrderConfirm(): Promise<any> {
        //this.clearProductLibraryDropdown();
        //this.productLibraryArray.push({ label: 'Select', value: null });

        return this.orderService.loadOrderConfirm(this.model.orderguid).then((data) => {
            if (data != null) {
                this.orderGuidExist = true;
                this.model = data;
            }


        });
    }

    onChangeAddress() {
        if (this.model.deliveryaddressid) {
            this.addressService.GetAddressDetailByID(this.model.deliveryaddressid).then((data) => {
                if (data != null) {
                    this.setDeiveryAddress(data);
                }
            });
        }

        this.model.isotheraddress = null;
        this.model.issaveaddress = null;
    }

    setDeiveryAddress(data: AddressModel) {
        this.model.deliveryfao = data.itservicedeskcontact;
        this.model.contactnumber = data.itservicedeskcontactnumber;
        this.model.contactemail = data.itservicedeskemail;
        this.model.otheraddress1 = data.address1;
        this.model.otheraddress2 = data.address2;
        this.model.otheraddress3 = data.address3;
        this.model.otheraddress4 = data.address4;
        this.model.othertown = data.city;
        this.model.othercounty = data.county;
        this.model.othercountry = data.country;
        this.model.otherpostcode = data.postcode;
        this.model.addressshortname = "";
    }
    checkboxChange(addressID: number) {
        this.model.deliveryaddressid = null;
        if (addressID !== 2) {
            this.setDeiveryAddress(new AddressModel());
        }

        if (!this.model.isotheraddress) {
            this.model.issaveaddress = false;
        }
        //else {
        //    this.model.isotheraddress = false;
        //}
    }


    save(form: NgForm) {

        this.loader.emit(this.orderService.saveOrderConfirm(this.model).subscribe((result:any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            if (result.object && result.object.orderstatusid) {
                                this.model.orderstatus = result.object.orderstatusid;
                            }

                            //this.ngOnInit();
                            //form.resetForm();
                        }
                    }
                });
            }
        }));
    }

    goback() {

        if (this.model.ordertypeid) {
            this.router.navigate(['new-connections'], {

                queryParams: {
                    orderguid: this.model.orderguid
                }
            });
        }
        else {

            this.router.navigate(['hardware-order'], {
                queryParams: {
                    orderguid: this.model.orderguid
                }
            });

        }


    }

    calculateTotalQuantity() {
        return this.model.productlist.reduce((acc, value) => { return acc + value.quantity }, 0)

    }
}
