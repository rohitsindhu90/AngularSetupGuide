import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';;
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { EuroWorldTravellerInternationalSummaryViewModel } from 'src/app/_models/report/euroworldtravellerinternationalsummaryviewmodel';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { NetworkService } from 'src/app/_services/network.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { Router } from '@angular/router';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { EuroWorldTravellerService } from 'src/app/_services/euroworldtraveller.service';

@Component({
    selector: 'euro-world-report',
    templateUrl: './euro-world-traveller-report.component.html'
})
export class EuroWorldTravellerReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicedateguid: string;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* Ben List */
    benArray: SelectItem[];
    benguid: string;
    banArray: SelectItem[];
    ban: string;

    noInvoiceAvailable: boolean;
    model: EuroWorldTravellerInternationalSummaryViewModel[];
    showfirstgrid: boolean = true;
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : UploadInvoiceService to inject
     */
    constructor(private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private euroWorldTravellerService: EuroWorldTravellerService,
        private networkService: NetworkService,
        private invoiceService: InvoiceService,
        private benDetailService: BENDetailService,
        private router: Router) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loader.emit(this.loadInvoiceMonths());
    }

    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadInvoiceMonths() {

        this.invoiceDateService.getInvoiceMonth().then((data) => {
            this.clearInvoiceMonths();
            if (data.length > 0) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.invoicedateguid.toString(),
                }));
                this.invoicedateguid = data[0].invoicedateguid;
                this.noInvoiceAvailable = false;
                this.loadNetworkDropdown();
                this.loadBenDropDown();
                this.loadBanDropDown();
                this.refreshData();
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    onInvoiceMonthChange(event: any) {

        this.loadNetworkDropdown();
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }


    /**
      * Load the network array for the given company
      */
    loadNetworkDropdown() {
       
        this.networkService.getNetworkList(null).then((data) => {
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
            this.networkService.getBillingPlatforms(this.networkguid, null, null, null, this.invoicedateguid).then((data) => {
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
    loadBenDropDown() {
        this.clearBens();
        this.benDetailService.getBenDetailList(this.invoicedateguid, this.networkguid, this.billingplatformguid).then((data) => {
            if (data && data != null) {
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
        this.invoiceService.getBanList(this.invoicedateguid, this.networkguid, this.billingplatformguid).then((data) => {
            if (data && data != null) {
                this.banArray.push({ label: 'ALL', value: "" });
                data.forEach(item => this.banArray.push({ label: item.description, value: item.banguid }));
            }
        });
    }


    /**
     * Load the billing platforms for the given company and selected network
     */
    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        let process2 = this.loadBenDropDown();
        let process3 = this.loadBanDropDown();
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }

    // change event of Billing Platform to load the ben drop down and refresh data
    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }

    refreshData() {
        this.loader.emit(this.euroWorldTravellerService.getEuroWorldTravellerData(this.invoicedateguid, this.networkguid, this.billingplatformguid, this.benguid, this.ban).then(data => {
            this.model = data;
            // this.showfirstgrid = data &&  data.euroworldtravellersavingsviewmodellist != undefined ? data.euroworldtravellersavingsviewmodellist.length > 1 : false;
        }));
    }
    handleRowSelect(event: any) {
        var euroworlddescriptiondata = [];
        let networkguid = this.networkguid;
        let billingplatformguid = this.billingplatformguid;
        let benguid = this.benguid;

        let countryoforigin = event.data["countryoforigin"];
        let networkdescription = this.networkArray.filter(x => x.value === this.networkguid)[0].label;
        let billingplatformdescription = this.billingPlatformArray === undefined || this.billingPlatformArray.length === 0 ? "" : this.billingPlatformArray.filter(x => x.value === this.billingplatformguid)[0].label;
        let bendescription = this.benArray === undefined || this.benArray.length === 0 ? "" : this.benArray.length > 1 ? this.benArray.filter(x => x.value === this.benguid)[0].label : "";

        let bandescription = this.banArray === undefined || this.banArray.length === 0 ? "" : this.banArray.length > 1 ? this.banArray.filter(x => x.value === this.ban)[0].label : "";

        euroworlddescriptiondata.push({ billingplatformdescription: billingplatformdescription, bendescription: bendescription, networkdescription: networkdescription, bandescription: bandescription });

        bandescription = bandescription === "ALL" ? "" : bandescription;

        LocalStorageProvider.setLabelStorage(LocalStorageProvider.euroworldlocalstoragename, euroworlddescriptiondata);

        this.router.navigate(['euro-world-itemised-bill', this.invoicedateguid], {
            queryParams:
            {
                co: countryoforigin,
                nd: networkguid,
                bpd: billingplatformguid,
                ben: benguid,
                ban: bandescription,
                banid: this.ban
            }
        });
    }
    /**
     * Clears the invoice months and selection
     */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.invoicedateguid = "";
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

}