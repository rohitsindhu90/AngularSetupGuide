// #region Imports

import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primengdevng8/api';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { InternationalReportViewModel } from 'src/app/_models/report/international-report.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
// #endregion

// #region Component Decorator

@Component({
    selector: 'international-report',
    templateUrl: './international-report.component.html'
})

// #endregion

// #region InternationalReportComponent

export class InternationalReportComponent implements OnInit {

    // #region Variable Decalration/Initialization



    private loader: EventEmitter<any>;

    networkfilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];

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
    banguid: string;


    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    todate?: Date;
    isbandisplay: boolean = false;

    calltypelist: any[] = [{ value: "0", label: "All" }, { value: "Voice", label: "Calls" }, { value: "SMS", label: "Text" }];
    calltype: string = "0";


    reportingList: ReportingGroupViewModel[];
    noInvoiceAvailable?: boolean;
    model: InternationalReportViewModel[];

    qNetworkFilter:any;
    qBillingPlatformFilter:any;
    qBenFilter:any;
    qBanFilter:any;
    // #endregion

    // #region constructor


    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private invoiceService: InvoiceService,
        private networkService: NetworkService,
        private benDetailService: BENDetailService,
        private router: Router) {

        this.loader = globalEvent.busySpinner;
    }
    // #endregion

    // #region ngOnInit

    ngOnInit() {

        var process4 = this.loadInvoiceMonths(false);
        process4.then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadReportingGroups();
                this.loadData();
            }

        });
    }

    // #endregion

    // #region Dropdown Data Binding Functions

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

    loadBenDropDown(): Promise<any> {
        this.clearBens();

        return this.benDetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
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
                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

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
                this.csvfilename = "InternationalReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                if (!!refreshData) {

                    this.refreshData();
                }
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    loadReportingGroups(): Promise<any> {
        return this.invoiceReportService.getReportingGroupDetails().then((data) => {
            this.reportingList = data;

        });
    }
 
    // #endregion

    // #region Dropdown Clear Methods

    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }

    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        this.model = [];
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
        this.banguid = null;
    }

    // #endregion

    // #region Dropdown onChange Methods

    OnNetworkChange() {

        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        let process4 = this.IsBillingPlatformExistForCompanyAsnyc();
        this.loader.emit(Promise.all([process1, process2, process3, process4]).then(() => {
            this.refreshData();
        }));
        
    }

    onChangeBen() {
        this.refreshData();
    }

    onChangeBan() {
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.refreshData();
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadData();
            this.csvfilename = "InternationalReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    // #endregion

    // #region Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, null, null, this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }
    // #endregion

    // #region Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid).then(res => {
            this.isbillingplatformxist = res;
        });
    }
    // #endregion

    // #region Check for BAN exist for company to Dispaly column in grid
    IsBANDisplay(): Promise<any> {
        return this.invoiceService.IsBanDisplay(null, null, null, this.fromdate, this.todate).then(res => this.isbandisplay = res);
    }
    // #endregion

    // #region Load Report Data

    loadRoamedReport() {

        this.loader.emit(this.invoiceReportService.GetInternationalReportDetails(this.fromdate, this.todate, this.calltype, this.networkguid, this.billingplatformguid, this.benguid, this.banguid).then((data) => {

            this.clearGridFilter();

            this.model = data;

            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });

            if (this.isbenexist) {
                //Getting  ben  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.ben === obj.ben }) === index).map(q => {
                    return { 'value': q.bendetailid, 'label': q.ben };
                }).sort((a, b) => {
                    return a.value - b.value;
                }).forEach(q => {
                    if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                        this.benfilterset.push(q);
                    }
                });

            }
            
            if (this.isbillingplatformxist) {
                //Getting  billing platform  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                    return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
                }).forEach(q => {
                    if (this.billingplatformfilterset.filter(n => n.value == q.value).length == 0) {
                        this.billingplatformfilterset.push(q);
                    }
                });
            }

            if (this.isbandisplay) {
                //Getting  ban  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.ban === obj.ban }) === index).map(q => {
                    return { 'value': q.bandetailid, 'label': q.ban };
                }).sort((a, b) => {
                    return a.value - b.value;
                }).forEach(q => {
                    if (this.banfilterset.filter(n => n.value == q.value).length == 0) {
                        this.banfilterset.push(q);
                    }
                });

            }

        }));
    }

    loadData() {
        let process = this.loadNetwork();
        var process1 = this.IsBenExistForCompanyAsnyc();
        var process2 = this.IsBillingPlatformExistForCompanyAsnyc();
        var process3 = this.IsBANDisplay();
        let process4 = this.loadBenDropDown();
        let process5 = this.loadBanDropDown();
        let process6 = this.refreshData();
        Promise.all([process, process1, process2, process3, process4, process5, process6]);
    }

    refreshData() {
        this.loadRoamedReport();
    }

    // #endregion
}

// #endregion
