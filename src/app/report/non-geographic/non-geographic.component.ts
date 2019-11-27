import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { NonGeographicViewModel } from 'src/app/_models/report/non-geographic.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { UtilityMethod } from 'src/app/_common/utility-method';

@Component({
    selector: 'non-geographic-report',
    templateUrl: './non-geographic.component.html'
})
export class NonGeographicReportComponent implements OnInit {

    private loader: EventEmitter<any>;

    networkfilterset: any[] = [{ value: null, label: "" }];
    selectedNetwork: string;

    benfilterset: any[] = [{ value: null, label: "" }];
    selectedBen: string;

    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    selectedBillingPlatform: string;

    banfilterset: any[] = [{ value: null, label: "" }];
    selectedBan: string;

    csvfilename: string;
    error: string;
    isbenexist: boolean;
    isbillingplatformxist: boolean;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;

    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* Ben List */
    benArray: SelectItem[];
    benguid: string;

    /* Ban List */
    banArray: SelectItem[];
    ban: string;


    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    todate?: Date;
    isbandisplay: boolean = false;
    noInvoiceAvailable?: boolean;
    model: NonGeographicViewModel[];

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private genericService: GenericService,
        private invoiceService: InvoiceService,
        private networkService: NetworkService,
        private benDetailService: BENDetailService,
        private router: Router) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        let process4 = this.loadInvoiceMonths(false);
        process4.then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadData();
            }
            
        });
        //this.refreshData();
    }

    loadData() {
        let process6 = this.loadNetwork();
        this.loader.emit(Promise.all([process6]).then(() => {
            var process1 = this.IsBenExistForCompanyAsnyc();
            var process2 = this.IsBillingPlatformExistForCompanyAsnyc();
            var process3 = this.IsBANDisplay();
            let process8 = this.loadBenDropDown();
            let process9 = this.loadBanDropDown();
            Promise.all([process1, process2, process3, process8, process9]).then(() =>
                this.refreshData()
            );
        }));
    }

    loadNetwork(): Promise<any> {
        this.clearNetworks();

        return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
            if (data != null) {
                this.networkArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid
                }));
            }
        });
    }

    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    loadBillingPlatformDropDown() {
        this.clearBillingPlatform();
        if (this.networkguid != undefined) {
            this.networkService.getBillingPlatforms(this.networkguid, false, this.fromdate, this.todate).then((data) => {
                if (data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item.billingplatformguid
                    }));
                }
            });
        }
    }

    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    loadBenDropDown(): Promise<any> {
        this.clearBens();
        //this.benDetailService.getBenDetailList().then((data) => {
        return this.benDetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });


    }

    /*Load the ban for the given company and selected netwok */
    loadBanDropDown(): Promise<any> {
        this.clearBans();
        return this.invoiceService.getBanList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    clearBans() {
        this.banArray = [];
        this.ban = null;
    }

    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }

    onChangeBen() {
        this.refreshData();
    }

    onChangeBan() {
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.benDetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid, this.fromdate, this.todate).then(res => {
            this.isbillingplatformxist = res;
        });
    }

    //Check for BAN exist for company to Dispaly column in grid
    IsBANDisplay(): Promise<any> {
        return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbandisplay = res);
    }

    /**
    * Load the avaialble months for given company
    */
    loadInvoiceMonths(refreshData: boolean = true): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));
                this.noInvoiceAvailable = false;
                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.csvfilename = "NonGeographicReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                if (!!refreshData) {
                    
                    this.refreshData();
                }
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }


    loadRoamedReport() {
        this.loader.emit(this.invoiceReportService.GetNongeograpicDetails(this.fromdate, this.todate, this.networkguid,
            UtilityMethod.IfNull(this.billingplatformguid, ''),
            UtilityMethod.IfNull(this.benguid, ''),
            UtilityMethod.IfNull(this.ban, '')).then((data) => {
                this.clearGridFilter();
                this.model = data;
            }));
    }

    /**
    * Clears the invoice months and selection
    */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        this.model = [];
    }

    //On Invoice Change 
    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadData();
            this.csvfilename = "NonGeographicReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    refreshData() {
        this.loadRoamedReport();
    }

    handleRowSelect($event: any) {
        
        let diallednumber = $event.data.diallednumber;
        let serviceused = $event.data.serviceused;
        this.router.navigate(['non-geographic-itemised', diallednumber, serviceused], {
            queryParams: {
                fd: this.fromdate,
                td: this.todate,
                fdate: this.invoicemonthArray.find(x => x.value == this.fromdate).label,
                tdate: this.invoicemonthArray.find(x => x.value == this.todate).label,
                nid: this.networkguid,
                ndes: !!this.networkguid ? this.networkArray.find(c => c.value == this.networkguid).label : (this.networkArray.length > 1 ? "All": null),
                bp: this.billingplatformguid,
                bpdes: (!!this.billingPlatformArray && this.billingPlatformArray.length !== 0) ? (!!this.billingplatformguid ? this.billingPlatformArray.find(c => c.value == this.billingplatformguid).label : "All") : null,
                benGuid: this.benguid,
                bendes: (!!this.benArray && this.benArray.length !== 0) ? (!!this.benguid ? this.benArray.find(c => c.value == this.benguid).label : "All") : null,
                ban: this.ban,
                bandes: (!!this.banArray && this.banArray.length !== 0) ? (!!this.ban ? this.banArray.find(c => c.value == this.ban).label : "All") : null

            }
        });

    };
}