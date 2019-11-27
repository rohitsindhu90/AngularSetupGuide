import { Component, Input, OnInit, EventEmitter } from '@angular/core';
//import { CommonModule } from '@angular/common';

import { SelectItem, SortMeta } from 'primengdevng8/api';
//import { DataTable } from 'primengdevng8/datatable';
import { Column } from '../../_models/primeng-datatable';

import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ReportingGroupService } from '../../_services/reporting-group.service';
import { CallClassReportViewModel, CallClassReportGraphModel } from '../../_models/report/call-class-report-details.model';
import { CallClassItemisedViewModel } from '../../_models/report/call-class-itemised.model';
import { AuthenticationService } from '../../_services/authentication.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { InvoiceService } from '../../_services/invoice.service'
import { GlobalEventsManager } from '../../_common/global-event.manager'

import { ActivatedRoute, Data, Router, UrlSegment } from '@angular/router';
import { Location } from '@angular/common';
import { UtilityMethod } from '../../_common/utility-method';
import { BENDetailService } from '../../_services/bendetail.service';
import { GenericService } from '../../_services/generic.service';

import { ReportingGroupsGuid } from '../../_models/reportinggroup1';
import { ReportingGroupDetailsProvider } from '../../_common/reporting-group-details-provider';

@Component({
    selector: 'call-class-itemised-bill',
    templateUrl: './call-class-itemised-bill.component.html'
})
export class CallClassItemisedBillComponent implements OnInit {
    private loader: EventEmitter<any>;
    //flag to isplay and hide control based on mpay
    @Input() ismpayexist: boolean = false;
    qparams: any;

    /* Invoice Months */
    invoicemonthArray: SelectItem[] = [];
    invoicemonthArray1: any = [];
    @Input() invoicedateguid: string;

    @Input() mobilenumber: string;
    @Input() benGuid: string;

    networkguid: string;
    billingplatformguid: string;

    reportheader: string;
    datacolumns: Column[] = [];
    prevroute: string;
    callclassreportviewmodel: CallClassReportViewModel;
    callclassitemisedviewmodel: CallClassItemisedViewModel;
    zonefilterset: any[];
    zonefilter: boolean;
    //label prop
    ndesc: string;
    bendesc: string;
    billdesc: string;

    month: string;

    isbandisplay: boolean;
    isbenexist: boolean;
    isbillingplatformexist: boolean;

    fromdate: Date;
    todate: Date;
    frommonth: string;
    tomonth: string;

    banGuid: string;
    bandesc: string;

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

    rg1description: string;
    rg2description: string;
    rg3description: string;
    rg4description: string;
    rg5description: string;
    rg6description: string;

    datasoc: string;
    invoicetariff: string;
    error: string;

    colspan: number = 59;
    colWidth: number = 8850;
    reportinggroupsdetail: ReportingGroupsGuid;

    constructor(
        private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private invoiceservice: InvoiceService,
        private globalEvent: GlobalEventsManager,
        private location: Location,
        private router: Router,
        private genericservice: GenericService,
        private bendetailservice: BENDetailService,
        private route: ActivatedRoute,
        private reportinggroupservice: ReportingGroupService
    ) {
        this.loader = globalEvent.busySpinner;

    }

