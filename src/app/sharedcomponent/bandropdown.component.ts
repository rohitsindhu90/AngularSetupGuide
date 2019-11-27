
import { Component, OnInit, EventEmitter, Output, Input, OnChanges } from '@angular/core';
import { NetworkService } from '../_services/network.service';
import { BanDetail } from '../_models/ban-detail';
import { InvoiceService } from '../_services/invoice.service';

@Component({
    selector: 'ban-dropdown',
    templateUrl: './bandropdown.component.html'
})


export class BanDropdown implements OnInit, OnChanges {

    banArray: any[];
    banGuid: string;

    @Output() onChangeBanformEvent: EventEmitter<any> = new EventEmitter<any>();
    @Input() networkguid: any;
    @Input() billingplatformguid: any;

    constructor(private networkService: NetworkService, private invoiceService: InvoiceService) {
    }

    ngOnInit() {     
    }

    loadBanDropDown(): Promise<any> {
        this.clearBans();
        return this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid).then((data) => {
            if (data && data != null) {
                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

    clearBans() {
        this.banArray = [];
        this.banGuid = null;
    }

    onChangeBan() {

        var selectedBan: BanDetail = new BanDetail();
        selectedBan.banguid = this.banGuid;        
        selectedBan.description = this.banArray && this.banArray.length > 0 ? this.banArray.filter(x => x.value == (this.networkguid || null))[0].label : null;

        this.onChangeBanformEvent.emit(selectedBan);
    }

    ngOnChanges(changes: any) {
        this.loadBanDropDown();     
    }
}