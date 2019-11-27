import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { InternationalReportByDestinationViewModel } from 'src/app/_models/report/international-report-By-Destination.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { UtilityMethod } from 'src/app/_common/utility-method';

@Component({
    selector: 'international-report-by-destination',
    templateUrl: './international-report-by-destination.component.html'
})
export class InternationalReportByDestinationComponent implements OnInit {


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
    banguid: string;


    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    todate?: Date;
    isbandisplay: boolean = false;

    calltypelist: any[] = [{ value: "0", label: "All" }, { value: "Voice", label: "Calls" }, { value: "SMS", label: "Text" }];
    calltype: string = "0";


    reportingList: ReportingGroupViewModel[];

    model: InternationalReportByDestinationViewModel[];
    noInvoiceAvailable: boolean;
    selectedDestinatins: InternationalReportByDestinationViewModel[];

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

    ngOnInit() {

        var process4 = this.loadInvoiceMonths(false);
        let process5 = this.loadReportingGroups();

        process4.then(() => {
            if (!this.noInvoiceAvailable) {
                this.loadData();
            }
        });
    }

    loadData() {

        let process7 = this.refreshData();
        let process1 = this.IsBenExistForCompanyAsnyc();
        let process2 = this.IsBillingPlatformExistForCompanyAsnyc();
        let process3 = this.IsBANDisplay();
        let process4 = this.loadNetwork();
        let process5 = this.loadBenDropDown();
        let process6 = this.loadBanDropDown();
        
        this.loader.emit(Promise.all([process1, process2, process3, process4, process5, process6, process7]));
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
        this.banguid = null;
    }

    OnNetworkChange() {

        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        this.calltype = "0";
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }

    onChangeBen() {
        this.calltype = "0";
        this.refreshData();
    }

    onChangeBan() {
        this.calltype = "0";
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.calltype = "0";
        this.loadBanDropDown();
        this.refreshData();
    }

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid).then(res => {
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
                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.csvfilename = "InternationalReportByDestination_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
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

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }


    loadRoamedReport() {

        this.loader.emit(this.invoiceReportService.GetInternationalReportByDestinationDetails(this.fromdate, this.todate, this.calltype, this.networkguid,
            UtilityMethod.IfNull(this.billingplatformguid, ''),
            UtilityMethod.IfNull(this.benguid, ''),
            UtilityMethod.IfNull(this.banguid, '')).then((data) => {

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
            this.calltype = "0";
            this.loadData();
            this.csvfilename = "InternationalReportByDestination_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    refreshData() {
        this.loadRoamedReport();
    }


    OnCallTypeChange() {

        this.refreshData();
    }

    onRowSelect($event: any) {

        let destination = $event.data.destination;

        this.router.navigate(['international-report-by-destination-detail'], {
            queryParams: {
                fromdate: this.fromdate
                , todate: this.todate
                , calltype: this.calltype
                , networkguid: this.networkguid
                , billingPlatformguid: this.billingplatformguid
                , banguid: this.banguid
                , ndes: !!this.networkguid ? this.networkArray.find(c => c.value == this.networkguid).label : (this.networkArray.length > 1 ? "All" : null)
                , benguid: this.benguid
                , destinations: destination
                , bpdes: (!!this.billingPlatformArray && this.billingPlatformArray.length !== 0) ? (!!this.billingplatformguid ? this.billingPlatformArray.find(c => c.value == this.billingplatformguid).label : "All") : null
                , bendes: (!!this.benArray && this.benArray.length !== 0) ? (!!this.benguid ? this.benArray.find(c => c.value == this.benguid).label : "All") : null
                , bandes: (!!this.banArray && this.banArray.length !== 0) ? (!!this.banguid ? this.banArray.find(c => c.value == this.banguid).label : "All") : null,
            }
        });

    };


}