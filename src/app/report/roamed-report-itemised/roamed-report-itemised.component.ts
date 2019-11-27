import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Data, Router, UrlSegment } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { RoamedItemisedByCountry } from 'src/app/_models/report/roamed-itemised-by-country.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
@Component({
    selector: 'roamed-report-itemised',
    templateUrl: './roamed-report-itemised.component.html'
})
export class RoamedReportItemisedComponent implements OnInit {

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
    //networkArray: SelectItem[];
    networkguid: string;
    networkdescription: string;

    /* Billing Platforms */
    //billingPlatformArray: SelectItem[];
    billingplatformguid: string;
    billingplatformdescription: string;

    /* Ben List */
    //benArray: SelectItem[];
    benguid: string;
    bendescription: string;

    /* Ban List */
    //banArray: SelectItem[];
    ban: string;
    bandescription: string;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    fromdatedescription: string;
    todate?: Date;
    todatedescription: string;
    isbandisplay: boolean = false;

    calltypelist: any[] = [{ value: "0", label: "All" }, { value: "Voice", label: "Calls" }, { value: "SMS", label: "Text" }, { value: "DATA", label: "Data" }];
    calltype: string = "0";
    calltypedescription: string;

    subcalltype: string = 'Roamed';

    zonelist: any[] = [{ value: "0", label: "All" }, { value: "1", label: "Zone 1" }, { value: "2", label: "Zone 2" }, { value: "3", label: "World" }, { value: "4", label: "ROW" }];
    zone: string = "0";
    zonedescription: string;

    /* Params */
    countryoforigin: string;
    qparams: any;
    qNetworkFilter:any;
    qBillingPlatformFilter:any;
    qBenFilter:any;
    qBanFilter:any;
    reportingList: ReportingGroupViewModel[];

