
import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { NetworkService } from '../_services/network.service';
import { BillingPlatform } from '../_models/billingplatform';

@Component({
    selector: 'bilingPlatform-dropdown',
    templateUrl: './billingplatformdropdown.component.html'
})


export class BilingPlatformDropdown implements OnInit, OnChanges {

    /* Billing Platforms */
    billingPlatformArray: any[];
    billingplatformguid: string;

    @Output() onChangeBillingPlatformEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() networkguid: any;

    constructor(private networkService: NetworkService) {
    }

    ngOnInit() {
    }
    
    loadBillingPlatformDropDown(): Promise<any> {
        this.clearBillingPlatform();

        if (this.networkguid != undefined) {
            return this.networkService.getBillingPlatforms(this.networkguid).then((data) => {
                if (data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item.billingplatformguid, id: item.id
                    }));
                }
            });
        }
    }

    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    onChangeBillingPlatForm() {

        var selectedBillnigPlatform: BillingPlatform = new BillingPlatform();
        selectedBillnigPlatform.billingplatformguid = this.billingplatformguid;
        selectedBillnigPlatform.id = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].id : null;
        selectedBillnigPlatform.billingplatformdescription = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].label : null;

        this.onChangeBillingPlatformEvent.emit(selectedBillnigPlatform);
    }

    ngOnChanges(changes: any) {
        this.loadBillingPlatformDropDown();
    }
}