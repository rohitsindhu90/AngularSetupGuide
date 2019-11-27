
import { Component, Input, OnInit, EventEmitter, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem, SortMeta } from 'primengdevng8/api';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { BANDetailService } from 'src/app/_services/bandetail.service';
import { ReportingGroupService } from 'src/app/_services/reporting-group.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { UtilityMethod, onStringCustomNumberSort } from 'src/app/_common/utility-method';
import { BenDetail } from 'src/app/_models/ben-detail';
import { BanDetail } from 'src/app/_models/ban-detail';
import { Column } from 'src/app/_models/primeng-datatable';

@Component({
    selector: 'history-cost-by-reporting-group',
    templateUrl: './history-cost-by-reporting-group.component.html'
})

export class HistoryCostByReportingGroupComponent implements OnInit {

    private loader: EventEmitter<any>;

    header: string;

    reportinggroupguid: string;
    networkguid: string;
    billingplatformguid: string;
    benguid: string;
    banguid: string;

    reportinggroupdescription: string;
    networkdescription: string;
    billingplatformdescription: string;
    bandescription: string;
    bendescription: string;

    reportingGroupArray: SelectItem[];
    networkArray: SelectItem[];
    billingPlatformArray: SelectItem[];
    BANArray: SelectItem[];
    BENArray: SelectItem[];

    model: any;
    datacolumns: Column[] = [];
    monthColumn: Column[] = [];
    noInvoiceAvailable?: boolean;

    constructor(private networkService: NetworkService,
        private bENDetailService: BENDetailService,
        private bANDetailService: BANDetailService,
        private reportingGroupService: ReportingGroupService,
        private invoiceDateService: InvoiceDateService,
        private globalEvent: GlobalEventsManager) {
        this.loader = globalEvent.busySpinner;
    }


    ngOnInit() {


        let p1 = this.loadInvoiceMonths();
        this.loader.emit(Promise.all([p1]).then(() => {
            if (!this.noInvoiceAvailable) {
                let process1 = this.loadReportingGroups();
                let process2 = this.loadNetworkDropdown();
                let process3 = this.loadBanDropDown();
                let process4 = this.loadBenDropDown();
                this.loader.emit(Promise.all([process1, process2, process3, process4]).then(() => {
                    this.refreshData();
                }))
            }
        }));



    }

    loadInvoiceMonths() {

        this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length > 0) {
                this.noInvoiceAvailable = false;
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    loadReportingGroups(): Promise<any> {
        this.clearReportingGroup();
        // this.reportingGroupArray.push({ label: 'ALL', value: null });
        return this.reportingGroupService.getReportingListForRGGroupAsync(true).then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.reportingGroupArray.push({
                    label: item.reportinggroupdisplayname, value: item.reportinggroupguid
                }));
                this.reportinggroupguid = this.reportingGroupArray[0].value;
                this.loadReportingGroupDesc();
            }
        });
    }

    clearReportingGroup() {
        this.reportingGroupArray = [];
        this.reportinggroupguid = null;
    }

    loadNetworkDropdown(): Promise<any> {
        this.clearNetworks();
        return this.networkService.getNetworkListForRGCost().then((data) => {
            if (data && data.length > 0) {
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

    loadBillingPlatform(): Promise<any> {
        this.clearBillingPlatform();
        return this.networkService.getBillingPlatformsForRGCost(this.networkguid).then((data) => {
            if (data && data.length > 0) {
                this.billingPlatformArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.billingPlatformArray.push({
                    label: item.billingplatformdescription, value: item.billingplatformguid
                }));
            }
        });
    }

    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    loadBenDropDown(): Promise<any> {
        this.clearBenDropdown();
        return this.bENDetailService.getBenDetailListForRGCost(this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, '')).then((data: BenDetail[]) => {
            if (data && data.length > 0) {
                this.BENArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.BENArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });
    }

    clearBenDropdown() {
        this.BENArray = [];
        this.benguid = null;
    }

    loadBanDropDown(): Promise<any> {
        this.clearBanDropdown();
        return this.bANDetailService.getBANDetailListForRGCost(this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, '')).then((data: BanDetail[]) => {
            if (data && data.length > 0) {
                this.BANArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.BANArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

    clearBanDropdown() {
        this.BANArray = [];
        this.banguid = null;
    }

    onReportingGroupChange() {
        let process1 = this.loadReportingGroupDesc();
        this.loader.emit(Promise.all([process1]).then(() => {
            this.refreshData();
        }));
    }

    loadReportingGroupDesc(): Promise<any> {
        return this.reportingGroupService.getReportingGroupDetailByGuid(this.reportinggroupguid).then(data => {
            this.header = data;
        });
    }

    onNetworkChange() {
        if (this.networkguid != null) {
            this.loadBillingPlatform().then(() => {
                this.onBillingPlatformChange();
            });
        }
        else {
            this.onBillingPlatformChange();
        }
    }

    onBillingPlatformChange() {
        let process1 = this.loadBanDropDown();
        let process2 = this.loadBenDropDown();
        this.loader.emit(Promise.all([process1, process2]).then((data) => {
            this.refreshData();
        }));
    }

    onBANChange() {
        this.loader.emit(this.refreshData());
    }

    onBENChange() {
        this.loader.emit(this.refreshData());
    }

    refreshData() {
        return this.reportingGroupService.getHistoricCostByRG(this.reportinggroupguid, UtilityMethod.IfNull(this.networkguid, ''), UtilityMethod.IfNull(this.billingplatformguid, ''), UtilityMethod.IfNull(this.banguid, ''), UtilityMethod.IfNull(this.benguid, '')).then((data) => {

            this.model = data;
            let endDate = new Date();
            endDate.setDate(1);
            endDate.setMonth(endDate.getMonth() + 1);
            let startDateYear = endDate.getFullYear() - 1;
            let startDate = new Date();
            startDate.setFullYear(startDateYear);
            startDate.setMonth(startDate.getMonth() + 1);
            startDate.setDate(1);
            let monthArray = [];
            for (let i = 0; i < 12; i++) {
                let local = new Date();
                local.setDate(1);
                local.setFullYear(startDate.getFullYear());
                local.setMonth(startDate.getMonth() + i);
                monthArray.push(local);
            }
            //debugger;
            //let monthRange = monthArray.map(x => UtilityMethod.getMonthYearFormatter(x, 'short', '2-digit'));
            let monthRange = monthArray.map(x => UtilityMethod.getShortMonthYearFormatter(x));
            this.monthColumn = [];

            monthRange.forEach(x => {
                this.monthColumn.push({
                    field: x,
                    header: x,
                    hidden: false,
                    filter: false,
                    sortable: true,
                    ddfilter: false,
                    ddfilterarray: [],
                    dd_selectedarray: [],
                    filtermode: "contains",
                });
            });
            this.model.forEach((x: any) => {
                monthRange.forEach(m => {
                    let usagestring: string = "NA";
                    //let monthwisedata = x.monthwisedetails.filter((s: any) => s.formatteddate === m);
                    let monthwisedata = x.monthwisedetails.filter(function (s: any) {
                       
                        return s.formatteddate === m;
                    });
                    if (monthwisedata.length > 0) {
                        usagestring = monthwisedata[0].totalcost;
                    }
                    x[m] = usagestring;
                })
            });

            // this.refreshGridFilter(data);

        });
    }


    onCustomSort = (evt: SortMeta) => {
        let comparer = onStringCustomNumberSort(evt);
        this.model.sort(comparer);
    }



}