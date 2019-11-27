import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { InternationalReportViewModel } from 'src/app/_models/report/international-report.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { NetworkService } from 'src/app/_services/network.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityMethod } from 'src/app/_common/utility-method';

@Component({
    selector: 'international-report-by-destination-detail',
    templateUrl: './international-report-by-destination-detail.component.html'
})
export class InternationalReportByDestinatinDetailComponent implements OnInit {


    private loader: EventEmitter<any>;

    networkfilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];

    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];

    csvfilename: string;
    error: string;
    isbenexist: boolean;

    isbillingplatformxist: boolean;
    isbandisplay: boolean = false;
    billingplatformguid: string;

    fromdate?: Date;
    todate?: Date;
    sub: any;

    fromDateDescription: string;
    toDateDescription: string;

    networkguid: string;
    benguid: string;
    banguid: string;

    destination: string;
    destinationsarray: any[];
    checkBoxDestinations: any[];
    calltype: string = "0";

    calltypelist: any[] = [{ value: "0", label: "All" }, { value: "Voice", label: "Calls" }, { value: "SMS", label: "Text" }];


    reportingList: ReportingGroupViewModel[];

    model: InternationalReportViewModel[];

    test: any;

    networkdescription: string;
    billingplatformdescription: string;
    bendescription: string;
    bandescription: string;

    qNetworkFilter: any;
    qBillingPlatformFilter: any;
    qBenFilter: any;
    qBanFilter: any;

    constructor(
        private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private invoiceService: InvoiceService,
        private networkService: NetworkService,
        private benDetailService: BENDetailService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {

            this.sub = this.route.queryParams.subscribe(params => {

                this.benguid = params['benguid'] || "";
                this.banguid = params['banguid'] || "";
                this.networkguid = params['networkguid'] || "";
                this.billingplatformguid = params['billingplatformguid'] || "";
                this.fromDateDescription = UtilityMethod.ToDateDescriptionMMMYYYY(params["fromdate"]);
                this.toDateDescription = UtilityMethod.ToDateDescriptionMMMYYYY(params["todate"]);
                this.fromdate = params["fromdate"];
                this.todate = params["todate"];
                this.calltype = params['calltype'] || "";
                this.destination = params['destinations'];
                this.networkdescription = params["ndes"];
                this.billingplatformdescription = params['bpdes'];
                this.bendescription = params['bendes'];
                this.bandescription = params['bandes'];

                let promise1 = this.IsBenExistForCompanyAsnyc();
                let promise2 = this.IsBANDisplay();
                let promise3 = this.loadReportingGroups();
                let process4 = this.loadDestinationsCheckBox();
                this.loader.emit(Promise.all([promise1, promise2, promise3, process4]).then(() => {
                    this.refreshData();
                }));
            });
        });
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

        this.loader.emit(

            this.invoiceReportService.GetInternationalReportByDestinationDrillDownDetails(this.fromdate, this.todate, this.calltype, this.networkguid,
                UtilityMethod.IfNull(this.billingplatformguid, ''),
                UtilityMethod.IfNull(this.benguid, ''),
                UtilityMethod.IfNull(this.banguid, ''),
                this.destination,
                this.checkBoxDestinations)

                .then((data) => {

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

                    this.csvfilename = "InternationalReportByDestinationDetail_" + this.fromDateDescription + "_" + this.toDateDescription;

                }));
    }

    refreshData() {
        this.loadRoamedReport();
    }


    OnCallTypeChange() {

        this.refreshData();
    }

    OnDestinationChange() {

        this.refreshData();
    }


    loadDestinationsCheckBox(): Promise<any> {


        return this.invoiceReportService.GetDestinationsForInternationalReportByDestinationDrillDownDetails(this.fromdate, this.todate, this.calltype, this.networkguid,
            UtilityMethod.IfNull(this.billingplatformguid, ''),
            UtilityMethod.IfNull(this.benguid, ''),
            UtilityMethod.IfNull(this.banguid, ''))
            .then((data) => {


                this.destinationsarray = [];
                this.checkBoxDestinations = [];


                data.map(q => {
                    return { 'value': q.destination, 'label': q.destination };
                }).forEach(q => {
                    if (this.destinationsarray.filter(n => n.value == q.value).length == 0) {

                        this.destinationsarray.push(q);
                    }
                });

                this.checkBoxDestinations.push(this.destination);




            });
    }

}