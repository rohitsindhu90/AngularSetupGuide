import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { AssetSummaryViewModel } from '../_models/asset/asset-summary';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { Router } from '@angular/router';
import { AssetService } from '../_services/asset.service';
import { GenericService } from '../_services/generic.service';
import { InvoiceReportService } from '../_services/invoice-report.service';
import { Column } from '../_models/primeng-datatable';
import { ReportingGroupDetailsProvider } from '../_common/reporting-group-details-provider';

@Component({
    selector: 'asset-fleet',
    templateUrl: './asset.fleet.component.html'
})
export class AssetFleetComponent implements AfterViewInit, OnInit {

    @Input() IsCompanyOwned: boolean;
    @Input() IsEmployeeOwned: boolean;
    @Input() IsArchivedAsset: boolean;
    @Input() linktype: string
    @Input() linksourceguid: string;
    @Input() rtypeguid: string;


    model: AssetSummaryViewModel[];
    subscription: any;
    datacolumns: Column[] = [];

    networkfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    isbillingplatformxist: boolean;
    assetlocationfilterset: any[] = [{ value: null, label: "" }];
    assetstatusfilterset: any[] = [{ value: null, label: "" }];
    csvfilename = "Asset_Summary";
    ShowPOAgainstAssetActive: boolean;
    IsSupplierActive: boolean;
    isAssetRegisterIDActive: boolean;
    qNetworkFilter: any;
    qBillingPlatformFilter: any;
    qAssetLocationFilter: any;
    qassetstatusFilter: any;

    private loader: EventEmitter<any>;

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private genericService: GenericService,
        private invoicereportservice: InvoiceReportService,
        private router: Router) {

        this.loader = globalEvent.busySpinner;

    }

    ngAfterViewInit() {

        this.subscription = this.globalEvent.refreshAssetFleet.subscribe((data: any) => {
            //Get Reporting Group details 

            var p1 = this.invoicereportservice.getReportingGroupDetails(true).then(res => {
                this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
            });
            var p2 = this.IsBillingPlatformExistForCompanyAsnyc();
            var p3 = this.loadAssetSummary();
            this.loader.emit(Promise.all([p1, p2, p3]).then((data) => {

                if (this.subscription) {
                    this.subscription.unsubscribe();
                    this.subscription = null;
                }
            }));
            this.csvfilename = "Asset_Summary" + (this.linktype == undefined ? "" : "_" + this.linktype);
        });
    }

    ngOnInit() {
        let p1 = this.showSupplier();
        let p2 = this.IsShowPOAgainstAssetActive();
        let p3 = this.checkAssetRegisterIDActive();
        this.loader.emit(Promise.all([p1, p2, p3]));
    }

    IsShowPOAgainstAssetActive() {
        this.assetService.IsShowPOAgainstAssetActive().then((data) => {
            this.ShowPOAgainstAssetActive = data;
        });
    }

    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(null).then(res => {
            this.isbillingplatformxist = res;
        });
    }

    loadAssetSummary(): Promise<any> {

        return this.assetService.GetAssetSummaryData(this.IsCompanyOwned, this.IsEmployeeOwned, this.IsArchivedAsset, this.linktype, this.linksourceguid, this.rtypeguid).then((data) => {

            this.clearGridFilter();

            this.model = data;

            data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });

            if (this.isbillingplatformxist) {
                data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                    return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
                }).forEach(q => {
                    if (this.billingplatformfilterset.filter(n => n.value == q.value).length == 0) {
                        this.billingplatformfilterset.push(q);
                    }
                });
            }

            data.filter((obj, index, self) => self.findIndex((t) => { return t.assetlocation === obj.assetlocation }) === index).map(q => {
                return { 'value': q.assetlocation, 'label': q.assetlocation };
            }).forEach(q => {
                if (this.assetlocationfilterset.filter(n => n.value == q.value).length == 0) {
                    this.assetlocationfilterset.push(q);
                }
            });

            data.filter((obj, index, self) => self.findIndex((t) => { return t.assetstatus === obj.assetstatus }) === index).map(q => {
                return { 'value': q.assetstatus, 'label': q.assetstatus };
            }).forEach(q => {
                if (this.assetstatusfilterset.filter(n => n.value == q.value).length == 0) {
                    this.assetstatusfilterset.push(q);
                }
            });

        });
    }

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.assetlocationfilterset = [{ value: null, label: "" }];
        this.billingplatformfilterset = [{ value: null, label: "" }];
        this.assetstatusfilterset = [{ value: null, label: "" }];
    }

    ngOnDestroy() {

        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    dignose() {
        return JSON.stringify(this.model);
    }

    onRowSelect($event: any) {

        let assetguid = $event.data.assetguid;
        this.router.navigate(['update-asset-details'], {
            queryParams: {
                assetguid: assetguid
            }
        });

    };

    showSupplier(): Promise<any> {

        return this.assetService.ShowSupplier().then((data) => {
            this.IsSupplierActive = data;
        });
    }

    checkAssetRegisterIDActive() {
        this.assetService.isAssetRegisterIDActive().then((data) => {
            this.isAssetRegisterIDActive = data;
        });
    }
}