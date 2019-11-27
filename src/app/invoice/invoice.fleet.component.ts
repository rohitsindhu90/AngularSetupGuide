import { ReportingGroupDetailsProvider } from '../_common/reporting-group-details-provider';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
//import { DropdownModule, SelectItem, TabViewModule } from 'primeng-dev-ng4/primeng';
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceService } from '../_services/invoice.service';
import { BENDetailService } from '../_services/bendetail.service';
import { Invoice } from "../_models/invoice";
import { LinkType } from '../_services/enumtype';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { Router } from '@angular/router';
import { GenericService } from '../_services/generic.service';
import { Column } from '../_models/primeng-datatable';
import { InvoiceReportService } from '../_services/invoice-report.service';
@Component({
    selector: 'invoice-fleet',
    templateUrl: './invoice.fleet.component.html'

})

export class InvoiceFleetComponent implements OnInit, AfterViewInit, OnDestroy {

    model: Invoice[];
    @Input() linktype: string;
    @Input() invoicedateguid: string;
    @Input() networkguid: string;
    @Input() billingplatformguid: string;
    @Input() benguid: string;
    @Input() ban: string;
    @Input() isbandisplay: boolean;
    @Input() isbendisplay: boolean;
    @Input() linksourceguid: string
    @Input() rtypeguid: string;
    @Input() invoicemonthname: string;
    @Input() isobservationdrilldown: boolean

    @Input() r1: string;
    @Input() r2: string;
    @Input() r3: string;
    @Input() r4: string;
    @Input() r5: string;
    @Input() r6: string;


    isbillingplatformxist: boolean;
    networkfilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];
    private loader: EventEmitter<any>;
    csvfilename: string;
    subscription: any;
    datacolumns: Column[] = [];
    gridwidth: number = 3300;//(3150 + 150);
    gridcolumn: number = 22;
    filters: { [s: string]: any; } = {};
    networkFilter:any;
    billingFilter:any;
    qBenFilter:any;
    qBanFilter:any;
    /* Constructor: used to inject services
      */
    constructor(private authenticationService: AuthenticationService, private invoiceService: InvoiceService, private globalEvent: GlobalEventsManager, private router: Router,
        private bendetailService: BENDetailService, private genericService: GenericService, private invoicereportservice: InvoiceReportService) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.filters["reportinggroup1"] = { value: this.r1, matchMode: "equals" };
        this.filters["reportinggroup2"] = { value: this.r2, matchMode: "equals" };
        this.filters["reportinggroup3"] = { value: this.r3, matchMode: "equals" };
        this.filters["reportinggroup4"] = { value: this.r4, matchMode: "equals" };
        this.filters["reportinggroup5"] = { value: this.r5, matchMode: "equals" };
        this.filters["reportinggroup6"] = { value: this.r6, matchMode: "equals" };
    }

    ngAfterViewInit() {

        this.subscription = this.globalEvent.refreshInvoiceFleet.subscribe((data: any) => {
            //this.bendetailService.IsBenExistForCompanyAsnyc().then(res => {
            this.csvfilename = "InvoiceFleet" + " " + this.invoicemonthname;
            //Get Reporting Group details 
            var p1 = this.invoicereportservice.getReportingGroupDetails(true).then(res => {

                this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);

                this.gridcolumn = this.gridcolumn + this.datacolumns.length;
                this.gridwidth = this.gridwidth + (this.datacolumns.length * 150);

            });
            var p2 = this.IsBillingPlatformExistForCompanyAsnyc();
            var p3 = this.getInvoiceList();
            this.loader.emit(Promise.all([p1, p2, p3]).then((data) => {

                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            }));

        });
    }


    handleRowSelect(event: any) {

        let invoiceviewmodel: Invoice = event.data;

        this.router.navigate(['invoice-itemised-bill', this.invoicedateguid, invoiceviewmodel.mobilenumber], { queryParams: { ben: invoiceviewmodel.benguid, ban: invoiceviewmodel.banguid, bp: invoiceviewmodel.billingplatformguid } });


    }

    //Check for Billing platform exist for company to Display column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid).then(res => {
            this.isbillingplatformxist = res;
        });
    }
    getInvoiceList(): Promise<any> {

        return this.invoiceService.getInvoiceList(this.linktype, this.invoicedateguid, null, this.networkguid, this.linksourceguid, this.rtypeguid, this.billingplatformguid, this.benguid, this.ban, this.isobservationdrilldown).then(q => {
            this.model = q;
            this.clearGridFilter();
            //Getting  network  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => { this.networkfilterset.push(q); });

            //Getting  ben  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.ben === obj.ben }) === index).map(q => {
                return { 'value': q.bendescription, 'label': q.bendescription, sortValue: q.ben };
            }).sort((a, b) => {
                return a.sortValue - b.sortValue;
            }).forEach(q => {
                if (q.value) {
                    this.benfilterset.push(q);
                }
            });

            //Getting  billing platform  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
            }).forEach(q => {
                if (q.value) {
                    this.billingplatformfilterset.push(q);
                }
            });


            //Getting  ben  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.ban === obj.ban }) === index).map(q => {
                return { 'value': q.ban, 'label': q.ban };
            }).sort((a, b) => {
                return parseInt(a.value) - parseInt(b.value);
            }).forEach(q => {
                if (q.value) {
                    this.banfilterset.push(q);
                }
            });



        });
    }
    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];

    }
    /**
  * to destroy the emit subscription on ngOnDestroy otherwise it keeps into the memory for root
*/
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;

        }
    }

    dignose() {
        return JSON.stringify(this.model);
    }
}
