import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem, SortMeta } from 'primengdevng8/api';
import { BENDetailService } from '../../_services/bendetail.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { NetworkService } from "../../_services/network.service";
import { InvoiceService } from "../../_services/invoice.service";
import { Invoice } from '../../_models/invoice';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { UtilityMethod } from '../../_common/utility-method';
import { ReportingGroupsGuid } from '../../_models/reportinggroup1';
import { CallClassReportGraphModel } from '../../_models/report/call-class-report-details.model';
import { ReportingGroupViewModel } from '../../_models/report/ReportingGroupViewModel';
import { ReportingGroupType } from '../../_services/enumtype';
import { AuthenticationService } from '../../_services/authentication.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
@Component({
    //selector: 'top-usage-report',
    templateUrl: './total-billing-summary-report.component.html'
})
export class TotalBillingSummaryReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthdetailArray: SelectItem[] = [];
    fromdate?: Date;
    todate?: Date;
    isbenexist: boolean;
    isbanexist: boolean;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* BEN List */
    benArray: SelectItem[];
    benguid: string;

    /* BAN List */
    banArray: SelectItem[];
    ban: string;

    csvfilename: string;
    error: string;
    model: CallClassReportGraphModel[];


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

    reportinggroupviewmodel: ReportingGroupViewModel[];
    isreportinggroupchangefired: boolean = false;
    noInvoiceAvailable?: boolean;

    constructor(private authenticationService: AuthenticationService,
       private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        //  private genericService: GenericService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,
        private router: Router,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
       
        var process1 = this.IsBenExistForCompanyAsnyc();
       
        var process3 = this.loadInvoiceMonthsNetworkCC();
        this.loader.emit(Promise.all([process1, process3]));
        this.loadReportingGroupList();
    }

    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any> {


        return this.bendetailService.IsBenExistForCompanyAsnyc(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => {
            this.isbenexist = res;
        });
    }

    /**
* Load the avaialble months for given company
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
                this.csvfilename = "TotalBillingSummary_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
                this.loadNetworkDropdown();
                this.loadBillingPlatformDropDown();
                this.loadBenDropDown();
                this.loadBanDropDown();
                this.loadTotalBillingSummary();
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });

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
       * Load the network array for the given company
       */
    loadNetworkDropdown() {
       
        this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
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
    * Clears the networks dropdown and selecttion
    */
    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatformDropDown(): Promise<any> {
        this.clearBillingPlatform();
        if (this.networkguid != undefined) {
            return this.networkService.getBillingPlatforms(this.networkguid, false, this.fromdate, this.todate).then((data) => {
                if (data && data != null) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item.billingplatformguid
                    }));

                }
            });
        }
    }

    /**
    * Clears the billing platform and selection
    */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }

    /**
  * Load the ben for the given company and selected network
  */
    loadBenDropDown(): Promise<any> {
        this.clearBens();
        return this.bendetailService.getBenDetailList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            // this.bendetailService.getBenDetailList().then((data) => {
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

    /**
     * Clears the ben dropdown and selecttion
     */
    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    /*Load the ban for the given company and selected netwok */
    loadBanDropDown(): Promise<any> {
        this.clearBans();

        return this.invoiceService.getBanList(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                if (data.length > 1) {
                    this.isbanexist = true;
                }

                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }

    /**
* Clears the ban dropdown and selecttion
*/
    clearBans() {
        this.banArray = [];
        this.ban = null;
    }

    /**
* Load the Total Biiing Summary Data report for given company
*/
    loadTotalBillingSummary() {

        this.loader.emit(
            
            this.invoiceReportService.GetCallClassDetailsGraph(null, this.networkguid, this.billingplatformguid, this.benguid, this.ban, this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid,
            this.reportinggroup6guid, this.fromdate, this.todate).then((data) => {
                this.model = data;


            })
            );
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadBenDropDown();
            this.loadBanDropDown();
            this.loadTotalBillingSummary();
            this.csvfilename = "TotalBillingSummary_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    /**
   * Load the  grid and billing platforms for the given company and selected network
   */
    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBenDropDown();
        let process3 = this.loadBanDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.loadTotalBillingSummary();
    }


    /**
* Load the billing platforms for the given company and selected network
*/
    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.loadTotalBillingSummary();
    }


    /**
       * Load the ReportingGroup1 array for the given company
       */
    onChangeReportingGroupEvent(reportinggroupsguidids: any) {

        if (reportinggroupsguidids != null) {
            this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
            this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
            this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
            this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
            this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
            this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

            this.reportinggroup1description = reportinggroupsguidids.reportinggroup1description;
            this.reportinggroup2description = reportinggroupsguidids.reportinggroup2description;
            this.reportinggroup3description = reportinggroupsguidids.reportinggroup3description;
            this.reportinggroup4description = reportinggroupsguidids.reportinggroup4description;
            this.reportinggroup5description = reportinggroupsguidids.reportinggroup5description;
            this.reportinggroup6description = reportinggroupsguidids.reportinggroup6description;

            this.loadTotalBillingSummary();
            this.isreportinggroupchangefired = true;
        }
    }


    loadReportingGroupList(): Promise<any> {

        return this.invoiceReportService.getReportingGroupDetails(true).then(res => {
            this.reportinggroupviewmodel = res;
        });

    }

    //on row click we are redirecting user to itemised page
    onRowSelect(event: any) {

        event.originalEvent.stopImmediatePropagation();
        let rheader = event.data.reportdescription;
        this.navigateToTotalBillingByCallCategory(rheader);
    }

    navigateToTotalBillingByCallCategory(rheader: string) {
        this.router.navigate(['total-billing-analysis'], {
            queryParams: this.setQueryParams(undefined, rheader)
        });
    }

    setQueryParams(ccviewmodel?: any, rheader?: string): any {
        let benGuid: string;
        let bendesc: any;
        let billGuid: string;
        let billdesc: string;
        let networkGuid: string;
        let networkdesc: string;
        let banGuid: string;
        let bandesc: string;
        let fromdate: Date;
        let todate: Date;
        let frommonth: string;
        let tomonth: string;
        let reportinggroup1guid: string = null;
        let reportinggroup1description: string = null;
        let reportinggroup2guid: string = null;
        let reportinggroup2description: string = null;
        let reportinggroup3guid: string = null;
        let reportinggroup3description: string = null;
        let reportinggroup4guid: string = null;
        let reportinggroup4description: string = null;
        let reportinggroup5guid: string = null;
        let reportinggroup5description: string = null;
        let reportinggroup6guid: string = null;
        let reportinggroup6description: string = null;

        benGuid = this.benguid;
        bendesc = this.benArray && this.benArray.length > 0 ? this.benArray.filter(x => x.value == (this.benguid || null))[0].label : null;
        billGuid = this.billingplatformguid;
        billdesc = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].label : null;
        networkGuid = this.networkguid;
        networkdesc = this.networkArray.filter(x => x.value == (this.networkguid || null))[0].label;
        banGuid = this.ban;
        bandesc = this.banArray && this.banArray.length > 0 ? this.banArray.filter(x => x.value == (this.ban || null))[0].label : null;


        fromdate = this.fromdate;
        todate = this.todate;
        // }

        frommonth = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.fromdate || null))[0].label : null;
        tomonth = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.todate || null))[0].label : null;

        if (this.isreportinggroupchangefired) {
            reportinggroup1guid = this.reportinggroup1guid != undefined ? this.reportinggroup1guid : null;
            reportinggroup2guid = this.reportinggroup2guid != undefined ? this.reportinggroup2guid : null;
            reportinggroup3guid = this.reportinggroup3guid != undefined ? this.reportinggroup3guid : null;
            reportinggroup4guid = this.reportinggroup4guid != undefined ? this.reportinggroup4guid : null;
            reportinggroup5guid = this.reportinggroup5guid != undefined ? this.reportinggroup5guid : null;
            reportinggroup6guid = this.reportinggroup6guid != undefined ? this.reportinggroup6guid : null;

            reportinggroup1description = this.reportinggroup1description != undefined ? this.reportinggroup1description : null;
            reportinggroup2description = this.reportinggroup2description != undefined ? this.reportinggroup2description : null;
            reportinggroup3description = this.reportinggroup3description != undefined ? this.reportinggroup3description : null;
            reportinggroup4description = this.reportinggroup4description != undefined ? this.reportinggroup4description : null;
            reportinggroup5description = this.reportinggroup5description != undefined ? this.reportinggroup5description : null;
            reportinggroup6description = this.reportinggroup6description != undefined ? this.reportinggroup6description : null;
        }

        else {
            var reportinggroup1 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                reportinggroup1description = "All";
            }
            var reportinggroup2 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {

                reportinggroup2description = "All";
            }

            var reportinggroup3 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                reportinggroup3description = "All";

            }

            var reportinggroup4 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {

                reportinggroup4description = "All";
            }

            var reportinggroup5 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {

                reportinggroup5description = "All";
            }

            var reportinggroup6 = this.reportinggroupviewmodel.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {

                reportinggroup6description = "All";

            }
        }

        let params = {
            // mn: mn,
            benGuid: benGuid,
            bendesc: bendesc,
            billingguid: billGuid,
            billdesc: billdesc,
            nid: networkGuid,
            ndesc: networkdesc,
            banGuid: banGuid,
            bandesc: UtilityMethod.IfNull(bandesc, ''),
            rheader: rheader,
            fromdate: fromdate,
            todate: todate,
            frommonth: frommonth,
            tomonth: tomonth,
            r1guid: reportinggroup1guid,
            r1desc: reportinggroup1description,
            r2guid: reportinggroup2guid,
            r2desc: reportinggroup2description,
            r3guid: reportinggroup3guid,
            r3desc: reportinggroup3description,
            r4guid: reportinggroup4guid,
            r4desc: reportinggroup4description,
            r5guid: reportinggroup5guid,
            r5desc: reportinggroup5description,
            r6guid: reportinggroup6guid,
            r6desc: reportinggroup6description

        }
        return params;
    }

    onStringCustomSort(event: SortMeta) {
        let _this = this;
        let comparer = function (a: CallClassReportGraphModel, b: CallClassReportGraphModel): number {
            let result: number = -1,
                firstDuration = _this.convertDuratioIntoMintues(a[event.field]),
                secondDuration = _this.convertDuratioIntoMintues(b[event.field]);

            if (isNaN(Number(firstDuration)))
                result = 1;
            if (isNaN(Number(secondDuration)))
                result = -1;
            if (Number(firstDuration) > Number(secondDuration)) result = 1;

            return result * event.order;
        };
        this.model.sort(comparer);

    }

    convertDuratioIntoMintues(duration: string) {
        let strArray = duration.split(":");
        let hours: number = +strArray[0],
            minutes: number = + strArray[1],
            seconds: number = + strArray[2],
            timeInminutes = (hours * 60) + minutes + (seconds / 60);
        return timeInminutes;
    }
}
