import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ViewContainerRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primengdevng8/api';
import { NetworkService } from "../../_services/network.service";
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { CallClassReportViewModel, CallClassReportGraphModel } from '../../_models/report/call-class-report-details.model';
import { AuthenticationService } from '../../_services/authentication.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { ChartHelper, ChartType } from '../../_models/chart';
import { GenericService } from '../../_services/generic.service';
import { InvoiceService } from '../../_services/invoice.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { BENDetailService } from '../../_services/bendetail.service';
import { CustomReuseStrategy } from '../../_common/custom-route-reuse-strategy';
import { UtilityMethod } from '../../_common/utility-method';
import { FeatureService } from '../../_services/feature.service';
import { Column } from '../../_models/primeng-datatable';
import { ReportingGroupDetailsProvider } from '../../_common/reporting-group-details-provider';
import { LinkType } from '../../_services/enumtype';
import { LocalStorageProvider } from '../../_common/localstorageprovider';
import { UserDetail } from '../../_models/user-detail';
import { ReportingGroupViewModel } from '../../_models/report/ReportingGroupViewModel';

declare let Chart: any;

@Component({
    selector: 'call-class-report',
    templateUrl: './call-class-report.component.html'
})
export class CallClassReportComponent {
    //  @ViewChild("usagechart") usagechart: any;


    @Input() linktype: string;
    @Input() linksourceguid: string
    @Input() rtypeguid: string;

    private loader: EventEmitter<any>;
    @Input() isInvoiceActive: boolean = false;

    /* Invoice Months */
    @Input() invoicedateguid: string;

    @Input() fromdate: Date;

    @Input() todate: Date;
    @Input() frommonth: Date;
    @Input() tomonth: Date;
    @Input() csvfilename: string;

    @Input() networkguid: string;
    @Input() billingplatformguid: string;
    @Input() benguid: string;;
    @Input() ban: string;

    callclassreportviewmodel: CallClassReportViewModel[];

    benfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];
    @Input() isbenexist: boolean;
    @Input() ismpayexist: boolean;
    @Input() isbandisplay: boolean;
    @Input() istotalbillingcallcostvisible: boolean;

    datacolumns: Column[] = [];

    @Input() reportinggroup1guid: string;
    @Input() reportinggroup2guid: string;
    @Input() reportinggroup3guid: string;
    @Input() reportinggroup4guid: string;
    @Input() reportinggroup5guid: string;
    @Input() reportinggroup6guid: string;


    @Input() ndesc: string;
    @Input() billdesc: string;
    @Input() bendesc: string;
    @Input() _bandesc: string;
    @Input() r1desc: string;
    @Input() r2desc: string;
    @Input() r3desc: string;
    @Input() r4desc: string;
    @Input() r5desc: string;
    @Input() r6desc: string;
    subscription: any;
    colspan: number = 59;
    colWidth: number = 8850;

    isallpermissionaccess: boolean;
    @Input() rgModelArray: ReportingGroupViewModel[];
    qBenFilter: any;
    qBanFilter: any;
   
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : UploadInvoiceService to inject
     */
    constructor(private networkService: NetworkService,
        private authenticationService: AuthenticationService,
        private invoiceReportService: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private invoiceService: InvoiceService,
        private genericService: GenericService,
        private globalEvent: GlobalEventsManager,
        private bendetailservice: BENDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private featureservice: FeatureService,
        private invoicereportservice: InvoiceReportService,
        private authService: AuthenticationService

    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        let user: UserDetail = this.authService.currentUserValue;
        this.isallpermissionaccess = user.isallpermissionaccess;

        this.subscription = this.globalEvent.refreshCallClassFleet.subscribe((data: any) => {
            var p1 = this.setReportingGorup();
            var p3 = this.loadCallClassReport();
            this.loader.emit(Promise.all([p1, p3]).then((data) => {
                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            }));
        });

        //if (this.subscription) {
        //    this.subscription.unsubscribe();
        //    this.subscription = null;
        //}  
    }
    setReportingGorup() {
        if (this.rgModelArray) {
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(this.rgModelArray);
            if (this.datacolumns.length > 0) {
                this.colspan = this.colspan + this.datacolumns.length;
            }
            this.colWidth = (150 * this.colspan);
        }
        else {
            this.invoicereportservice.getReportingGroupDetails(true).then(res => {
                this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
                if (this.datacolumns.length > 0) {
                    this.colspan = this.colspan + this.datacolumns.length;
                }
                this.colWidth = (150 * this.colspan);
            });

        }

    }

    clearGridFilter() {
        this.benfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }

    //Binding Grid Data
    loadCallClassReport(): Promise<any> {

        return this.invoiceReportService.GetCallClassDetails('', '', this.networkguid, this.billingplatformguid, this.benguid, this.ban,
            this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid,
            this.fromdate, this.todate, this.linktype, this.linksourceguid, this.rtypeguid).then((res: any) => {
                this.callclassreportviewmodel = res;
                this.loader.emit(this.refreshGridFilter(res));
            });
    }

    refreshGridFilter(data: CallClassReportViewModel[]) {
        this.clearGridFilter();

        if (this.isbenexist) {
            //Getting  ben  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.ben === obj.ben }) === index).map(q => {
                return { 'value': q.bendescription, 'label': q.bendescription, sortValue: q.ben };
            }).sort((a, b) => {
                return a.sortValue - b.sortValue;
            }).forEach(q => {
                if (q.value) {
                    this.benfilterset.push(q);
                }
            });
        }

        // Getting  ban  list from grid data
        data.filter((obj, index, self) => self.findIndex((t) => { return t.ban === obj.ban }) === index).map(q => {
            return { 'value': q.ban, 'label': q.ban };
        }).forEach(q => {
            if (q.value) {
                this.banfilterset.push(q);
            }
        });

    }


    //on row click we are redirecting user to itemised page
    onRowSelect(event: any) {
        let ccviewmodel: CallClassReportViewModel = event.data;
        this.navigateToItemised(ccviewmodel);
    }

    setQueryParams(ccviewmodel?: CallClassReportViewModel, rheader?: string): any {

        let benGuid: string;
        let mn: string;
        let billGuid: string;
        let ndesc: string;
        let bendesc: any;
        let billdesc: string;
        let _ban: string;
        let _bandesc: string;
        let cc: string;
        let dp: string
        let frommonth: string;
        let tomonth: string;
        if (ccviewmodel) {
            mn = ccviewmodel.mobilenumber;
            //benGuid = ccviewmodel.benguid;
            //bendesc = ccviewmodel.bendescription;
            //billGuid = ccviewmodel.billingplatformguid;
            //billdesc = ccviewmodel.billingplatformdescription;
            //ndesc = ccviewmodel.networkdescription;
            //_ban = ccviewmodel.ban;
            benGuid = this.benguid;
            bendesc = this.bendesc
            billGuid = this.billingplatformguid;
            billdesc = this.billdesc;
            ndesc = this.ndesc;
            _ban = this.ban;
        }

        let params = {
            mn: mn,
            benGuid: benGuid,
            billingguid: billGuid,
            nid: this.networkguid,
            ban: UtilityMethod.IfNull(_ban, ''),
            ndesc: ndesc,
            rheader: rheader,
            bendesc: bendesc,
            billdesc: billdesc,
            fromdate: this.fromdate,
            todate: this.todate,
            frommonth: this.frommonth,
            tomonth: this.tomonth,
            cc: cc,
            dp: dp,
            r1guid: this.reportinggroup1guid,
            r2guid: this.reportinggroup2guid,
            r3guid: this.reportinggroup3guid,
            r4guid: this.reportinggroup4guid,
            r5guid: this.reportinggroup5guid,
            r6guid: this.reportinggroup6guid,
            r1desc: this.r1desc,
            r2desc: this.r2desc,
            r3desc: this.r3desc,
            r4desc: this.r4desc,
            r5desc: this.r5desc,
            r6desc: this.r6desc,
            invoicetariff: "",
            datasoc: ""
        }

        // On Row Selection Assign values from grid selected row
        if (ccviewmodel) {
            params.r1guid = ccviewmodel.reportinggroup1guid,
                params.r2guid = ccviewmodel.reportinggroup2guid,
                params.r3guid = ccviewmodel.reportinggroup3guid,
                params.r4guid = ccviewmodel.reportinggroup4guid,
                params.r5guid = ccviewmodel.reportinggroup5guid,
                params.r6guid = ccviewmodel.reportinggroup6guid,
                params.benGuid = ccviewmodel.benguid,
                params.bendesc = ccviewmodel.bendescription,
                params.invoicetariff = ccviewmodel.invoicetariff,
                params.datasoc = ccviewmodel.datasoc,
                params.billingguid = ccviewmodel.billingplatformguid

        }


        return params;
    }

    navigateToItemised(ccviewmodel?: CallClassReportViewModel) {


        this.router.navigate(['total-billing-itemised'], {
            queryParams: this.setQueryParams(ccviewmodel)
        });
    }

    //ngOnDestroy() {
    //    this.subscription.unsubscribe();
    //}


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

}