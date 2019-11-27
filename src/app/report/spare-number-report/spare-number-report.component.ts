import { Component, Input, OnInit, EventEmitter, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Column } from 'src/app/_models/primeng-datatable';
import { SelectItem, ConfirmationService, SortMeta } from 'primengdevng8/api';
import { ModalPopupService } from 'src/app/_common/modelpopup.service';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { BANDetailService } from 'src/app/_services/bandetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { NetworkService } from 'src/app/_services/network.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { EditSapreNumberReportComponent } from './edit-sparenumber-report/edit-sparenumber-report.component';

@Component({
    selector: 'spare-number-report',
    templateUrl: './spare-number-report.component.html'
})

export class SpareNumberReportComponent implements OnInit {

    private loader: EventEmitter<any>;

    allocatedOptions: SelectItem[] = [];
    allocatedvalue: boolean;
    isbenexist: boolean;
    isbandisplay: boolean;
    isbillingplatformxist: boolean;
    datacolumns: Column[] = [];
    model: any;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;

    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;


    networkfilterset: any[] = [{ value: null, label: "" }];
    qNetworkFilter: any;
    benfilterset: any[] = [{ value: null, label: "" }];
    qBenFilter: any;
    banfilterset: any[] = [{ value: null, label: "" }];
    statusfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    qBillingPlatformFilter: any;

    qBanFilter: any;

    constructor(private modalpopupservice: ModalPopupService, private confirmationservice: ConfirmationService, private globalEvent: GlobalEventsManager
        , private cTNDetailService: CTNDetailService, private invoiceReportService: InvoiceReportService, private bendetailService: BENDetailService
        , private bandetailService: BANDetailService, private genericService: GenericService, private networkService: NetworkService) {
        this.loader = globalEvent.busySpinner;
    }


    ngOnInit() {
        let process1 = this.loadAllocatedOptions();
        let process2 = this.invoiceReportService.getReportingGroupDetails(true).then(res => {
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        let process3 = this.loadNetwork();
        let process4 = this.CheckMultipleActiveBillingPlatform();
        let process5 = this.bandetailService.IsBANDisplayForSpareReport().then(res => {
            this.isbandisplay = res;
        });

        this.loader.emit(Promise.all([process2, process3, process4]).then(() => this.refreshData()));
    }

    loadAllocatedOptions() {
        this.allocatedOptions.push({
            label: "No", value: false
        });
        this.allocatedOptions.push({
            label: "Yes", value: true
        });

        this.allocatedOptions.push({
            label: "ALL", value: null
        });

        this.allocatedvalue = false;
    }

    clearAllocationOptions() {
        this.allocatedOptions = [];
        this.allocatedvalue = null;
    }

    onAllocatedChange() {
        this.loader.emit(this.refreshData());
    }

    CheckMultipleActiveBillingPlatform(): Promise<any> {
        return this.genericService.CheckMultipleActiveBillingPlatform(null).then(res => {
            this.isbillingplatformxist = res;
        });
    }

    refreshData() {
        this.clearGridFilter();
        return this.cTNDetailService.getSpareNumberReport(this.allocatedvalue, this.networkguid, this.billingplatformguid).then((data: any) => {
            this.clearGridFilter();
            this.model = data;
            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.network === obj.network }) === index).map((q: any) => {
                return { 'value': q.network, 'label': q.network };
            }).forEach((q: any) => { this.networkfilterset.push(q); });

            //Getting  ben  list from grid data
            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.bendescription === obj.bendescription }) === index).map((q: any) => {
                return { 'value': q.bendescription, 'label': q.bendescription, sortValue: q.ben };
            }).sort((a: any, b: any) => {
                return a.sortValue - b.sortValue;
            }).forEach((q: any) => {
                if (q.value) {
                    this.benfilterset.push(q);
                }
            });

            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.ban === obj.ban }) === index).map((q: any) => {
                return { 'value': q.ban, 'label': q.ban };
            }).forEach((q: any) => {
                if (this.banfilterset.filter(n => n.value == q.value).length == 0) {
                    this.banfilterset.push(q);
                }
            });

            data.filter((obj: any, index: number, self: any) => self.findIndex((t: any) => { return t.billingplatform === obj.billingplatform }) === index).map((q: any) => {
                return { 'value': q.billingplatform, 'label': q.billingplatform };
            }).forEach((q: any) => {
                if (q.value) {
                    this.billingplatformfilterset.push(q);
                }
            });
        });
    };

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        //this.qNetworkFilter = null;
        this.benfilterset = [{ value: null, label: "" }];
        //this.qBenFilter = null;
        this.banfilterset = [{ value: null, label: "" }];
        this.statusfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        //this.qBillingPlatformFilter = null;
    }

    onSpareDateSort(event: SortMeta) {
        let _this = this;
        let comparer = function (a: any, b: any): number {
            let result: number = -1;
            let aSpare = a.becamespare;
            let bSpare = b.becamespare;

            if (!aSpare)
                result = -1;
            if (!bSpare)
                result = 1;

            if (aSpare && bSpare) {
                let aDate = a.becamespare.split('/');
                let bDate = b.becamespare.split('/');
                let firstDate = new Date(aDate[2], aDate[1], aDate[0]);
                let secondDate = new Date(bDate[2], bDate[1], bDate[0]);
                if (firstDate > secondDate)
                    result = 1;
            }

            return result * event.order;
        };
        this.model.sort(comparer);

    }

    onAllocationSort(event: SortMeta) {
        let _this = this;
        let comparer = function (a: any, b: any): number {
            let result: number = -1;
            let aSpare = a.allocateddate;
            let bSpare = b.allocateddate;

            if (!aSpare)
                result = -1;
            if (!bSpare)
                result = 1;

            if (aSpare && bSpare) {
                let aDate = a.allocateddate.split('/');
                let bDate = b.allocateddate.split('/');
                let firstDate = new Date(aDate[2], aDate[1], aDate[0]);
                let secondDate = new Date(bDate[2], bDate[1], bDate[0]);
                if (firstDate > secondDate)
                    result = 1;
            }

            return result * event.order;
        };
        this.model.sort(comparer);

    }

    onEdit(item: any) {

        let params: any = { item: item };
        this.openModalPopup(<any>EditSapreNumberReportComponent, "Assign Order Reference Number", params);
    }

    openModalPopup(comp: Component, title: string, params?: any) {
        this.modalpopupservice.displayViewInPopup(title, comp, params, "md").result.then(res => {
            if (res) {
                this.loader.emit(this.refreshData());
            }
        });
    }

    onDelete(item: any) {

        this.confirmationservice.confirm({
            message: "Are you sure to remove " + item + " from spare number report?",
            key: 'confirmation-dialog-without-icon',
            rejectVisible: false,
            accept: () => {
                this.loader.emit(this.cTNDetailService.deleteSpareNumber(item).subscribe(result => {
                    if (result) {
                        this.confirmationservice.confirm({
                            message: "Spare Number Removed Successfully!",
                            key: 'dialog',
                            rejectVisible: false,
                            accept: () => {
                                this.loader.emit(this.refreshData());
                            }
                        });
                    }
                }));
            }
        });
    }


    loadNetwork(): Promise<any> {

        return this.networkService.getAllActiveNetworkList().then((data) => {
            this.clearNetworks();
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
            this.networkService.getNetworkBillingPlatforms(this.networkguid).then((data) => {
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

    onNetworkChange() {
        this.loadBillingPlatformDropDown();
        this.loader.emit(this.refreshData());
    }

    onChangeBillingPlatForm() {
        this.loader.emit(this.refreshData());
    }
}
