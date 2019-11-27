// #region Imports
import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Column } from 'src/app/_models/primeng-datatable';
import { InvoiceDate } from 'src/app/_models/InvoiceDate';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { ZeroUsageViewModel } from 'src/app/_models/report/zerousage.model';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { UtilityMethod } from 'src/app/_common/utility-method';
// #endregion

// #region  Component Decorator

@Component({
    selector: 'zero-usage-report',
    templateUrl: './zero-usage-report.component.html'
})
// #endregion

// #region ZeroUsageReportComponent

export class ZeroUsageReportComponent implements OnInit {
    
    // #region Variable Decalration/Initialization
    private loader: EventEmitter<any>;
    error: string;

    datacolumns: Column[] = [];
    invoicedatedata: InvoiceDate[];
    reportingList: ReportingGroupViewModel[];
    ////zero usage report data
    model: ZeroUsageViewModel[];

    ///* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    todate?: Date;

    networkfilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];
    statusdescriptionset: any[] = [{ value: null, label: "" }];

    isbenexist: boolean;
    isbillingplatformxist: boolean;
    isbanexist: boolean;

    /* Networks */
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
    noInvoiceAvailable?: boolean;
    
    qFilter:any;
    billingFilter:any;
    benFilter:any;
    qBanFilter:any;
    // #endregion

    // #region constructor

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailservice: BENDetailService,
        private genericservice: GenericService,
        private invoiceService: InvoiceService,
        private networkService: NetworkService,
        private router: Router) {

        this.loader = globalEvent.busySpinner;
    }

    // #endregion

    // #region ngOnInit

    ngOnInit() {

        let process1 = this.loadReportingGroups();
        let process2 = this.loadInvoiceMonths();
        this.loader.emit(Promise.all([process1, process2]).then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadData();
            }
        }));



    }

    // #endregion

    // #region Dropdown Data Binding Functions

    loadReportingGroups(): Promise<any> {
        return this.invoiceReportService.getReportingGroupDetails(true).then(res => {
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
    }

    loadNetwork(): Promise<any> {
      

        return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
            this.clearNetworks();
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
        //this.benDetailService.getBenDetailList().then((data) => {
        return this.bendetailservice.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
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
    
    loadInvoiceMonths() {
        this.clearInvoiceMonths();
        this.invoiceDateService.getInvoiceMonth().then((data) => {
            this.invoicedatedata = data;
            if (data.length > 0) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));
                this.noInvoiceAvailable = false;
                this.todate = data[0].startdate;
                this.fromdate = data[0].startdate;                
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }
    
    // #endregion

    // #region Dropdown Clear Methods

    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    clearBans() {
        this.banArray = [];
        this.banguid = null;
    }

    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
    }

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
        this.statusdescriptionset = [{ value: null, label: "" }];
    }

    // #endregion

    // #region Dropdown onChange Methods

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            var process1 = this.loadBillingPlatformDropDown();            
            var process2 =this.loadBenDropDown();
            var process3 = this.loadBanDropDown();                        
            this.loader.emit(Promise.all([process1, process3, process2]).then(x => { this.loadZeroUsageReport() }));
        }
    }

    onNetworkChange() {

        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        let process4 = this.IsBillingPlatformExistAsnyc();
        this.loader.emit(Promise.all([process1, process2, process3, process4]));
        this.loadZeroUsageReport();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.loadZeroUsageReport();
    }

    onChangeBen() {

        this.loadZeroUsageReport();
    }

    onChangeBan() {
        this.loadZeroUsageReport();
    }

    // #endregion

    // #region Check for IsBenExistForCompanyAsnyc to Dispaly column in grid

    IsBenExistAsnyc(): Promise<any> {
        return this.bendetailservice.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    // #endregion

    // #region Check for Billing platform exist for company to Dispaly column in grid

    IsBillingPlatformExistAsnyc(): Promise<any> {
        return this.genericservice.IsBillingExistForCompanyAsnyc(this.networkguid, this.fromdate, this.todate).then(res => {
            this.isbillingplatformxist = res;
        });
    }

    // #endregion

    // #region Check for BAN exist for company to Dispaly column in grid

    IsBANDisplay(): Promise<any> {
        return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbanexist = res);
    }

    // #endregion

    // #region Load Report Data

    loadData() {
        let process1 = this.loadNetwork();
        this.loader.emit(Promise.all([process1]).then(() => {


            var process2 = this.IsBillingPlatformExistAsnyc();
            var process3 = this.IsBANDisplay();
            let process4 = this.loadBenDropDown();
            let process5 = this.loadBanDropDown();
            var process6 = this.IsBenExistAsnyc();
            Promise.all([process6, process2, process3, process4, process5]).then(() =>
                this.loadZeroUsageReport()
            );
        }));
    }

    loadZeroUsageReport()  {
        //  this.billingplatformguid = null;
        this.loader.emit(this.invoiceReportService.GetZeroUsageReport(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.banguid).then((data) => {
            this.clearGridFilter();
            this.model = data;
            this.refreshGridFilter(data);
        }));
    }

    refreshGridFilter(data: ZeroUsageViewModel[]) {
        this.clearGridFilter();

        //Getting  Status  list from grid data
        data.filter((obj, index, self) => self.findIndex((t) => { return t.statusdescription === obj.statusdescription }) === index).map(q => {
            return { 'value': q.statusdescription, 'label': q.statusdescription };
        }).forEach(q => {
            if (this.statusdescriptionset.filter(n => n.value == q.value).length == 0) {
                this.statusdescriptionset.push(q);
            }
        });

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
            data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                return { 'value': q.bendescription, 'label': q.bendescription };
            })//.sort((a, b) => { return a.value - b.value; })
                .forEach(q => {
                    this.benfilterset.push(q);
                });
        }

        if (this.isbillingplatformxist) {
            //Getting  billing platform  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
            }).forEach(q => {
                this.billingplatformfilterset.push(q);
            });
        }

        if (this.isbanexist) {
            //Getting  ben  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.bandescription === obj.bandescription }) === index).map(q => {
                return { 'value': q.bandescription, 'label': q.bandescription };
            }).sort((a, b) => {
                return parseInt(a.value) - parseInt(b.value);
            }).forEach(q => {
                if (q.value) {
                    this.banfilterset.push(q);
                }
            });
        }
    }

    // #endregion

}
// #endregion