    model: RoamedItemisedByCountry[];

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private invoiceService: InvoiceService,
        private networkService: NetworkService,
        private benDetailService: BENDetailService,
        private router: Router,
        private route: ActivatedRoute) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {

            if (Object.keys(params).length > 0) {
                this.countryoforigin = params["ctry"];

                this.qparams = this.route.queryParams.subscribe(qparams => {


                    this.fromdate = qparams["fd"];
                    this.todate = qparams["td"];
                    this.fromdatedescription = UtilityMethod.ToDateDescriptionMMMYYYY(qparams["fd"]);
                    this.todatedescription = UtilityMethod.ToDateDescriptionMMMYYYY(qparams["td"]);
                    this.networkguid = qparams["nid"];
                    this.networkdescription = qparams["ndes"];
                    this.billingplatformguid = qparams['bp'];
                    this.billingplatformdescription = qparams['bpdes'];
                    this.benguid = qparams['benGuid'];
                    this.bendescription = qparams['bendes'];
                    this.ban = qparams['ban'];
                    this.bandescription = qparams['bandes'];
                    this.calltype = qparams['ct'];
                    this.calltypedescription = qparams['ctdes'];
                    this.subcalltype = qparams['sc'];
                    this.zone = qparams['zn'];
                    this.zonedescription = qparams['zndes'];
                });

                let promise1 = this.IsBenExistForCompanyAsnyc();
                let promise2 = this.IsBANDisplay();
                let promise3 = this.loadReportingGroups();
                this.loader.emit(Promise.all([promise1, promise2, promise3]).then(() => {
                    this.refreshData();
                }));

            }
        });


        //process4.then(() => {
        //let process6 = this.loadNetwork();
        //this.loader.emit(Promise.all([process4, process6]).then(() => {
        //    var process1 = this.IsBenExistForCompanyAsnyc();
        //    var process2 = this.IsBillingPlatformExistForCompanyAsnyc();
        //    var process3 = this.IsBANDisplay();
        //    let process8 = this.loadBenDropDown();
        //    let process9 = this.loadBanDropDown();
        //    Promise.all([process1, process2, process3, process8, process9]).then(() =>
        //  this.refreshData()
        //        );
        //    }));
        //});
        //this.refreshData();
    }

    //loadNetwork(): Promise<any> {
    //    this.clearNetworks();

    //    return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
    //        if (data != null) {
    //            this.networkArray.push({ label: 'ALL', value: null });
    //            data.forEach(item => this.networkArray.push({
    //                label: item.networkdescription, value: item.networkguid
    //            }));
    //        }
    //    });
    //}

    //clearNetworks() {
    //    this.networkArray = [];
    //    this.networkguid = null;
    //}

    //loadBillingPlatformDropDown() {
    //    this.clearBillingPlatform();
    //    if (this.networkguid != undefined) {
    //        this.networkService.getBillingPlatforms(this.networkguid, false, this.fromdate, this.todate).then((data) => {
    //            if (data != null) {
    //                this.billingPlatformArray.push({ label: 'ALL', value: null });
    //                data.forEach(item => this.billingPlatformArray.push({
    //                    label: item.billingplatformdescription, value: item.billingplatformguid
    //                }));
    //            }
    //        });
    //    }
    //}

    //clearBillingPlatform() {
    //    this.billingPlatformArray = [];
    //    this.billingplatformguid = null;
    //}

    //loadBenDropDown(): Promise<any> {
    //    this.clearBens();
    //    //this.benDetailService.getBenDetailList().then((data) => {
    //    return this.benDetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
    //        if (data && data != null) {
    //            this.benArray.push({ label: 'ALL', value: null });
    //            data.forEach(item => this.benArray.push({
    //                label: item.bendescription, value: item.benguid
    //            }));
    //        }
    //    });


    //}

    ///*Load the ban for the given company and selected netwok */
    //loadBanDropDown(): Promise<any> {
    //    this.clearBans();
    //    return this.invoiceService.getBanList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
    //        if (data && data != null) {
    //            this.banArray.push({ label: 'ALL', value: null });
    //            data.forEach(item => this.banArray.push({
    //                label: item.description, value: item.banguid
    //            }));
    //        }
    //    });
    //}

    //clearBens() {
    //    this.benArray = [];
    //    this.benguid = null;
    //}

    //clearBans() {
    //    this.banArray = [];
    //    this.ban = null;
    //}

    //OnNetworkChange() {
    //    let process1 = this.loadBillingPlatformDropDown();
    //    let process2 = this.loadBanDropDown();
    //    let process3 = this.loadBenDropDown();
    //    this.loader.emit(Promise.all([process1, process2, process3]));
    //    this.refreshData();
    //}

    //onChangeBen() {
    //    this.refreshData();
    //}

    //onChangeBan() {
    //    this.refreshData();
    //}

    //onChangeBillingPlatForm() {
    //    this.loadBanDropDown();
    //    this.loadBenDropDown();
    //    this.refreshData();
    //}

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {
        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    //IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
    //    return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid, this.fromdate, this.todate).then(res => {
    //        this.isbillingplatformxist = res;
    //    });
    //}

    //Check for BAN exist for company to Dispaly column in grid
    IsBANDisplay(): Promise<any> {
        return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbandisplay = res);
    }

    /**
    * Load the avaialble months for given company
    */
    //loadInvoiceMonths(refreshData: boolean = true): Promise<any> {
    //    this.clearInvoiceMonths();
    //    return this.invoiceDateService.getInvoiceMonth().then((data) => {
    //        if (data.length) {
    //            data.forEach(item => this.invoicemonthArray.push({
    //                label: item.invoicedatedescription,
    //                value: item.startdate,
    //            }));
    //            this.fromdate = data[0].startdate;
    //            this.todate = data[0].startdate;
    //            this.csvfilename = "RoamedReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
    //            if (!!refreshData) {
    //                
    //                this.refreshData();
    //            }
    //        }
    //    });
    //}

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
        this.loader.emit(this.invoiceReportService.GetRoamedItemsiedByCountry(this.countryoforigin, this.fromdate, this.todate, this.subcalltype, this.calltype, this.zone, this.networkguid,
            UtilityMethod.IfNull(this.billingplatformguid, ''),
            UtilityMethod.IfNull(this.benguid, ''),
            UtilityMethod.IfNull(this.ban, '')).then((data) => {

                this.clearGridFilter();

                this.model = data;

                //getting  network  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {

                    return { 'value': q.networkdescription, 'label': q.networkdescription };
                }).forEach(q => {

                    if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                        this.networkfilterset.push(q);
                    }
                });

                if (this.isbenexist) {
                    //getting  ben  list from grid data
                    data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                        return { 'value': q.bendescription, 'label': q.bendescription };
                    }).
                        //sort((a, b) => {
                        //    return a.value - b.value;
                        //}).
                        forEach(q => {
                            if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                                this.benfilterset.push(q);
                            }
                        });
                }

                if (this.isbenexist) {
                    //getting  ben  list from grid data
                    data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                        return { 'value': q.bendescription, 'label': q.bendescription };
                    }).forEach(q => {
                        if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                            this.benfilterset.push(q);
                        }
                    });
                }

                if (this.isbillingplatformxist) {
                    //getting  billing platform  list from grid data
                    data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                        return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
                    }).forEach(q => {
                        if (this.billingplatformfilterset.filter(n => n.value == q.value).length == 0) {
                            this.billingplatformfilterset.push(q);
                        }
                    });
                }

                //getting  ban  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.ban === obj.ban }) === index).map(q => {
                    return { 'value': q.ban, 'label': q.ban };
                }).forEach(q => {
                    if (this.banfilterset.filter(n => n.value == q.value).length == 0) {
                        this.banfilterset.push(q);
                    }
                });

                this.csvfilename = "RoamedItemisedByCountry_" + this.fromdatedescription + "_" + this.todatedescription;

            }));
    }

    /**
    * Clears the invoice months and selection
    */
    //clearInvoiceMonths() {
    //    this.invoicemonthArray = [];
    //    this.fromdate = null;
    //    this.todate = null;
    //    this.model = [];
    //}

    //On Invoice Change 
    //onInvoiceMonthChange() {
    //    this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
    //    if (this.error) {
    //        this.model = [];
    //    }
    //    else {
    //        this.refreshData();
    //        this.csvfilename = "RoamedReportByCountry_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
    //    }
    //}

    //onRowSelect(event: any) {
    //    let rowmodel: any = event.data;
    //    this.navigateToItemised(rowmodel.countryoforigin);
    //}

    refreshData() {
        this.loadRoamedReport();
    }
}