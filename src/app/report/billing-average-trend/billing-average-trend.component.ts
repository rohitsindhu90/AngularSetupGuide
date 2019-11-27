import { Component, EventEmitter, OnInit } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';

import { GlobalEventsManager } from '../../_common/global-event.manager';
import { BENDetailService } from '../../_services/bendetail.service';
import { NetworkService } from "../../_services/network.service";
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { GenericService } from '../../_services/generic.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { InvoiceService } from "../../_services/invoice.service";
import { UtilityMethod } from '../../_common/utility-method';
import { BillingUsageTrendListModel, BillingUsageTrendModel } from "../../_models/report/billingusagetrendmodel";
import { ReportingGroupViewModel } from '../../_models/report/ReportingGroupViewModel';

@Component({
    selector: 'app-billing-average-trend',
    templateUrl: './billing-average-trend.component.html'
})
/** billing-average-trend component*/
export class BillingAverageTrendComponent implements OnInit {
    private loader: EventEmitter<any>;
    csvfilename: string;
    error: string;
    invoicemonthArray: SelectItem[];
    // invoicemonthdetailArray: SelectItem[] = [];
    fromdate?: Date;
    todate?: Date;
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
    benID: number;

    /* BAN List */
    banArray: SelectItem[];
    banID: number;

    reportinggroup1guid: string;
    reportinggroup1description: string;
    reportinggroup2guid: string;
    reportinggroup2description: string;
    reportinggroup3guid: string;
    reportinggroup3description: string;
    reportinggroup4guid: string;
    reportinggroup4description: string;
    reportinggroup5guid: string;
    reportinggroup5description: string;
    reportinggroup6guid: string;
    reportinggroup6description: string;


    reportinggroup1ID: number;
    reportinggroup2ID: number;
    reportinggroup3ID: number;
    reportinggroup4ID: number;
    reportinggroup5ID: number;
    reportinggroup6ID: number;

    reportinggroupviewmodel: ReportingGroupViewModel[];
    isreportinggroupchangefired: boolean = false;
    noInvoiceAvailable?: boolean;
    model: BillingUsageTrendListModel[];
    colHeader: string[];
    gridColspan: number;
    gridWidth: string;
    constructor(private networkService: NetworkService,
        // private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private invoiceService: InvoiceService,
        private genericService: GenericService,
        private globalEvent: GlobalEventsManager,
        private bendetailservice: BENDetailService,
    ) {
        this.loader = globalEvent.busySpinner;

    }


    ngOnInit() {

        let process1 = this.loadInvoiceMonthsNetworkCC();
        this.loader.emit(Promise.all([process1]));
    }


