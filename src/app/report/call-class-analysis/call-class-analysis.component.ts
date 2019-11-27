import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Data, Router, UrlSegment } from '@angular/router';

// import { CommonModule } from '@angular/common';
// import { DataTableModule } from 'primengdevng8/datatable';
// import { DropdownModule } from 'primengdevng8/dropdown';
// import { ButtonModule } from 'primengdevng8/button';

import { InvoiceReportService } from '../../_services/invoice-report.service';
import { CallClassAnalysisByCallCategoryViewModel } from '../../_models/report/call-class-analysis.model';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { BENDetailService } from '../../_services/bendetail.service';
import { Location } from '@angular/common';
import { TitleService } from '../../_services/title.service';
import { ReportHeaderColumnType } from '../../_services/enumtype';
import { UtilityMethod } from '../../_common/utility-method';
import { InvoiceService } from '../../_services/invoice.service';
import { GenericService } from '../../_services/generic.service';
import { ReportingGroupsGuid } from '../../_models/reportinggroup1';
import { ReportingGroupViewModel } from '../../_models/report/ReportingGroupViewModel';
import { ReportingGroupService } from '../../_services/reporting-group.service';
import { UserDetail } from '../../_models/user-detail';
//import { LocalStorageProvider } from '../_common/localstorageprovider';
import { AuthenticationService } from '../../_services/authentication.service';



@Component({
    selector: 'call-class-analysis',
    templateUrl: './call-class-analysis.component.html'
})
export class CallClassAnalysisComponent implements OnInit {
    private loader: EventEmitter<any>;

    //parameters
    invguid: string;
    networkguid: string;
    billingplatformguid: string;
    benGuid: string;
    reportheader: string;
    banGuid: string;
    bandesc: string;
    columntype: any = ReportHeaderColumnType;

    columndisplaytype: number;

    //label prop
    ndesc: string;
    bendesc: string;
    billdesc: string;

    month: string;

