import { Component, OnInit, EventEmitter } from '@angular/core';
import { InvoiceItemisedViewModel } from 'src/app/_models/invoiceitemised';
import { SelectItem } from 'primengdevng8/api';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';


@Component({
    selector: 'most-dialled-number-report',
    templateUrl: './most-dialled-number.component.html'
})
export class MostDialledNumberReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    model: InvoiceItemisedViewModel[];
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromdate?: Date;
    todate?: Date;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* ben */
    benArray: SelectItem[];
    benguid: string;

    /* ban */
    banArray: SelectItem[];
    ban: string;


    /* Invoice Months */
    invoicemonths: SelectItem[];
    invoicemonthname: string;
    error: string;
    csvfilename: string;
    topvalue: number;
    isbandisplay: boolean;
    noInvoiceAvailable?: boolean;
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : invoicereportservice to inject
     */
    constructor(private networkService: NetworkService,
        private bendetailService: BENDetailService,
        private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private globalEvent: GlobalEventsManager,
        private benDetailService: BENDetailService,
        private router: Router,
        private invoiceService: InvoiceService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loader.emit(this.loadInvoiceMonths());

    }

    IsBANDisplay() {
        this.invoiceService.IsBanDisplay(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate).then(res => this.isbandisplay = res);
    }

    refreshData() {
        if (this.topvalue <= 0) {
            this.topvalue = 1;
        }
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            var p1 = this.GetMostDialledNumberReport();
            this.loader.emit(Promise.all([p1]));
            this.csvfilename = "Most Dialled Number Report " + this.invoicemonthArray.filter(x => x.value === this.fromdate)[0].label + " " + this.invoicemonthArray.filter(x => x.value === this.todate)[0].label;
        }
    }


    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadInvoiceMonths(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length > 0) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate
                }));
                this.noInvoiceAvailable = false;
                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.topvalue = 10;
                this.loadDropdownsAndData();
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    loadDropdownsAndData() {
        let process1 = this.loadNetworkDropdown();
        let process2 = this.loadBillingPlatformDropDown();
        let process3 = this.loadBenDropDown();
        let process4 = this.loadBanDropDown();
        //Promise.all([process1, process2, process3, process4]).then(() => this.refreshData());
        let process5 = this.refreshData();
        Promise.all([process1, process2, process3, process4, process5]);
    }

    onInvoiceMonthChange(event: any) {
        this.invoicemonthname = event.originalEvent.currentTarget.innerText;
        this.loadDropdownsAndData();
    }

    /**
      * Load the network array for the given company
      */
    loadNetworkDropdown(): Promise<any> {
        
        return this.networkService.getNetworkList().then((data) => {
            this.clearNetworks();
            if (data && data != null) {
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
    loadBillingPlatformDropDown(): Promise<any> {
        this.clearBillingPlatform();
        if (this.networkguid != undefined) {
            return this.networkService.getBillingPlatforms(this.networkguid).then((data) => {
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
  * Load the ben for the given company and selected network
  */
    loadBenDropDown(): Promise<any> {
        this.clearBens();
        return this.benDetailService.getBenDetailList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
            }
        });


    }

    /*Load the ban for the given company and selected netwok */
    loadBanDropDown(): Promise<any> {
        this.clearBans();
        return this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.banArray.push({ label: 'ALL', value: "" });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });
    }


    /**
     * Load the billing platforms for the given company and selected network
     */
    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBanDropDown();
        let process3 = this.loadBenDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]).then(() => this.refreshData()));
        this.refreshData();
    }

    // change event of Billing Platform to load the ben drop down and refresh data
    onChangeBillingPlatForm() {
        let process1 = this.loadBanDropDown();
        let process2 = this.loadBenDropDown();
        this.loader.emit(Promise.all([process1, process2]).then(() => this.refreshData()));
    }



    GetMostDialledNumberReport(): Promise<any> {

        return this.invoicereportservice.GetMostDialledNumberReport(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.topvalue, this.ban).then(q => {

            this.model = q;
        });
    }


    handleRowSelect(event: any) {

        var mostdialdescriptiondata = [];
        let diallednumber = event.data["diallednumber"];
        let serviceused = event.data["serviceused"];
        let fromdate = this.fromdate;
        let todate = this.todate;
        let networkguid = this.networkguid;
        let billingplatformguid = this.billingplatformguid;
        let benguid = this.benguid;
        let ban = this.ban
        let networkdescription = this.networkArray.filter(x => x.value === this.networkguid)[0].label;
        let frominvoicemonth = this.invoicemonthArray.filter(x => x.value === this.fromdate)[0].label;
        let toinvoicemonth = this.invoicemonthArray.filter(x => x.value === this.todate)[0].label;
        let billingplatformdescription = this.billingPlatformArray === undefined || this.billingPlatformArray.length === 0 ? "" : this.billingPlatformArray.filter(x => x.value === this.billingplatformguid)[0].label;
        let bendescription = this.benArray === undefined || this.benArray.length === 0 ? "" : this.benArray.length > 2 ? this.benArray.filter(x => x.value === this.benguid)[0].label : "";
        let bandescription = this.banArray === undefined || this.banArray.length === 0 ? "" : this.banArray.length > 1 ? this.banArray.filter(x => x.value === this.ban)[0].label : "";

        mostdialdescriptiondata.push({
            frominvoicemonth: frominvoicemonth,
            toinvoicemonth: toinvoicemonth,
            billingplatformdescription: billingplatformdescription,
            bendescription: bendescription,
            networkdescription: networkdescription,
            bandescription: bandescription,
            serviceused: serviceused
        });

        LocalStorageProvider.setLabelStorage(LocalStorageProvider.mostdialllocalstoragename, mostdialdescriptiondata);
        this.router.navigate(['most-dialled-number-detail-report', diallednumber, fromdate, todate], {
            queryParams: {
                nt: networkguid,
                bp: billingplatformguid,
                bn: benguid,
                ban: ban
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

    /* Sorting */
    sortLongerTime($event: any) {

        let comparer = (model1: InvoiceItemisedViewModel, model2: InvoiceItemisedViewModel) => {
            let a = model1.duration;
            let b = model2.duration;
            let aParts = a.split(':').map((v) => Number(v));
            let bParts = b.split(':').map((v) => Number(v));;
            if (aParts[0] > bParts[0])
                return 1 * $event.order;
            else if (aParts[0] < bParts[0])
                return -1 * $event.order;
            if (aParts[1] > bParts[1])
                return 1 * $event.order;
            else if (aParts[1] < bParts[1])
                return -1 * $event.order;
            if (aParts[2] > bParts[2])
                return 1 * $event.order;
            else if (aParts[2] < bParts[2])
                return -1 * $event.order;
            return 0;
        }
        this.model.sort(comparer);
    }
}