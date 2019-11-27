import { Component, OnInit, EventEmitter, Output,Input } from '@angular/core';
import { BENDetailService } from '../_services/bendetail.service';
import { BenDetail } from '../_models/ben-detail';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'ben-dropdown',
    templateUrl: './bendropdown.component.html'
})


export class BenDropdown implements OnInit {

    /* Ben */
    benArray: any[];
    benguid: string;
    @Input() networkguid: string;
    @Output() onChangeBenEvent: EventEmitter<any> = new EventEmitter<any>();

    constructor(private benDetailService: BENDetailService) {
    }

    ngOnInit() {
        this.loadBenDropDown();
    }

    loadBenDropDown(): Promise<any> {
        //this.clearBens();
        return this.benDetailService.getBenDetailList(null, this.networkguid,null,null,null).then((data) => {
            this.clearBens();
            if (data && data != null) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });
    }

    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    onChangeBen() {
        var selectedBen: BenDetail = new BenDetail();
        selectedBen.benguid = this.benguid;        
        selectedBen.bendescription = this.benArray && this.benArray.length > 0 ? this.benArray.filter(x => x.value == (this.benguid || null))[0].label : null;

        this.onChangeBenEvent.emit(selectedBen);
    }

    ngOnChanges(changes: any) {
        this.loadBenDropDown();
    }
}