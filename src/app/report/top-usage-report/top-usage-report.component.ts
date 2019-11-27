import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { TopUsageModel } from 'src/app/_models/report/topusage.model';
import { CallTypeEnum } from 'src/app/_services/enumtype';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { NetworkService } from 'src/app/_services/network.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { Invoice } from 'src/app/_models/invoice';

@Component({
    selector: 'top-usage-report',
    templateUrl: './top-usage-report.component.html'
})
export class TopUsageReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    csvfilename: string;
    error: string;
    isbenexist: boolean;
    isbillingplatformxist: boolean;
    model: TopUsageModel[];
    callTypeEnum = CallTypeEnum;

    /*=Grid Filter's Array=*/
    benfilterset: [{ value: string, label: string }];
    banfilterset: [{ value: string, label: string }];
    reportingList: ReportingGroupViewModel[];


    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthArrayCopy: any;
    fromdate?: Date;
    todate?: Date;
    isbanexist: boolean = false;

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

    /*Filter Type*/
    filtertypelist: SelectItem[] = [{ value: "0", label: "Spend" }, { value: "3", label: "Minutes" }, { value: "1", label: "Texts" }, { value: "2", label: "Data" }];
    filtertype: number = 0;
    noInvoiceAvailable?: boolean;
    topRecord: number = 10;
    

    qBenFilter:any;
    qBanFilter:any;

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,
        private router: Router) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        var process1 = this.loadInvoiceMonths(false);
        let process2 = this.loadReportingGroups();
        process1.then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadData();
            }
        });


    }

    loadReportingGroups(): Promise<any> {

        return this.invoiceReportService.getReportingGroupDetails().then((data) => {
            this.reportingList = data;
        });
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

                data.forEach(item => this.invoicemonthArrayCopy.push({
                    value: item.startdate,
                    label: item.invoicedateguid,//item.invoicedatedescription,
                    guid: item.invoicedateguid
                }));

                this.noInvoiceAvailable = false;
                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.csvfilename = "RoamedReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                if (!!refreshData) {

                    this.refreshData();
                }
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    /**
    * Clears the invoice months and selection
    */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        //this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        this.model = [];
        this.invoicemonthArrayCopy = [];
    }

    /**
* Load the Top usage report daa for given company
*/
    loadTopUsageReport() {
        //  this.billingplatformguid = null;
        this.loader.emit(this.invoiceReportService.GetTopUsageReport(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.ban, this.filtertype, this.topRecord).then((data) => {
            this.clearGridFilter();
            this.model = data;



            if (this.isbenexist) {

                // Getting  ben  list from grid data             
                data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                    return { 'value': q.bendescription, 'label': q.bendescription };
                }).forEach(q => {
                    if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                        this.benfilterset.push(q);
                    }
                });
            }

            if (this.isbanexist) {

                // Getting  ben  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.bandescription === obj.bandescription }) === index).map(q => {
                    return { 'value': q.bandescription, 'label': q.bandescription };
                }).forEach(q => {
                    if (this.banfilterset.filter(n => n.value == q.value).length == 0) {
                        this.banfilterset.push(q);
                    }
                });
            }

        }));
    }

    clearGridFilter() {

        this.benfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }

    refreshData() {
        this.loadTopUsageReport();
    }

    loadData() {
        let process = this.refreshData();
        let process1 = this.IsBenExistForCompanyAsnyc();
        let process2 = this.IsBillingPlatformExistForCompanyAsnyc();
        let process3 = this.IsBANDisplay();
        let process4 = this.loadBenDropDown();
        let process5 = this.loadBanDropDown();
        let process6 = this.loadNetwork();
        Promise.all([process, process1, process2, process3, process4, process5, process6]);
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

    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
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
        return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbanexist = res);
    }

    loadBenDropDown(): Promise<any> {
        this.clearBens();
        //this.benDetailService.getBenDetailList().then((data) => {
        return this.bendetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
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


    //On Invoice Change 
    onInvoiceMonthChange(changeDD?: boolean) {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {

            this.loadData();
            this.csvfilename = "TopUsageReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    onFilterTypeChange() {
        this.refreshData();
    }
    onNetworkChange() {

        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }

    onChangeBen() {

        this.refreshData();
    }

    onChangeBan() {
        this.refreshData();
    }

    onChangeTopUsage() {
        this.refreshData();
    }


    handleRowSelect(event: any) {


        let invoiceviewmodel: Invoice = event.data;
        let invoicedateguid = this.invoicemonthArrayCopy && this.invoicemonthArrayCopy.length > 0 ? this.invoicemonthArrayCopy.filter((x: any) => x.value == (this.todate || null))[0].guid : null;
        this.router.navigate(['invoice-itemised-bill', invoicedateguid, invoiceviewmodel.mobilenumber], { queryParams: { ben: invoiceviewmodel.benguid, ban: invoiceviewmodel.banguid } });


    }

}

