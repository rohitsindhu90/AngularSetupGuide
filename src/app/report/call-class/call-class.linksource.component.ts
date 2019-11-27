import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, OnChanges, ComponentRef, Injectable, Injector, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CallClassReportComponent } from './call-class-report.component';
import { CallClassReportViewModel } from 'src/app/_models/report/call-class-report-details.model';
import { Column } from 'primengdevng8/components/common/shared';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { NetworkService } from 'src/app/_services/network.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { GenericService } from 'src/app/_services/generic.service';
import { GlobalEventsManager } from 'src/app/_common/global-event.manager';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { UtilityMethod } from 'src/app/_common/utility-method';

declare let Chart: any;

@Component({
    selector: 'callclass-linksource',
    templateUrl: './call-class.linksource.component.html',
    entryComponents: [CallClassReportComponent]
})
export class CallClassLinkSourceComponent {
    //  @ViewChild("usagechart") usagechart: any;


    @ViewChild('linkfleetcontainer', { read: ViewContainerRef ,static:false}) fleetcontainer: ViewContainerRef;

    componentRef: ComponentRef<Component>;

    @Input() linktype: string;
    @Input() linksourceguid: string
    @Input() rtypeguid: string;

    private loader: EventEmitter<any>;
    @Input() isInvoiceActive: boolean = false;

    /* Invoice Months */
    @Input() invoicedateguid: string;

    @Input() fromdate: Date;
    @Input() todate: Date;
    @Input() frommonth: string;
    @Input() tomonth: string;
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

    @Input() istotalbillingcallcostvisible: boolean;
    @Input() rgModelArray: ReportingGroupViewModel[];
    subscription: any;

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
        private componentFactoryResolver: ComponentFactoryResolver,
        private viewContainerRef: ViewContainerRef
    ) {
        this.loader = globalEvent.busySpinner;
        
    }

    ngAfterViewInit() {
        
        //this.subscription = this.globalEvent.refreshCallClassFleet.subscribe((data: any) => {
            var p3 = this.loadCallClassDetailGroupByLinkSource();
            this.loader.emit(Promise.all([p3]));
        //});
    }

    onRowSelect(event: any) {
        
        this.callclassreportviewmodel = null;
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(CallClassReportComponent);
        this.componentRef = <any>this.fleetcontainer.createComponent(factory);
        this.componentRef.instance["invoicedateguid"] = this.invoicedateguid;
        this.componentRef.instance["networkguid"] = this.networkguid;
        this.componentRef.instance["billingplatformguid"] = this.billingplatformguid;
        this.componentRef.instance["benguid"] = this.benguid;
        this.componentRef.instance["ban"] = this.ban;
        this.componentRef.instance["isbandisplay"] = this.isbandisplay;
        this.componentRef.instance["fromdate"] = this.fromdate;
        this.componentRef.instance["todate"] = this.todate;
        this.componentRef.instance["frommonth"] = this.frommonth;
        this.componentRef.instance["tomonth"] = this.tomonth;
        this.componentRef.instance["linktype"] = this.linktype
        this.componentRef.instance["rtypeguid"] = this.rtypeguid;
        this.componentRef.instance["linksourceguid"] = event.data.linksourceguid;
        this.componentRef.instance["csvfilename"] = this.csvfilename;
        this.componentRef.instance["isbenexist"] = this.isbenexist;
        this.componentRef.instance["ismpayexist"] = this.ismpayexist;
        this.componentRef.instance["reportinggroup1guid"] = this.reportinggroup1guid;
        this.componentRef.instance["reportinggroup2guid"] = this.reportinggroup2guid;
        this.componentRef.instance["reportinggroup3guid"] = this.reportinggroup3guid;
        this.componentRef.instance["reportinggroup4guid"] = this.reportinggroup4guid;
        this.componentRef.instance["reportinggroup5guid"] = this.reportinggroup5guid;
        this.componentRef.instance["reportinggroup6guid"] = this.reportinggroup6guid;
        this.componentRef.instance["rgModelArray"] = this.rgModelArray;
        this.componentRef.changeDetectorRef.detectChanges();
        this.globalEvent.refreshLinkSourceCallClassGraph.emit({ linksourceguid: event.data.linksourceguid, description: event.data.description});


        this.componentRef.instance["ndesc"] = this.ndesc;

        this.componentRef.instance["billdesc"] = this.billdesc;

        this.componentRef.instance["bendesc"] = this.bendesc;

        this.componentRef.instance["_bandesc"] = this._bandesc

        this.componentRef.instance["r1desc"] = this.r1desc;
        this.componentRef.instance["r2desc"] = this.r2desc;
        this.componentRef.instance["r3desc"] = this.r3desc;
        this.componentRef.instance["r4desc"] = this.r4desc;
        this.componentRef.instance["r5desc"] = this.r5desc;
        this.componentRef.instance["r6desc"] = this.r6desc;
        this.componentRef.instance["istotalbillingcallcostvisible"] = this.istotalbillingcallcostvisible;
    }

    loadCallClassDetailGroupByLinkSource(): Promise<any> {
        //return this.invoiceReportService.GetCallClassDetails(this.linktype, this.invoicedateguid, this.networkguid, this.billingplatformguid, this.benguid, this.departmentguid, this.costcentreguid, UtilityMethod.IfNull(this.ban, '')).then(q => {
        //    this.callclassreportviewmodel  = q;
        //});
        // return null;
        return this.invoiceReportService.GetCallClassDetailsByLinkSource(this.linktype, this.linksourceguid, this.rtypeguid, UtilityMethod.IfNull(this.networkguid, ''), UtilityMethod.IfNull(this.billingplatformguid, ''), UtilityMethod.IfNull(this.benguid, ''), UtilityMethod.IfNull(this.ban, ''),
            UtilityMethod.IfNull(this.reportinggroup1guid, ''), UtilityMethod.IfNull(this.reportinggroup2guid, ''), UtilityMethod.IfNull(this.reportinggroup3guid, ''), UtilityMethod.IfNull(this.reportinggroup4guid, ''), UtilityMethod.IfNull(this.reportinggroup5guid, ''), UtilityMethod.IfNull(this.reportinggroup6guid, ''),
            UtilityMethod.IfNull(this.fromdate, ''), UtilityMethod.IfNull(this.todate, '')).then((res: any) => {
                this.callclassreportviewmodel = res;
            });
    }

    navigateToItemised(ccviewmodel?: CallClassReportViewModel) {


        this.router.navigate(['total-billing-itemised'], {
            queryParams: this.setQueryParams(ccviewmodel)
        });
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
                params.datasoc = ccviewmodel.datasoc
        }


        return params;
    }

    


}