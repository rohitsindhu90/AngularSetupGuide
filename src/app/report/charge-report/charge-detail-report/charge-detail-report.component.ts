import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { GlobalEventsManager } from '../../../_common/global-event.manager';
import { InvoiceCTNCharge } from 'src/app/_models/report/invoicectn-charge-report.model';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericService } from 'src/app/_services/generic.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';

@Component({
    selector: 'charge-detail-report',
    templateUrl: './charge-detail-report.component.html'
})
export class ChargeDetailReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    model: InvoiceCTNCharge[];

    /* Invoice Months */
    invoicemonthArray: SelectItem[];

    fromdate?: Date;
    todate?: Date;

    /* Charge Group  */
    chargeGroupArray: SelectItem[];
    chargegroupguid: string;

    networkguid: string;
    networkdescription: string;
    billingplatformguid: string;
    billingplatformdescription: string;
    bendescription: string;
    benguid: string;
    bandescription: string;
    ban: string;

    chargegroupfilterset: any[] = [{ value: null, label: "" }];
    chargetype: string;
    chargedescription: string;
    fromMonth: string;
    toMonth: string;
    csvfilename: string;
    sub: any;
    /**
     * Constructor: used to inject services
     * @param genericservice: genericservice service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : invoicereportservice to inject
     */
    constructor(
        private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private globalEvent: GlobalEventsManager,
        private router: Router,
        private genericservice: GenericService,
        private route: ActivatedRoute,

    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.fromdate = params["fromdate"];
            this.todate = params["todate"];
            this.chargegroupguid = params["cg"];
            this.sub = this.route.queryParams.subscribe(params => {
                this.chargedescription = params['cd'] || "";
                this.benguid = params['bn'] || "";
                this.networkguid = params['nt'] || "";
                this.billingplatformguid = params['bp'] || "";
                this.ban = params['ban'] || "";
            });
            this.loadDescriptions();
            var p1 = this.getInvoiceMonths();
            //this.loader.emit(Promise.all([this.getChargeGroupDescription(), this.loadInvoiceChargeDetilReport()]));


            this.loader.emit(Promise.all([p1]).then(() => {
                let process3 = this.getChargeGroupDescription();
                let process4 = this.loadInvoiceChargeDetilReport();

                this.loader.emit(Promise.all([process3, process4]))
            }
            ));





        })
    }

    loadDescriptions() {
        var chargereportdata = JSON.parse(localStorage.getItem(LocalStorageProvider.chargereportstoragename));
        if (chargereportdata) {

            this.billingplatformdescription = chargereportdata[0].billingplatformdescription;
            this.bendescription = chargereportdata[0].bendescription;
            this.networkdescription = chargereportdata[0].networkdescription;
            this.bandescription = chargereportdata[0].bandescription;
        }
    }

    // get the invoice month name
    getInvoiceMonths(): Promise<any> {
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length > 0) {
                this.fromMonth = data.filter(x => x.startdate == this.fromdate)[0].invoicedatedescription;
                this.toMonth = data.filter(x => x.startdate == this.todate)[0].invoicedatedescription;
            }
        });
    }

    // get the charge description
    getChargeGroupDescription(): Promise<any> {
        return this.genericservice.GetActiveChareGroupList().then((data) => {
            if (data) {
                this.chargetype = data.filter(x => x.chargegroupguid == this.chargegroupguid)[0].description;
            }
        });
    }



    /**
     * load charge detail summary report
     */
    loadInvoiceChargeDetilReport(): Promise<any> {
        this.csvfilename = "ChargeDetailSummaryReport " + this.chargetype + " " + this.fromMonth + " - " + this.toMonth;

        return this.invoicereportservice.GetInvoiceCTNChargeDetailsReport(this.fromdate, this.todate, this.chargegroupguid, this.chargedescription, this.networkguid, this.billingplatformguid, this.benguid, this.ban).then(q => {
            this.model = q;

            this.clearGridFilter();

            //Getting charge group list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.chargegroupdescription === obj.chargegroupdescription }) === index).map(q => {
                return { 'value': q.chargegroupdescription, 'label': q.chargegroupdescription };
            }).forEach(q => { this.chargegroupfilterset.push(q); });
        });
    }


    clearGridFilter() {
        this.chargegroupfilterset = [{ value: null, label: "" }];

    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}