    /* Ben List */
    benfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];

    isbenexist: boolean = false;
    isbandisplay: boolean = false;
    isbillingplatformexist: boolean = false;

    fromdate: Date;
    todate: Date;
    frommonth: string;
    tomonth: string;

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

    linktype: string;
    rtypeguid: string;
    linksourceguid: string;
    qBenFilter:string;
    qBanFilter:string;
    model: CallClassAnalysisByCallCategoryViewModel[];
    reportinggroupsdetail: ReportingGroupsGuid;
    reportingList: ReportingGroupViewModel[];
    isallpermissionaccess: boolean;

    constructor(private invoicereportservice: InvoiceReportService,
        private location: Location,
        private bendetailservice: BENDetailService,
        private authenticationService:AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private titleService: TitleService,
        private route: ActivatedRoute,
        private invoiceservice: InvoiceService,
        private genericservice: GenericService,
        private invoiceReportService: InvoiceReportService,
        private reportinggroupservice: ReportingGroupService,
        private router: Router) {
        this.loader = globalEvent.busySpinner;
    }


    ngOnInit() {

        let user: UserDetail = this.authenticationService.currentUserValue;//LocalStorageProvider .getUserStorage();
        this.isallpermissionaccess = user.isallpermissionaccess;

        this.route.queryParams.subscribe(params => {
            
            this.benGuid = params['benGuid'];
            this.bendesc = params['bendesc'];
            this.billingplatformguid = params['billingguid'];
            this.billdesc = params['billdesc'];
            this.networkguid = params["nid"];
            this.ndesc = params['ndesc'];
            this.banGuid = params['banGuid'];
            this.bandesc = params['bandesc'];
            this.reportheader = params['rheader'];

            this.fromdate = params['fromdate'];
            this.todate = params['todate'];
            this.frommonth = params['frommonth'];
            this.tomonth = params['tomonth'];

            this.reportinggroup1guid = params['r1guid'];
            this.reportinggroup1description = params['r1desc'];
            this.reportinggroup2guid = params['r2guid'];
            this.reportinggroup2description = params['r2desc'];
            this.reportinggroup3guid = params['r3guid'];
            this.reportinggroup3description = params['r3desc'];
            this.reportinggroup4guid = params['r4guid'];
            this.reportinggroup4description = params['r4desc'];
            this.reportinggroup5guid = params['r5guid'];
            this.reportinggroup5description = params['r5desc'];
            this.reportinggroup6guid = params['r6guid'];
            this.reportinggroup6description = params['r6desc'];

            this.linktype = params['linktype'];
            this.rtypeguid = params['rtypeguid'];
            this.linksourceguid = params['linksourceguid'];

            this.month = params['month'];
            //setting dynamic title
            let data = this.route.data;
            let title: string;
            if (data) {
                title = data['_value']['title'];
                this.titleService.setTitle(title + ' ' + this.reportheader);

            }
            
            this.IsBENExist();
            this.IsBillingPlatformExistForCompanyAsnyc();
            this.bindReportingGroupsGuidModel();
            this.getColumnTypeByReportHeader();
            this.loadReportingGroups();
            this.loadSelectedReportingGroups();

            this.loader.emit(this.IsBANDisplay().then(x => this.loadGrid()));
        });
    }



    getColumnTypeByReportHeader(): Promise<any> {
        return this.invoicereportservice.GetCOlumnTypeByReportHeader(this.reportheader).then(res => {
            this.columndisplaytype = res;
        });
    }

    loadGrid()//: Promise<any> 
    {
        
         let p = new Promise<boolean>((resolve) => {
        this.loader.emit(this.invoicereportservice.GetCallClassReportByCallCategory(null, this.networkguid, this.billingplatformguid, this.benGuid, this.reportheader, this.banGuid,
            this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid,
            this.reportinggroup6guid, this.fromdate, this.todate, this.linktype, this.linksourceguid, this.rtypeguid)
            .then(res => {
                this.model = res;
                this.refreshGridFilter(res);
                
                resolve(true);
            }));
          });
        return p;

    }
    IsBANDisplay(): Promise<any> {
        return this.invoiceservice.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {  this.isbandisplay = res });
    }

    IsBENExist() {
        this.bendetailservice.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(data => {
            this.isbenexist = data;
        });
    }

    loadReportingGroups(): Promise<any> {
        return this.invoiceReportService.getReportingGroupDetails().then((data) => {
            this.reportingList = data;
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
        this.benfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }

    refreshGridFilter(data: CallClassAnalysisByCallCategoryViewModel[]) {
        this.clearGridFilter();

        if (this.isbenexist) {
            //Getting  ben  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                return { 'value': q.bendescription, 'label': q.bendescription };
            }).forEach(q => {
                if (q.value) {
                    this.benfilterset.push(q);
                }
            });
        }

        //Getting  ban  list from grid data
        data.filter((obj, index, self) => self.findIndex((t) => { return t.bandescription === obj.bandescription }) === index).map(q => {
            return { 'value': q.bandescription, 'label': q.bandescription };
        }).forEach(q => {
            if (q.value) {
                this.banfilterset.push(q);
            }
        });

    }

    goback() {
        this.location.back();
    }

    handleRowSelect(event: any) {
        let ccviewmodel: CallClassAnalysisByCallCategoryViewModel = event.data;
        this.navigateToItemisation(ccviewmodel);

    }


    navigateToItemisation(data: CallClassAnalysisByCallCategoryViewModel) {

        this.router.navigate(['total-billing-itemised'], {
            queryParams: {

                mn: (data != null) ? data.mobilenumber : null,
                rheader: this.reportheader,
                month: this.month,
                benGuid: this.benGuid,
                bendesc: this.bendesc,
                billingguid: this.billingplatformguid,
                billdesc: this.billdesc,
                nid: this.networkguid,
                ndesc: this.ndesc,
                banGuid: this.banGuid,
                bandesc: UtilityMethod.IfNull(this.bandesc, ''),

                fromdate: this.fromdate,
                todate: this.todate,
                frommonth: this.frommonth,
                tomonth: this.tomonth,
                r1guid: this.reportinggroup1guid,
                r1desc: this.reportinggroup1description,
                r2guid: this.reportinggroup2guid,
                r2desc: this.reportinggroup2description,
                r3guid: this.reportinggroup3guid,
                r3desc: this.reportinggroup3description,
                r4guid: this.reportinggroup4guid,
                r4desc: this.reportinggroup4description,
                r5guid: this.reportinggroup5guid,
                r5desc: this.reportinggroup5description,
                r6guid: this.reportinggroup6guid,
                r6desc: this.reportinggroup6description
            }
        });
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

