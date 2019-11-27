import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Invoice } from 'src/app/_models/invoice';
import { SelectItem, SortMeta } from 'primengdevng8/api';
import { BillingPlatform } from 'src/app/_models/billingplatform';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { Router } from '@angular/router';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { GenericService } from 'src/app/_services/generic.service';
import { NetworkService } from 'src/app/_services/network.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { NetworkType, BillingPlatformType } from 'src/app/_services/enumtype';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { Column } from 'src/app/_models/primeng-datatable';
@Component({
    selector: 'handset-total-report',
    templateUrl: './handset-total-report.component.html'
})
export class HandsetTotalReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    model: Invoice[];
    error: string;
    hidetaxcolumn: boolean = false;

    isbenexist: boolean;
    isbanexist: boolean;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthdetailArray: SelectItem[] = [];
    fromdate: Date;
    todate: Date;

    datacolumns: Column[] = [];
    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;
    selectedbillingPlatfrom: BillingPlatform;

    /* Ben List */
    benArray: SelectItem[];
    benguid: string;

    /* Ban List */
    banArray: SelectItem[];
    ban: string;

    benfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];
    networkfilterset: any[] = [{ value: null, label: "" }];
    noInvoiceAvailable?: boolean;
    csvfilename: string;
    qBenFilter:any;
    qBanFilter:any;
    /**
     * Constructor: used to inject services
     * @param genericservice: genericservice service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : invoicereportservice to inject
     */
    constructor(
        private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private globalEvent: GlobalEventsManager,
        private router: Router,
        private bendetailService: BENDetailService,
        private genericService: GenericService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,

    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        this.loadInvoiceMonthsNetworkCC();

    }



    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadInvoiceMonthsNetworkCC(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));
                //to get invoidedateguid for drill down parameter
                data.forEach(item => this.invoicemonthdetailArray.push({
                    label: item.invoicedateguid,
                    value: item.startdate,
                }));

                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.noInvoiceAvailable = false;
                this.csvfilename = "HandsetTotalReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                this.loadNetworkDropdown();
                this.loadBillingPlatformDropDown();
                this.loadBenDropDown();
                this.loadBanDropDown();
                this.RefreshData();
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });

    }


    RefreshData() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            this.loader.emit(this.loadInvoiceHandsetTotalReport().then(() => {
                this.hideTaxColumnGrid();
            }));
        }
    }

    hideTaxColumnGrid() {
        let ntguid;
        if (this.billingPlatformArray.length == 0) {
            ntguid = this.networkArray.length == 2 ? this.networkArray[1].value : this.networkguid;
            if (ntguid) {
                this.networkService.CheckBillingPlatformForHideTaxAsync(ntguid).then((data) => {
                    if (data && data != null) {
                        this.hidetaxcolumn = true;
                    }
                    else {
                        let ntguid = this.networkArray.length == 2 ? this.networkArray[1].value : this.networkguid;
                        let network = this.networkArray.filter(n => n.value == ntguid);
                        this.hidetaxcolumn = (network.length > 0 && network[0].label == NetworkType[NetworkType.EE]) ? true : false;
                    }
                });
            }
        }
        else if (this.billingplatformguid || this.networkguid) {
            this.billingplatformguid = this.selectedbillingPlatfrom ? this.selectedbillingPlatfrom.billingplatformguid : null;
            let network = this.networkArray.filter(n => n.value == this.networkguid);
            this.hidetaxcolumn = ((this.selectedbillingPlatfrom && (this.selectedbillingPlatfrom.id == BillingPlatformType.MyVodafone || this.selectedbillingPlatfrom.id == BillingPlatformType.Zygo)) || (network.length > 0 && network[0].label == NetworkType[NetworkType.EE])) ? true : false;
        }
        else {
            this.billingplatformguid = null;
            this.hidetaxcolumn = false;
        }
    }
    /**
     * load charge summary report
     */
    loadInvoiceHandsetTotalReport(): Promise<any> {
        //this.csvfilename = "HandsetTotalReport " + this.invoicemonthArray.filter(x => x.value === this.invoicedateguid)[0].label;
        return this.invoicereportservice.GetInvoiceHandsetTotalReport(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.ban).then(q => {
            this.model = q;
            this.clearGridFilter();

            if (this.benArray && this.benArray.length > 1) {

                //Getting  ben  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                    return { 'value': q.bendescription, 'label': q.bendescription };
                }).sort((a, b) => {
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                    return 0;
                })
                    .forEach(q => {
                        if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                            this.benfilterset.push(q);
                        }
                    });
            }

            if (this.banArray && this.banArray.length > 1) {
                //Getting  ben  list from grid data
                q.filter((obj, index, self) => self.findIndex((t) => { return t.ban === obj.ban }) === index).map(q => {
                    return { 'value': q.ban, 'label': q.ban };
                }).sort((a, b) => {
                    return parseInt(a.value) - parseInt(b.value);
                }).forEach(q => {
                    if (q.value) {
                        this.banfilterset.push(q);
                    }
                });
            }
        });
    }

    /**
        * Load the network array for the given company
        */
    loadNetworkDropdown() {

        this.networkService.getNetworkList().then((data) => {
            this.clearNetworks();
            if (data != null) {
                this.networkArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid
                }));
            }
        });
    }

    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatformDropDown() {
        this.clearBillingPlatform();
        if (this.networkguid != undefined) {
            this.networkService.getBillingPlatforms(this.networkguid).then((data) => {
                if (data && data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item
                    }));
                }
            });
        }
    }

    /**
  * Load the ben for the given company and selected network
  */
    loadBenDropDown() {
        this.clearBens();
        return this.bendetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {

                if (data.length > 1) {
                    this.isbenexist = true;
                }

                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });


    }

    /*Load the ban for the given company and selected netwok */
    loadBanDropDown() {
        this.clearBans();
        this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                if (data.length > 1) {
                    this.isbanexist = true;
                }

                this.banArray.push({ label: 'ALL', value: "" });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }
    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadNetworkDropdown();
            this.loadBillingPlatformDropDown();
            this.loadBenDropDown();
            this.loadBanDropDown();
            this.RefreshData();
            this.csvfilename = "HandsetTotalReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }

    }
    /**
     * Load the top usage grid and billing platforms for the given company and selected network
     */
    OnNetworkChange() {
        this.loadBillingPlatformDropDown();
        this.loadBenDropDown();
        this.loadBanDropDown();
        this.RefreshData();
        //this.loader.emit(Promise.all([process1, process2, process3, process4]));

    }

    /**
* Load the billing platforms for the given company and selected network
*/
    onChangeBillingPlatForm() {
        this.billingplatformguid = this.selectedbillingPlatfrom ? this.selectedbillingPlatfrom.billingplatformguid : null;
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.RefreshData();
    }

    /**
    * Clears the invoice months and selection
    */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        // this.model = [];
    }


    /**
     * Clears the networks dropdown and selecttion
     */
    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    /**
    * Clears the billing platform and selection
    */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    /**
      * Clears the ben dropdown and selecttion 
      */
    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    /**
 * Clears the ban dropdown and selecttion
 */
    clearBans() {
        this.banArray = [];
        this.ban = "";
    }

    clearGridFilter() {
        this.benfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }

    onStringCustomSort(event: SortMeta) {
        let comparer = function (a: Invoice, b: Invoice): number {
            let result: number = -1;
            if (isNaN(Number(a[event.field])))
                result = 1;
            if (isNaN(Number(b[event.field])))
                result = -1;
            if (Number(a[event.field]) > Number(b[event.field])) result = 1;

            return result * event.order;
        };
        this.model.sort(comparer);

    }


}