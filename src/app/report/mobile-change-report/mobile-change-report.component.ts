
import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { CtnChangeReportViewModel } from 'src/app/_models/ctnchangereportviewmodel';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { BANDetailService } from 'src/app/_services/bandetail.service';
import { NetworkService } from 'src/app/_services/network.service';
import { UtilityMethod } from 'src/app/_common/utility-method';

@Component({
    selector: 'mobile-change-report',
    templateUrl: './mobile-change-report.component.html'
})
export class MobileChangeReportComponent implements OnInit {

    model: CtnChangeReportViewModel[];
    excelmodel: CtnChangeReportViewModel[];
    private loader: EventEmitter<any>;
    fromdate: Date;
    todate: Date;
    maxDate: Date;
    csvfilename: string;
    error: string;

    isbenexist: boolean;
    isbanexist: boolean;
    isnetworkdisplay: boolean;

    benfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];
    networkfilterset: any[] = [{ value: null, label: "" }];
    statusfilterset: any[] = [{ value: null, label: "" }];
    networkFilter: any;
    qBenFilter: any;
    qBanFilter: any;
    statusFilter: any;
    constructor(
        private globalEvent: GlobalEventsManager
        , private ctndetailservice: CTNDetailService
        , private invoiceDateService: InvoiceDateService
        , private bendetailService: BENDetailService
        , private bandetailService: BANDetailService
        , private networkService: NetworkService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.fromdate = new Date();
        this.todate = new Date();
        this.maxDate = new Date();
        this.fromdate.setDate(this.todate.getDate() - 30);
        this.csvfilename = "MobileChangeReport";

        this.checkBanExist();
        this.checkBenExist();
        this.checkMultipleNetworkExist();

        this.loader.emit(
            this.LoadReport()
        );
    }

    LoadReport(): Promise<any> {
        return this.ctndetailservice.LoadMobileChangeReport(UtilityMethod.formatDateExtended(this.fromdate), UtilityMethod.formatDateExtended(this.todate)).then(q => {
            this.model = q;
            this.excelmodel = q;

            if (this.isbenexist) {

                //Getting  ben  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                    return { 'value': q.bendescription, 'label': q.bendescription };
                }).sort((a, b) => {
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                    return 0;
                })
                    .forEach(q => {
                        if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                            this.benfilterset.push(q);
                        }
                    });
            }

            if (this.isbanexist) {
                //Getting  ben  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.bandescription === obj.bandescription }) === index).map(q => {
                    return { 'value': q.bandescription, 'label': q.bandescription };
                }).sort((a, b) => {
                    return parseInt(a.value) - parseInt(b.value);
                }).forEach(q => {
                    if (q.value) {
                        this.banfilterset.push(q);
                    }
                });
            }

            if (this.isnetworkdisplay) {
                //Getting  network  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                    return { 'value': q.networkdescription, 'label': q.networkdescription };
                }).sort((a, b) => {
                    return parseInt(a.value) - parseInt(b.value);
                }).forEach(q => {
                    if (q.value) {
                        this.networkfilterset.push(q);
                    }
                });
            }

            //Getting  network  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                return { 'value': q.status, 'label': q.status };
            }).sort((a, b) => {
                return parseInt(a.value) - parseInt(b.value);
            }).forEach(q => {
                if (q.value) {
                    this.statusfilterset.push(q);
                }
            });

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

    checkBenExist() {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, null, null, null, null).then((data) => {
            this.isbenexist = data;
        });
    }


    checkBanExist() {

        this.bandetailService.IsBANDisplay(null, null, null, null).then((data) => {
            this.isbanexist = data;
        });
    }


    checkMultipleNetworkExist() {

        this.networkService.IsNetworkDisplay().then((data) => {
            this.isnetworkdisplay = data;
        });
    }



}