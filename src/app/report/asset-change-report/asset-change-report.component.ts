import { SelectItem } from 'primengdevng8/api';
import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { AssetChangeReportViewModel } from '../../_models/assetchangereportviewmodel'
import { AuthenticationService } from '../../_services/authentication.service';
import { GlobalEventsManager } from '../../_common/global-event.manager'
import { Router } from '@angular/router';
import { AssetService } from '../../_services/asset.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { UtilityMethod } from 'src/app/_common/utility-method';


@Component({
    selector: 'asset-change-report',
    templateUrl: './asset-change-report.component.html'
})
export class AssetChangeReportComponent implements OnInit {

    model: AssetChangeReportViewModel[];
    excelmodel: AssetChangeReportViewModel[];
    private loader: EventEmitter<any>;
    fromdate: Date;
    todate: Date;
    maxDate: Date;
    csvfilename: string;
    error: string;
    statusFilterset: SelectItem[];
    statusFilter:any;
    constructor(
        private globalEvent: GlobalEventsManager
        , private assetService: AssetService
        , private invoiceDateService: InvoiceDateService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.fromdate = new Date();
        this.todate = new Date();
        this.maxDate = new Date();
        this.fromdate.setDate(this.todate.getDate() - 30);
        this.csvfilename = "AssetChangeReport";

        this.loader.emit(this.LoadReport());
    }

    LoadReport(): Promise<any> {
        return this.assetService.loadAssetChangeReport(UtilityMethod.formatDateExtended(this.fromdate), UtilityMethod.formatDateExtended(this.todate)).then(q => {
            this.model = q;
            this.excelmodel = q;

            this.clearGridFilter();

            if (q != null) {
                //Getting  network  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                    return { 'value': q.status, 'label': q.status };
                }).sort((a, b) => {
                    return parseInt(a.value) - parseInt(b.value);
                }).forEach(q => {
                    if (q.value) {
                        this.statusFilterset.push(q);
                    }
                });
            }
        });
    }

    onSelect() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(new Date(this.fromdate), new Date(this.todate));
        if (this.error) {
            this.model = [];
        }
        else {
            this.loader.emit(this.LoadReport());
        }

    }


    clearGridFilter() {
        this.statusFilterset = [{ value: null, label: "" }];
    }
}