    onPageLoad() {
        let process1 = this.loadBillingAverageTrendReport();
        let process2 = this.IsBenExistForCompanyAsnyc();
        let process3 = this.loadNetworkDropdown();
        let process4 = this.loadBillingPlatformDropDown();
        let process5 = this.loadBenDropDown();
        let process6 = this.loadBanDropDown();
        let process7 = this.loadReportingGroupList();
        this.loader.emit(Promise.all([process1, process2, process3, process4, process5, process6, process7]));

    }

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {


        return this.bendetailservice.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }
    /**
* Load the avaialble months for given company
*/
    loadInvoiceMonthsNetworkCC(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length) {

                //=====Get ONly 6 Month Data
                data.forEach((item, i) => {
                    if (i < 6) {
                        this.invoicemonthArray.push({
                            label: item.invoicedatedescription,
                            value: item.startdate,
                        });
                    }
                });

                if (this.invoicemonthArray.length) {
                    let fromdate = this.invoicemonthArray.length > 2 ? 2 : (this.invoicemonthArray.length - 1);
                    this.fromdate = data[fromdate].startdate;
                    this.todate = data[0].startdate;
                }
                this.noInvoiceAvailable = false;
                // this.onPageLoad();
                this.csvfilename = "BillingAverageTrend_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                this.onPageLoad();
            }
            else {
                this.noInvoiceAvailable = true;
            }

        })


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
       * Load the network array for the given company
       */
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


    /**
    * Clears the networks dropdown and selecttion
    */
    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    /**
     * Load the billing platforms for the given company and selected network
     */
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

    /**
    * Clears the billing platform and selection
    */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    /**
  * Load the ben for the given company and selected network
  */
    loadBenDropDown(): Promise<any> {
        this.clearBens();
        return this.bendetailservice.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            // this.bendetailService.getBenDetailList().then((data) => {
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

    /**
     * Clears the ben dropdown and selecttion
     */
    clearBens() {
        this.benArray = [];
        this.benID= null;
    }

    /*Load the ban for the given company and selected netwok */
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

    /**
* Clears the ban dropdown and selecttion
*/
    clearBans() {
        this.banArray = [];
        this.banID = null;
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loader.emit(this.loadBillingAverageTrendReport());
            this.csvfilename = "BillingAverageTrend_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    /**
   * Load the  grid and billing platforms for the given company and selected network
   */
    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBenDropDown();
        let process3 = this.loadBanDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.loader.emit(this.loadBillingAverageTrendReport());
    }


    /**
* Load the billing platforms for the given company and selected network
*/
    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.loader.emit(this.loadBillingAverageTrendReport());
    }


    /**
       * Load the ReportingGroup1 array for the given company
       */
    onChangeReportingGroupEvent(reportinggroupsguidids: any) {

        if (reportinggroupsguidids != null) {
            this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
            this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
            this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
            this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
            this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
            this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

            this.reportinggroup1description = reportinggroupsguidids.reportinggroup1description;
            this.reportinggroup2description = reportinggroupsguidids.reportinggroup2description;
            this.reportinggroup3description = reportinggroupsguidids.reportinggroup3description;
            this.reportinggroup4description = reportinggroupsguidids.reportinggroup4description;
            this.reportinggroup5description = reportinggroupsguidids.reportinggroup5description;
            this.reportinggroup6description = reportinggroupsguidids.reportinggroup6description;

            this.reportinggroup1ID = reportinggroupsguidids.reportinggroup1id;
            this.reportinggroup2ID = reportinggroupsguidids.reportinggroup2id;
            this.reportinggroup3ID = reportinggroupsguidids.reportinggroup3id;
            this.reportinggroup4ID = reportinggroupsguidids.reportinggroup4id;
            this.reportinggroup5ID = reportinggroupsguidids.reportinggroup5id;
            this.reportinggroup6ID = reportinggroupsguidids.reportinggroup6id;

            this.loader.emit(this.loadBillingAverageTrendReport());
            this.isreportinggroupchangefired = true;
        }
    }


    loadReportingGroupList(): Promise<any> {

        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            this.reportinggroupviewmodel = res;
        });

    }


    //Binding Grid Data
    loadBillingAverageTrendReport(): Promise<any> {

        let dynamicWidth: { id: number, width: string }[] = [{ id: 1, width: "410px" },
        { id: 2, width: "825px" },
        { id: 3, width: "950px" }]

        return this.invoicereportservice.GetBillingAverageTrendReport(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benID, this.banID, this.reportinggroup1ID, this.reportinggroup2ID
            , this.reportinggroup3ID, this.reportinggroup4ID, this.reportinggroup5ID, this.reportinggroup6ID).then(res => {

                //this.refreshGridFilter(res);
                this.model = [];
                let _self = this;
                let pivotDateForUsage = this.getPivotArray(res, "reportheader", "invoicedate", "usage");
                let pivotDateForCost = this.getPivotArray(res, "reportheader", "invoicedate", "cost");

                this.colHeader = [];
                for (var i = 1; i < pivotDateForUsage[0].length; i++) {
                    this.colHeader.push(pivotDateForUsage[0][i]);
                }

                let invoiceMonthDiff = this.colHeader.length;

                let combinedArray = pivotDateForUsage.forEach(function (item: any, i) {
                    if (i !== 0) {

                        let model: BillingUsageTrendListModel = new BillingUsageTrendListModel();
                        model.reportheader = item[0];
                        model.usage1 = item[1];
                        model.usage2 = item[2] || 0;
                        model.usage3 = item[3] || 0;
                        model.usage4 = item[4] || 0;
                        model.usage5 = item[5] || 0;
                        model.usage6 = item[6] || 0;
                        if (invoiceMonthDiff > 1) {
                            model.usage7 = _self.calCulatePresentage(item[invoiceMonthDiff] || 0, item[invoiceMonthDiff - 1] || 0);
                        }
                        else {
                            model.usage7 = 0;
                        }


                        let costItem = pivotDateForCost[i];
                        model.cost1 = costItem[1] || 0;
                        model.cost2 = costItem[2] || 0;
                        model.cost3 = costItem[3] || 0;
                        model.cost4 = costItem[4] || 0;
                        model.cost5 = costItem[5] || 0;
                        model.cost6 = costItem[6] || 0;
                        if (invoiceMonthDiff > 1) {
                            model.cost7 = _self.calCulatePresentage(costItem[invoiceMonthDiff] || 0, costItem[invoiceMonthDiff - 1] || 0);
                        }
                        else {
                            model.cost7 = 0;
                        }

                        _self.model.push(model);
                    }
                })
                let calulateColspan = 1;
                calulateColspan = invoiceMonthDiff == 1 ? (calulateColspan + 2) : (invoiceMonthDiff * 2 + 2) + calulateColspan;
                this.gridColspan = calulateColspan;
                this.gridWidth = (this.gridColspan * 150) + 'px';

            });
    }

    getPivotArray(dataArray: any, rowIndex: any, colIndex: any, dataIndex: any) {

        var result = {}, ret = [];
        var newCols = [];
        for (var i = 0; i < dataArray.length; i++) {

            if (!result[dataArray[i][rowIndex]]) {
                result[dataArray[i][rowIndex]] = {};
            }
            result[dataArray[i][rowIndex]][dataArray[i][colIndex]] = dataArray[i][dataIndex];

            //To get column names
            if (newCols.indexOf(dataArray[i][colIndex]) == -1) {
                newCols.push(dataArray[i][colIndex]);
            }
        }

        // newCols.sort();
        var item = [];

        //Add Header Row
        item.push('Item');
        item.push.apply(item, newCols);
        ret.push(item);

        //Add content 
        for (var key in result) {
            item = [];
            item.push(key);
            for (var i = 0; i < newCols.length; i++) {
                item.push(result[key][newCols[i]] || 0);
            }
            ret.push(item);
        }
        return ret;
    }

    calCulatePresentage(a: number, b: number): any {
        var first: number = a;
        var second: number = b;
        if (second == 0) {
            return first;
        }
        return this.round(((first - second) / second * 100), 2);

        //return Math.round(((first - second) / second * 100));
    }

    round(value: any, decimals: any) {
        //return Math.round(value * 100) / 100;
        return parseFloat(value).toFixed(2);
        //return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }
}