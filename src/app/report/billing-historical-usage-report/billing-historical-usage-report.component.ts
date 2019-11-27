import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ViewContainerRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primengdevng8/api';
import { NetworkService } from "../../_services/network.service";
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { CallClassReportViewModel, CallClassReportGraphModel } from '../../_models/report/call-class-report-details.model';

import { GenericService } from '../../_services/generic.service';
import { InvoiceService } from '../../_services/invoice.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { BENDetailService } from '../../_services/bendetail.service';
import { UtilityMethod } from '../../_common/utility-method';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ClientControlEnum } from '../../_services/enumtype';
declare let Chart: any;

@Component({
    selector: 'billing-historical-usage-report',
    templateUrl: './billing-historical-usage-report.component.html'
})
export class BillingHistoricalUsageReportComponent implements OnInit {



    private loader: EventEmitter<any>;
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicedateguid: string;
    fromdate?: Date;
    todate?: Date;

    ismpayexist: boolean;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;



    /* Ben List */
    benArray: SelectItem[];
    benID: number;

    banArray: SelectItem[];
    banID: number;

    callclassreportviewmodel: CallClassReportViewModel[];
    isbenexist: boolean;
    isbillingplatformExist: boolean;
    isbanexist: boolean
    isInvoiceActive: boolean = true;
    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;

    reportinggroup1ID: number;
    reportinggroup2ID: number;
    reportinggroup3ID: number;
    reportinggroup4ID: number;
    reportinggroup5ID: number;
    reportinggroup6ID: number;
    noInvoiceAvailable: boolean;
    istotalbillingcallcostvisible: boolean;
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : UploadInvoiceService to inject
     */
    constructor(private networkService: NetworkService,
        private invoicereportservice: InvoiceReportService,
        private invoiceService: InvoiceService,
        private genericService: GenericService,
        private globalEvent: GlobalEventsManager,
        private bendetailService: BENDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private clientcontrolservice: ClientControlService,
        private invoiceDateService: InvoiceDateService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        let process1 = this.loadInvoiceMonths();

        this.clientcontrolservice.GetClientControlByKey(ClientControlEnum.TotalBillingCallCost).then(r => {
            this.istotalbillingcallcostvisible = r.active;
        });

        this.loader.emit(Promise.all([process1]).then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadData();
            }
        }));

    }

    loadInvoiceMonths() {
        this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length > 0) {
                this.noInvoiceAvailable = false;
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    loadData() {
        let process1 = this.loadNetwork();
        //this.loader.emit(Promise.all([process1]).then(() => {

        let process8 = this.loadBillingUsageReport();
        let process2 = this.IsBenExistAsnyc();
        let process3 = this.IsBillingPlatformExistAsnyc();
        let process4 = this.IsBANDisplay();
        let process5 = this.loadBenDropDown();
        let process6 = this.loadBanDropDown();
        let proess7 = this.IsMPAYExist();

        this.loader.emit(Promise.all([process8, process1, process2, process3, process4, process5, process6, proess7]));
        // }));
    }


    //Check for IsMPAYExist to Dispaly column in grid
    IsMPAYExist() {
        return this.invoiceService.IsMPAYExistForAny().then(res => {
            this.ismpayexist = res;
        })
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

    IsBenExistAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid, this.fromdate, this.todate).then(res => {
            this.isbillingplatformExist = res;
        });
    }

    IsBANDisplay(): Promise<any> {
        return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbanexist = res);
    }

    loadBenDropDown(): Promise<any> {
        this.clearBens();
        //this.benDetailService.getBenDetailList().then((data) => {
        return this.bendetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benid
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
                    label: item.description, value: item.banid
                }));
            }
        });
    }

    clearBens() {
        this.benArray = [];
        this.benID = null;
    }

    clearBans() {
        this.banArray = [];
        this.banID = null;
    }

    refreshData() {
        var p1 = this.loadBillingUsageReport();
        this.loader.emit(Promise.all([p1]));

    }

    //Binding Grid Data
    loadBillingUsageReport(): Promise<any> {

        return this.invoicereportservice.GetBillingHistoricalUsageDataAsync(this.networkguid, this.billingplatformguid, this.benID, this.banID
            , this.reportinggroup1ID, this.reportinggroup2ID, this.reportinggroup3ID, this.reportinggroup4ID, this.reportinggroup5ID, this.reportinggroup6ID).then(res => {
                this.callclassreportviewmodel = res;

            });
    }


    onNetworkChange() {

        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        //this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }

    onChangeDropDown() {
        this.refreshData();
    }

    onChangeReportingGroupEvent(reportinggroupsguidids: any) {

        if (reportinggroupsguidids != null) {
            this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
            this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
            this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
            this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
            this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
            this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

            this.reportinggroup1ID = reportinggroupsguidids.reportinggroup1id;
            this.reportinggroup2ID = reportinggroupsguidids.reportinggroup2id;
            this.reportinggroup3ID = reportinggroupsguidids.reportinggroup3id;
            this.reportinggroup4ID = reportinggroupsguidids.reportinggroup4id;
            this.reportinggroup5ID = reportinggroupsguidids.reportinggroup5id;
            this.reportinggroup6ID = reportinggroupsguidids.reportinggroup6id;

            this.refreshData();
        }
    }
}