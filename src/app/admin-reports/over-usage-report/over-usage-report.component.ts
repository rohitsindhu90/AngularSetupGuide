import { Component, OnInit, EventEmitter } from '@angular/core'
import { OverUsageReportModel } from '../../_models/report/over-usage-report.model';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { OverUsageReportService } from '../../_services/overusagereport.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { SelectItem } from 'primengdevng8/api';
import { NetworkService } from '../../_services/network.service';
import { BillingPlatform } from '../../_models/billingplatform';


@Component({
    templateUrl: 'over-usage-report.component.html',
    selector: 'over-usage-report'
})

export class OverUsageReportComponent implements OnInit {

    model: OverUsageReportModel[];
    csvfilename: string="Over_Usage_Rport";
    private loader: EventEmitter<any>;
    monthname: string;
    networkid: string;
    invoicemonthArray: SelectItem[];
    networkArray: SelectItem[];
    billingplatformArray: SelectItem[];
    billingplatformid: string;
    IsbillingPlatformExist: boolean = false;
    statusArray: SelectItem[] = [];
    status: string = "Yes";

    constructor(
        private globalEvent: GlobalEventsManager, private overUsageReportService: OverUsageReportService, 
        private invoiceDateService: InvoiceDateService, private networkService: NetworkService) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {



        this.statusArray.push({ label: "All", value: "All" });
        this.statusArray.push({ label: "Yes", value: "Yes" });
        this.statusArray.push({ label: "No", value: "No" });

        var p1 = this.loadInvoiceMonths();
        var p2 = this.loadNetwork();

        this.loader.emit(Promise.all([p1, p2]).then((data) => {
            this.loader.emit(Promise.all([this.loadBillingPlatform()]).then((data) => { this.refreshData() }))
        }));


    }

    refreshData() {

        this.loader.emit(this.overUsageReportService.getOverUsageReportAsync(this.monthname, this.status, this.networkid, this.billingplatformid).then((data) => {
            this.model = data;
        }));

    }

    loadInvoiceMonths(): Promise<any> {
        this.invoicemonthArray = [];

        return this.invoiceDateService.getInvoiceDateList().then((data) => {
            if (data != null) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item,
                    value: item,
                }));
                this.monthname = data[0];
            }
        });
    }

    //On Invoice Change 
    onInvoiceMonthChange() {
        if (this.monthname == "" || this.monthname == null || this.monthname == undefined) {
            this.model = [];
        }
        else {
            this.refreshData();
        }
    }


    loadNetwork(): Promise<any> {
        this.networkArray = [];
        return this.invoiceDateService.getNetworkList().then((data) => {

            this.networkArray.push({
                label: "All",
                value: "All"
            })

            if (data != null) {
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription,
                    value: item.id,
                }));
                this.networkid = this.networkArray[0].value;
            }

        });
    }

    //On Network Change 
    onNetworkChange() {
        this.loadBillingPlatform();
        this.refreshData();
    }

    onBillingplatformChange() {
        this.refreshData();
    }

    loadBillingPlatform(): Promise<any> {
        this.billingplatformArray = [];


        return this.invoiceDateService.getBillingPlatforms(this.networkid).then((data) => {

            this.billingplatformArray.push({
                label: "All",
                value: "All"
            })


            if (data != null) {

                data.forEach(item => this.billingplatformArray.push({
                    label: item.billingplatformdescription,
                    value: item.id,
                }));
                if (data.length > 0) {
                    this.IsbillingPlatformExist = true;
                }
                else {
                    this.IsbillingPlatformExist = false;
                }
            }
            this.billingplatformid = this.billingplatformArray[0].value;
        });
    }

    onStatusChange() {
        this.refreshData();
    }

}



