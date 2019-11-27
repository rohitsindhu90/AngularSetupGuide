import { Component, Input, OnInit, EventEmitter, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { SelectItem, SortMeta } from 'primengdevng8/api';
import { Column } from '../../_models/primeng-datatable';
import { AuthenticationService } from '../../_services/authentication.service';
import { ChartHelper, ChartType } from '../../_models/chart';
//import { Globalize } from './common/Globalize';
import { GlobalEventsManager } from '../../_common/global-event.manager';
//import { LocalStorageProvider } from '../_common/localstorageprovider';
import { UserDetail } from '../../_models/user-detail';
import { InvoiceService } from '../../_services/invoice.service';
import { UtilityMethod } from '../../_common/utility-method';
import { ReportingGroupType } from '../../_services/enumtype';
import { FeatureService } from '../../_services/feature.service';
import { Router } from '@angular/router';
import { setTimeout } from 'timers';
//import { DatePipe } from '@angular/common';
//import { forEach } from '@angular/router/src/utils/collection';
//import { forEach } from '@angular/common';
import { ReportingGroupDetailsProvider } from '../../_common/reporting-group-details-provider';
import { InvoiceDateService } from '../../_services/invoicedate.service';

@Component({
    selector: 'my-number-report',
    templateUrl: './my-number-report.component.html'
})

export class MyNumberComponent implements OnInit {

    private loader: EventEmitter<any>;

    qNetworkFilter: any;
    qAssetLocationFilter: any;
    qassetstatusFilter: any;

    selectedInvoiceId: number;
    username: string;
    userid: string;
    invoiceDateList: SelectItem[] = [];
    fleetdata: any;
    assetdata: any;
    chartdata: any;
    networkfilterset: any[] = [{ value: null, label: "" }];
    assetlocationfilterset: any[] = [{ value: null, label: "" }];
    assetstatusfilterset: any[] = [{ value: null, label: "" }];
    chartLineOption: any;
    noInvoiceAvailable?: boolean;

    constructor(private authenticationService: AuthenticationService
        , private globalEvent: GlobalEventsManager
        , private elementref: ElementRef
        , private ref: ChangeDetectorRef
        , private zone: NgZone
        , private invoiceService: InvoiceService
        , private featureservice: FeatureService
        , private router: Router
        , private invoiceDateService: InvoiceDateService
    ) {
        this.loader = globalEvent.busySpinner;
    }


    ngOnInit() {
        let process1 = this.loadInvoiceMonths();

        Promise.all([process1]);


    }

    loadInvoiceMonths() {
        this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length > 0) {
                this.noInvoiceAvailable = false;
                this.chartLineOption = this.GetChartLineOptions();
                let process1 = this.loadDropDown();
                let process5 = this.getUserDetails();

                Promise.all([process1.then(() => {
                    this.loadSpendTime();
                    this.loadFleetDetails();
                    this.loadAssetDetails();

                })]);

            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    loadSpendTime(): Promise<any> {
        return this.invoiceService.loadSpendTime().then((data) => {

            data.linechartlist.forEach((item: any, i: any) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));
            this.chartdata = {
                labels: data.months,
                datasets: data.linechartlist,
                monthid: data.monthid
            };

        });
    }

    loadDropDown(): Promise<any> {
        this.invoiceDateList = [];
        return this.invoiceService.loadMyNumberInvoiceDropDown().then((data) => {
            if (data && data.length > 0) {
                data.forEach((item: any) => this.invoiceDateList.push({
                    label: item.invoicedate,
                    value: item.id,
                }));
                this.selectedInvoiceId = this.invoiceDateList[0].value;
                this.noInvoiceAvailable = false;
            }
            else {
                this.noInvoiceAvailable = true;
            }

        });
    }

    loadFleetDetails(): Promise<any> {
        this.fleetdata = null;
        return this.invoiceService.loadFleetDetails(this.selectedInvoiceId).then((data) => {
            this.fleetdata = data;

            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.networkdescription === obj.networkdescription }) === index).map((q: any) => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach((q: any) => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });

        });
    }

    loadAssetDetails(): Promise<any> {
        this.assetdata = null;
        return this.invoiceService.loadAssetDetails(this.selectedInvoiceId).then((data) => {
            this.assetdata = data;

            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.location === obj.location }) === index).map((q: any) => {
                return { 'value': q.location, 'label': q.location };
            }).forEach((q: any) => {
                if (this.assetlocationfilterset.filter(n => n.value == q.value).length == 0) {
                    this.assetlocationfilterset.push(q);
                }
            });

            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.status === obj.status }) === index).map((q: any) => {
                return { 'value': q.status, 'label': q.status };
            }).forEach((q: any) => {
                if (this.assetstatusfilterset.filter(n => n.value == q.value).length == 0) {
                    this.assetstatusfilterset.push(q);
                }
            });

        });
    }

    getUserDetails(): Promise<any> {
        return this.invoiceService.getUserDetailsForMyNumber().then((data) => {
            if (data && data.split && data.split('__').length === 2) {
                this.userid = data.split('__')[0];
                this.username = data.split('__')[1];
            }
        });
    }

    GetChartLineOptions() {
        return ChartHelper.getChartOptions(ChartType.line, true, true, true, undefined, undefined, undefined, false, undefined, 16);
    }


    handleClick(evt: any) {
        let datasetindex = evt.element._datasetIndex;
        let index = evt.element._index;
        let data = evt.element._chart.controller.data;
        let mobilenumber = data.datasets[datasetindex].label;
        let monthGuid = data.monthid[index];
        this.invoiceService.getCTNBenBanDetails(mobilenumber).then((data: any) => {
            if (data && data.split && data.split('__').length === 2) {
                let benGuid = data.split('__')[0];
                let banGuid = data.split('__')[1];
                this.router.navigate(['invoice-itemised-bill', monthGuid, mobilenumber], { queryParams: { ben: benGuid, ban: banGuid } });
            }
        });
    }


    onViewInvoiceMonthChange(event: any) {
        this.loader.emit(Promise.all([this.loadSpendTime(), this.loadFleetDetails(), this.loadAssetDetails()]));
    }

    handleRowSelect(event: any) {
        let localmodel: any = event.data;
        this.router.navigate(['invoice-itemised-bill', localmodel.invoicedateguid, localmodel.mobilenumber], { queryParams: { ben: localmodel.benguid, ban: localmodel.banguid } });
    }

}