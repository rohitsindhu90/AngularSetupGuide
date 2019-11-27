import { ReportingGroupDetailsProvider } from '../_common/reporting-group-details-provider';
import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceService } from '../_services/invoice.service';

import { LinkType } from '../_services/enumtype';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { Router } from '@angular/router';
import { GenericService } from '../_services/generic.service';
import { Column } from '../_models/primeng-datatable';
import { CTNFleet } from "../_models/ctnfleet";
import { CTNDetailService } from '../_services/ctndetail.service';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { InvoiceReportService } from '../_services/invoice-report.service';
import { AppSettingService } from '../_common/appsetting.service';
import { retry } from 'rxjs/operator/retry';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'manage-fleet',
    templateUrl: './fleet.manage.component.html'

})

export class FleetManageComponent implements AfterViewInit {

    resourceurl: string = this.appSettingService.resourceurl;
    @Input() linktype: string;
    @Input() linksourceguid: string
    @Input() rtypeguid: string;
    @Input() activemobile: boolean;
    @Input() cancelledmobile: boolean;
    model: CTNFleet[];
    private loader: EventEmitter<any>;
    csvfilename: string;
    gridwidth: number = 2700;
    gridcolumn: number = 18;
    subscription: any;
    reportingList: ReportingGroupViewModel[];

    @Input() isbenexist: boolean;
    networkfilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];
    statusfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    datacolumns: Column[] = [];
    isbillingplatformxist: boolean;
    error: string;
    isShowBars: boolean = false;
    
    qBenFilter:any;
    qBillingPlatformFilter:any;
    qNetworkFilter:any;
    qStatusFilter:any;
    /* Constructor: used to inject services
      */
    constructor(private authenticationService: AuthenticationService, private invoiceService: InvoiceService, private globalEvent: GlobalEventsManager,
         private router: Router,
        private genericService: GenericService, 
        private cTNDetailService: CTNDetailService, 
        private invoiceReportService: InvoiceReportService,
        private appSettingService: AppSettingService) {

        this.loader = globalEvent.busySpinner;
    }

    ngAfterViewInit() {

        this.gridcolumn = this.gridcolumn + this.datacolumns.length;
        this.gridwidth = this.gridwidth + (this.datacolumns.length * 150);


        this.subscription = this.globalEvent.refreshFleet.subscribe((data: any) => {
            if (data.refreshFleet) {
                this.csvfilename = "ManageFleet";
                var p1 = this.invoiceReportService.getReportingGroupDetails(true).then(res => {
                    this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
                    let p3 = this.getManageFleetList();
                    this.loader.emit(Promise.all([p3]).then((data) => {

                        if (this.subscription) {
                            this.subscription.unsubscribe();
                            this.subscription = null;
                        }

                    }));
                });
            }
        });
    }

    ngOnInit() {
        this.showBars();
    }

    CheckMultipleActiveBillingPlatform(): Promise<any> {
        return this.genericService.CheckMultipleActiveBillingPlatform(null).then(res => {
            this.isbillingplatformxist = res;
        });
    }


    handleRowSelect(event: any) {
        let ctnGuid = event.data.ctndetailsguid;
        this.router.navigate(['update-mobile-detail'], { queryParams: { ctnguid: ctnGuid } });

    }

    getManageFleetList(): Promise<any> {
        return this.cTNDetailService.getFleetDetails(this.activemobile, this.cancelledmobile, this.linktype, this.linksourceguid, this.rtypeguid).then((data) => {
            this.model = data;
            this.CheckMultipleActiveBillingPlatform();
            this.clearGridFilter();
            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.network === obj.network }) === index).map(q => {
                return { 'value': q.network, 'label': q.network };
            }).forEach(q => { this.networkfilterset.push(q); });

            //Getting  ben  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                return { 'value': q.bendescription, 'label': q.bendescription, sortValue: q.ben };
            }).sort((a, b) => {
                return a.sortValue - b.sortValue;
            }).forEach(q => {
                if (q.value) {
                    this.benfilterset.push(q);
                }
            });

            //Getting status list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                return { 'value': q.status, 'label': q.status };
            }).forEach(q => {
                if (q.value) {
                    this.statusfilterset.push(q);
                }
            });

            data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatform === obj.billingplatform }) === index).map(q => {
                return { 'value': q.billingplatform, 'label': q.billingplatform };
            }).forEach(q => {
                if (q.value) {
                    this.billingplatformfilterset.push(q);
                }
            });

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
        this.statusfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
    }
    /**
  * to destroy the emit subscription on ngOnDestroy otherwise it keeps into the memory for root
*/
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    dignose() {
        return JSON.stringify(this.model);
    }

    generateImageTag(databarredimagepath: string, internationalbarredimagepath: string, roamingbarredimagepath: string) {
        let imgTag = "<img src='" + this.appSettingService.resourceurl + internationalbarredimagepath + "' title='" + (internationalbarredimagepath.indexOf("ubar") === -1 ? "Internatioanal Barred" : "Internatioanal Unbarred") + "'/>";
        imgTag += "<img src='" + this.appSettingService.resourceurl + databarredimagepath + "' title='" + (databarredimagepath.indexOf("ubar") === -1 ? "Data Barred" : "Data Unbarred") + "''/>";
        imgTag += "<img src='" + this.appSettingService.resourceurl + roamingbarredimagepath + "' title='" + (roamingbarredimagepath.indexOf("ubar") === -1 ? "Roaming Barred" : "Roaming Unbarred") + "'/>";
        return imgTag;
    }

    showBars(): Promise<any> {
        return this.cTNDetailService.showBars().then((data) => {
            this.isShowBars = data;
        });
    }
}