    ngOnInit() {
        this.qparams = this.route.queryParams.subscribe(qparams => {

            this.reportheader = qparams['rheader'];
            this.mobilenumber = qparams["mn"];
            this.benGuid = qparams["benGuid"];
            this.bendesc = qparams['bendesc'];
            this.billingplatformguid = qparams['billingguid'];
            this.billdesc = qparams['billdesc'];
            this.networkguid = qparams["nid"];
            this.ndesc = qparams['ndesc'];
            this.banGuid = qparams['banGuid'];
            this.bandesc = qparams['bandesc'];


            this.fromdate = qparams['fromdate'];
            this.todate = qparams['todate'];
            this.frommonth = qparams['frommonth'];
            this.tomonth = qparams['tomonth'];
            this.reportinggroup1guid = qparams['r1guid'];
            this.reportinggroup1description = qparams['r1desc'];
            this.reportinggroup2guid = qparams['r2guid'];
            this.reportinggroup2description = qparams['r2desc'];
            this.reportinggroup3guid = qparams['r3guid'];
            this.reportinggroup3description = qparams['r3desc'];
            this.reportinggroup4guid = qparams['r4guid'];
            this.reportinggroup4description = qparams['r4desc'];
            this.reportinggroup5guid = qparams['r5guid'];
            this.reportinggroup5description = qparams['r5desc'];
            this.reportinggroup6guid = qparams['r6guid'];
            this.reportinggroup6description = qparams['r6desc'];
            this.month = qparams['month'];

            this.invoicetariff = qparams['invoicetariff'];
            this.datasoc = qparams['datasoc'];

            this.mobilenumber = this.mobilenumber === undefined ? "" : this.mobilenumber;

            if (this.mobilenumber == "") {
                this.invoicereportservice.getReportingGroupDetails(true).then(res => {
                    this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);

                    this.datacolumns.forEach((data) => { data.hidden = false });

                    if (this.datacolumns.length > 0) {
                        this.colspan = this.colspan + this.datacolumns.length;
                    }
                    this.colWidth = (150 * this.colspan);
                });
            }



            this.loadSelectedReportingGroups();
            this.loadInvoiceMonths(false).then(() => {
                this.IsBENExist();
                this.IsBillingPlatformExistForCompanyAsnyc();
                this.bindReportingGroupsGuidModel();
                this.refreshdata();
            });
        });



    }

    goback() {

        this.location.back();
    }

    /**
    * Load the avaialble upload months for given company, selected network and billingplatfrom
    */
    loadInvoiceMonths(cleardata: boolean = true): Promise<any> {
        if (cleardata) {
            this.clearInvoiceMonths();
        }
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            this.clearInvoiceMonths();
            //this.invoicedateguid = data.filter(a => a.startdate == this.fromdate)[0].invoicedateguid;
            data.forEach(item => this.invoicemonthArray.push({
                label: item.invoicedatedescription,
                value: item.startdate
            }));
        });
    }

    /**
     * Clears the invoice months and selection
     */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        //this.invoicedateguid = "";
    }


    //On Invoice Change 
    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (!this.error) {
            this.frommonth = this.invoicemonthArray.find(x => x.value == this.fromdate).label
            this.tomonth = this.invoicemonthArray.find(x => x.value == this.todate).label
            this.refreshdata();
        }
    }

    //loading CallClass Number Details and there itemized data 
    refreshdata() {

        // var p1 = this.loadCallClassDetails();

        var p3 = this.IsMPAYExist();
        var p4 = this.IsBANDisplay();
        this.loader.emit(p4.then(x => {
            this.loadClassClassItemised();
            this.loadCallClassDetails();
        }));
        //this.loader.emit(Promise.all([p2, p3, p4]));
    }

    //loading call class selected number details
    loadCallClassDetails(): Promise<any> {


        if (this.mobilenumber && !this.reportheader) {
            return this.invoicereportservice.GetCallClassDetails(this.invoicedateguid, this.mobilenumber, this.networkguid, this.billingplatformguid, this.benGuid, this.banGuid,
                this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid, this.fromdate, this.todate, null, null, null, this.invoicetariff).then(res => {
                    this.callclassreportviewmodel = res[0];
                });
        }

    }

    //loading select number itemized data to grid
    loadClassClassItemised()//: Promise<any>
    {

        this.loader.emit(this.invoicereportservice.GetCallClassItemised(this.invoicedateguid, this.mobilenumber, UtilityMethod.IfNull(this.reportheader, ''), this.networkguid, this.billingplatformguid, this.benGuid, this.banGuid, this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid, this.fromdate, this.todate).then(res => {
            this.callclassitemisedviewmodel = res;

            if (res.callclassitemised && res.callclassitemised.length > 0 && res.eurozonedetails && res.eurozonedetails.length > 0) {
                this.clearGridFilter();
                //Getting  ben  list from grid data
                res.callclassitemised.filter((obj, index, self) => self.findIndex((t) => { return t.eurozone === obj.eurozone }) === index).map(q => {
                    return { 'value': q.eurozone, 'label': q.eurozone };
                }).forEach(q => {
                    this.zonefilterset.push(q);
                });
            }

        }));
        // }
    }


    //Check for IsMPAYExist to Dispaly column in grid
    IsMPAYExist(): Promise<any> {
        if (this.invoicedateguid === "" || this.invoicedateguid === null || this.invoicedateguid == undefined) {
            return this.invoiceservice.IsMPAYBetweenInvoiceDateExist(this.fromdate, this.todate).then(res => {
                this.ismpayexist = res;
            })
        }
        else {
            return this.invoiceservice.IsMPAYExist(this.invoicedateguid).then(res => {
                this.ismpayexist = res;
            })
        }

    }

    IsBANDisplay(): Promise<any> {
        return this.invoiceservice.IsBanDisplay(this.invoicedateguid, this.networkguid, this.billingplatformguid).then(res => this.isbandisplay = res);
    }

    IsBENExist(): Promise<any> {
        return this.bendetailservice.IsBenExistForCompanyAsnyc().then(data => {
            this.isbenexist = data;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {

        if (this.networkguid) {
            return this.genericservice.IsBillingExistForCompanyAsnyc(this.networkguid).then(res => {
                this.isbillingplatformexist = res;
            });
        }
    }

    clearGridFilter() {
        this.zonefilterset = [{ value: null, label: "" }];
    }

    bindReportingGroupsGuidModel() {
        let reportinggroupsdetail = new ReportingGroupsGuid();

        reportinggroupsdetail.reportinggroup1description = this.reportinggroup1description;
        reportinggroupsdetail.reportinggroup2description = this.reportinggroup2description;
        reportinggroupsdetail.reportinggroup3description = this.reportinggroup3description;
        reportinggroupsdetail.reportinggroup4description = this.reportinggroup4description;
        reportinggroupsdetail.reportinggroup5description = this.reportinggroup5description;
        reportinggroupsdetail.reportinggroup6description = this.reportinggroup6description;

        this.reportinggroupsdetail = reportinggroupsdetail;

    }

    loadSelectedReportingGroups() {

        if (this.reportinggroup1guid) {
            this.reportinggroupservice.getReportingGroup1DetailByGuid(this.reportinggroup1guid).then((data) => {
                this.rg1description = data;
            });
        }
        if (this.reportinggroup2guid) {
            this.reportinggroupservice.getReportingGroup2DetailByGuid(this.reportinggroup2guid).then((data) => {
                this.rg2description = data;
            });
        }
        if (this.reportinggroup3guid) {
            this.reportinggroupservice.getReportingGroup3DetailByGuid(this.reportinggroup3guid).then((data) => {
                this.rg3description = data;
            });
        }
        if (this.reportinggroup4guid) {
            this.reportinggroupservice.getReportingGroup4DetailByGuid(this.reportinggroup4guid).then((data) => {
                this.rg4description = data;
            });
        }
        if (this.reportinggroup5guid) {
            this.reportinggroupservice.getReportingGroup5DetailByGuid(this.reportinggroup5guid).then((data) => {
                this.rg5description = data;
            });
        }
        if (this.reportinggroup6guid) {
            this.reportinggroupservice.getReportingGroup6DetailByGuid(this.reportinggroup6guid).then((data) => {
                this.rg6description = data;
            });
        }
    }
}