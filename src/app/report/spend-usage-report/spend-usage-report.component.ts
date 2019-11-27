// #region Imports


import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { SpendUsageViewModel } from 'src/app/_models/report/spendusagemodel';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { NetworkService } from 'src/app/_services/network.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { CustomReuseStrategy } from 'src/app/_common/custom-route-reuse-strategy';


// #endregion

// #region Component Decorator

@Component({
    selector: 'spend-usage-report',
    templateUrl: './spend-usage-report.component.html'
})

// #endregion

// #region SpendUsageReportComponent

export class SpendUsageReportComponent implements OnInit {

    // #region Variable Decalration/Initialization

    private loader: EventEmitter<any>;
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthdetailArray: SelectItem[] = [];
    fromdate: Date;
    todate: Date;
    isbenexist: boolean;
    isbanexist: boolean;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* BEN List */
    benArray: SelectItem[];
    benguid: string;

    /* BAN List */
    banArray: SelectItem[];
    ban: string;

    csvfilename: string;
    error: string;
    model: SpendUsageViewModel[];
    noInvoiceAvailable?: boolean;

    //reportinggroupviewmodel: ReportingGroupViewModel[];
    reportinggrouparray: SelectItem[];
    criteria: string;
    criteriaDisplayName: string;


    // #endregion
    
    // #region constructor

    constructor(//private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,
        private router: Router,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    // #endregion
    
    // #region ngOnInit

    ngOnInit() {
        var process1 = this.IsBenExistForCompanyAsnyc();
        // var process2 = this.loadFilterTypeDropDown();
        var process3 = this.loadInvoiceMonthsNetworkCC();
        var process4 = this.loadReportingGroupList();
        this.loader.emit(Promise.all([process1, process3, process4]).then(x => { this.loadSpendUsageReport() }));

    }

    // #endregion
    
    // #region Dropdown Data Binding Functions

    loadInvoiceMonthsNetworkCC(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));
                //to get invoidedateguid for drill down parameter
                data.forEach(item => this.invoicemonthdetailArray.push({
                    label: item.invoicedateguid,
                    value: item.startdate,
                }));

                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.noInvoiceAvailable = false;


                this.csvfilename = "SpendUsage_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                this.loadNetworkDropdown();
                this.loadBillingPlatformDropDown();
                this.loadBenDropDown();
                this.loadBanDropDown();

            }
            else {
                this.noInvoiceAvailable = true;
            }
        });

    }

    loadNetworkDropdown() {
        
        this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
            this.clearNetworks();
            if (data != null) {
                this.networkArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid
                }));
            }
        });
    }

    loadBillingPlatformDropDown(): Promise<any> {
        this.clearBillingPlatform();
        if (this.networkguid != undefined) {
            return this.networkService.getBillingPlatforms(this.networkguid, false, this.fromdate, this.todate).then((data) => {
                if (data && data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item.billingplatformguid
                    }));
                }
            });
        }
    }

    loadBenDropDown(): Promise<any> {
        this.clearBens();
        return this.bendetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {

                if (data.length > 1) {
                    this.isbenexist = true;
                }

                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });


    }

    loadBanDropDown(): Promise<any> {
        this.clearBans();

        return this.invoiceService.getBanList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                if (data.length > 1) {
                    this.isbanexist = true;
                }

                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

    // #endregion
    
    // #region Dropdown Clear Methods

    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        // this.model = [];
    }

    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    clearBans() {
        this.banArray = [];
        this.ban = null;
    }

    // #endregion
    
    // #region Dropdown onChange Methods

    onReportingGroupChange() {
        this.criteriaDisplayName = this.reportinggrouparray.filter(x => x.value == this.criteria)[0].label;
        this.loadSpendUsageReport();
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadBillingPlatformDropDown();
            this.loadBenDropDown();
            this.loadBanDropDown();
            this.loadSpendUsageReport();
            this.csvfilename = "SpendUsage_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBenDropDown();
        let process3 = this.loadBanDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.loadSpendUsageReport();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.loadSpendUsageReport();
    }

    // #endregion
    
    // #region Check for IsBenExistForCompanyAsnyc to Dispaly column in grid

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    // #endregion
    
    // #region Check for Billing platform exist for company to Dispaly column in grid

    // #endregion
    
    // #region Check for BAN exist for company to Dispaly column in grid

    // #endregion
    
    // #region Load Report Data

    /**
    * Load the Spend Usage Data report for given company
    */
    loadSpendUsageReport() {

        this.loader.emit(this.invoiceReportService.GetSpendUsageData(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.ban, UtilityMethod.IfNull(this.criteria, "")).then((data) => {
            this.model = data;
        }));
    }

    loadReportingGroupList(): Promise<any> {

        return this.invoiceReportService.getReportingGroupDetails(true).then(res => {
            this.reportinggrouparray = [];
            res.forEach(x => {
                this.reportinggrouparray.push({ value: x.description, label: x.displayname });

            });
            this.criteria = this.reportinggrouparray[0].value;
            this.criteriaDisplayName = this.reportinggrouparray[0].label;
        });

    }

    // #endregion
    
    // #region Grid Row Event


    onRowSelect(event: any) {
        //CustomReuseStrategy.clearSnapshotByRoutePath("total-billing-information");
        this.router.navigate(['total-billing-information'], { queryParams: { fd: this.fromdate, td: this.todate, nid: this.networkguid, rg: this.criteria.toLocaleLowerCase(), banid: this.ban, benid: this.benguid, rgid: event.data.criteriaguid ,bp: this.billingplatformguid} });
    }

    // #endregion
         
    // #endregion
}