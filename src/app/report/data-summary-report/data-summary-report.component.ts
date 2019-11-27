import { Component, OnInit, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager'
import { DataSummaryReportViewModel } from 'src/app/_models/report/data-summary-report.model';
import { SelectItem } from 'primengdevng8/api';
import { BillingPlatform } from 'src/app/_models/billingplatform';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { NetworkService } from 'src/app/_services/network.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ReportingGroupsGuid } from 'src/app/_models/reportinggroup1';

@Component({
    selector: 'data-summary-report',
    templateUrl: './data-summary-report.component.html'
})
export class DataSummaryReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    model: DataSummaryReportViewModel[];
    error: string;
    isbenexist: boolean;
    isbanexist: boolean;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    //invoicemonthdetailArray: SelectItem[] = [];
    fromdate: Date;
    todate: Date;

    /* Networks */
    networkArray: { label: string, value: any, guid: string }[];
    networkID: number;
    /* Billing Platforms */
    billingPlatformArray: { label: string, value: any, guid: string }[];
    billingplatformID: number;
    selectedbillingPlatfrom: BillingPlatform;

    /* Ben List */
    benArray: SelectItem[];
    benID: number;
    /* Ban List */
    banArray: SelectItem[];
    banID: number;


    csvfilename: string;
    reportinggroup1ID: number;
    reportinggroup2ID: number;
    reportinggroup3ID: number;
    reportinggroup4ID: number;
    reportinggroup5ID: number;
    reportinggroup6ID: number;
    colspan: number = 9;
    colWidth: number = 1350;
    noInvoiceAvailable?: boolean;

    constructor(
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private globalEvent: GlobalEventsManager,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,

    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loadInvoiceMonthsNetworkCC();
    }



    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadInvoiceMonthsNetworkCC(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));

                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.noInvoiceAvailable = false;
                this.csvfilename = "DataSummaryReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                this.loadNetworkDropdown();
                this.loadBillingPlatformDropDown();
                this.loadBenDropDown();
                this.loadBanDropDown();
                this.RefreshData();

            }
            else {
                this.noInvoiceAvailable = true;
            }
        });

    }


    RefreshData() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            this.loader.emit(this.loadDataSummaryReport());
        }
    }


    /**
     * load charge summary report
     */
    loadDataSummaryReport(): Promise<any> {
        //this.csvfilename = "HandsetTotalReport " + this.invoicemonthArray.filter(x => x.value === this.invoicedateguid)[0].label;
        return this.invoicereportservice.getDataSummaryReport(this.fromdate, this.todate, this.networkID, this.billingplatformID, this.benID, this.banID,
            this.reportinggroup1ID, this.reportinggroup2ID, this.reportinggroup3ID, this.reportinggroup4ID, this.reportinggroup5ID, this.reportinggroup6ID).then(data => {
                this.model = data;
            });
    }

    /**
        * Load the network array for the given company
        */
    loadNetworkDropdown() {
        
        this.networkService.getNetworkList().then((data) => {
            this.clearNetworks();
            if (data != null) {
                this.networkArray.push({ label: 'ALL', value: null, guid: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.id, guid: item.networkguid
                }));
            }
        });
    }

    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatformDropDown() {
        this.clearBillingPlatform();
        if (this.networkID != undefined) {
            this.networkService.getBillingPlatforms(this.getNetWorkGuid(this.networkID), false, this.fromdate, this.todate, '').then((data) => {
                if (data && data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null, guid: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item, guid: null
                    }));
                }
            });
        }
    }

    /**
    * Load the ben for the given company and selected network
    */
    loadBenDropDown() {
        this.clearBens();
        return this.bendetailService.getBenDetailList(null, this.getNetWorkGuid(this.networkID), this.getBillingPlatformGuid(this.billingplatformID), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {

                if (data.length > 1) {
                    this.isbenexist = true;
                }

                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benid
                }));
            }
        });


    }

    /*Load the ban for the given company and selected netwok */
    loadBanDropDown() {
        this.clearBans();
        this.invoiceService.getBanList(null, this.getNetWorkGuid(this.networkID), this.getBillingPlatformGuid(this.billingplatformID), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                if (data.length > 1) {
                    this.isbanexist = true;
                }

                this.banArray.push({ label: 'ALL', value: "" });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banid
                }));
            }
        });
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadNetworkDropdown();
            this.loadBillingPlatformDropDown();
            this.loadBenDropDown();
            this.loadBanDropDown();
            this.RefreshData();
            this.csvfilename = "HandsetTotalReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }

    }
    /**
     * Load the top usage grid and billing platforms for the given company and selected network
     */
    OnNetworkChange() {
        this.loadBillingPlatformDropDown();
        this.loadBenDropDown();
        this.loadBanDropDown();
        this.RefreshData();
        //this.loader.emit(Promise.all([process1, process2, process3, process4]));

    }

    /**
    * Load the billing platforms for the given company and selected network
    */
    onChangeBillingPlatForm() {
        this.billingplatformID = this.selectedbillingPlatfrom ? this.selectedbillingPlatfrom.id : null;
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.RefreshData();
    }

    /**
    * Clears the invoice months and selection
    */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        // this.model = [];
    }


    /**
     * Clears the networks dropdown and selecttion
     */
    clearNetworks() {
        this.networkArray = [];
        this.networkID = null;
    }

    /**
    * Clears the billing platform and selection
    */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformID = null;
    }

    /**
      * Clears the ben dropdown and selecttion 
      */
    clearBens() {
        this.benArray = [];
        this.benID = null;
    }

    /**
    * Clears the ban dropdown and selecttion
    */
    clearBans() {
        this.banArray = [];
        this.banID = null;
    }

    onChangeReportingGroupEvent(reportinggroupsguidids: ReportingGroupsGuid) {
        if (reportinggroupsguidids != null) {
            this.reportinggroup1ID = reportinggroupsguidids.reportinggroup1id;
            this.reportinggroup2ID = reportinggroupsguidids.reportinggroup2id;
            this.reportinggroup3ID = reportinggroupsguidids.reportinggroup3id;
            this.reportinggroup4ID = reportinggroupsguidids.reportinggroup4id;
            this.reportinggroup5ID = reportinggroupsguidids.reportinggroup5id;
            this.reportinggroup6ID = reportinggroupsguidids.reportinggroup6id;

            this.RefreshData();
        }
    }

    getNetWorkGuid(networkID: number): string {
        let networkGUID: string;
        if (networkID) {
            let network = this.networkArray.find(a => a.value == networkID);
            networkGUID = network ? network.guid : null;
        }
        return networkGUID;
    }

    getBillingPlatformGuid(billingPlatFormID: number): string {
        let billingPlatFormGUID: string;
        if (billingPlatFormID) {
            let billingPlatForm = this.billingPlatformArray.find(a => a.value == billingPlatFormID);
            billingPlatFormGUID = billingPlatForm ? billingPlatForm.guid : null;
        }
        return billingPlatFormGUID;
    }
}