import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { InvoiceCTNCharge } from 'src/app/_models/report/invoicectn-charge-report.model';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { Router } from '@angular/router';
import { GenericService } from 'src/app/_services/generic.service';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';

@Component({
    selector: 'charge-report',
    templateUrl: './charge-report.component.html'
})
export class ChargeReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    error: string;

    model: InvoiceCTNCharge[];
    isbenexist: boolean;
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthdetailArray: SelectItem[] = [];

    fromdate?: Date;
    todate?: Date;

    /* Charge Group  */
    chargeGroupArray: SelectItem[];
    chargegroupguid: string;

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

    chargegroupfilterset: any[] = [{ value: null, label: "" }];
    noInvoiceAvailable?: boolean;
    csvfilename: string;
    chargegroupFilter:any;
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
        private genericservice: GenericService,
        private networkService: NetworkService,
        private bendetailService: BENDetailService,
        private invoiceservice: InvoiceService
       
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loadInvoiceMonthsNetworkCC();
     

        

    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.model = [];
        }
        else {
            this.loadBanDropDown();
            this.refreshData();
            this.csvfilename = "ChargeReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }

    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadInvoiceMonthsNetworkCC() {
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
                this.noInvoiceAvailable = false;
                this.fromdate = data[0].startdate;
                this.todate = data[0].startdate;
                this.loadChargeGroup();
                this.loadNetworkDropdown();
                this.loadBillingPlatformDropDown();
                this.loadBenDropDown();
                this.loadBanDropDown();
                this.refreshData();
                this.csvfilename = "ChargeReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;

            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }

    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.fromdate = null;
        this.todate = null;
        // this.model = [];
    }

    //loadInvoiceMonths() {
    //    this.clearInvoiceMonths();
    //    this.invoiceDateService.getInvoiceMonth().then((data) => {
    //        if (data.length > 0) {
    //            data.forEach(item => this.invoicemonthArray.push({
    //                label: item.invoicedatedescription,
    //                value: item.invoicedateguid
    //            }));
    //            this.invoicedateguid = data[0].invoicedateguid;
    //            this.loadChargeGroup();
    //            this.loadNetworkDropdown();
    //            this.loadBenDropDown();
    //            this.loadBanDropDown();
    //            this.refreshData();
    //        }
    //    });
    //}

    /**
    * Populates the network dropdown those aviable in invoce ctn for selected invoice month
    */
    loadChargeGroup() {
        this.clearChargeGroup();
        this.chargeGroupArray.push({ label: 'ALL', value: null });
        return this.genericservice.GetActiveChareGroupList().then((data) => {
            data.forEach(item => this.chargeGroupArray.push({
                label: item.description, value: item.chargegroupguid
            }));
        });
    }


    
    /**
    * Load the charge group 
    */
    getChargeGroup() {
        return this.genericservice.GetActiveChareGroupList()
    }

    refreshData()
    {
        this.loader.emit(this.loadInvoiceChargeReport());
    }

    loadNetworkDropdown() {
        this.clearNetworks();
        this.networkArray.push({ label: 'ALL', value: null });
        return this.networkService.getNetworkList().then((data) => {
            data.forEach(item => this.networkArray.push({
                label: item.networkdescription, value: item.networkguid
            }));
        });
    }


    loadBillingPlatformDropDown() {
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
    * Load the benfor the given company and selected network
    */
    //getBenDetails() {
    //    return this.bendetailService.getBenDetailList();
    //}


    loadBenDropDown(): Promise<any> {
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

    getBanDetails() {
        return this.bendetailService.getBenDetailList();
    }

    loadBanDropDown(): Promise<any> {
        this.clearBans();
        return this.invoiceservice.getBanList('', this.networkguid, this.billingplatformguid, this.fromdate, this.todate).then((data) => {
            if (data && data != null) {
                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
            }
        });

    }


    /**
     * load charge summary report
     */
    loadInvoiceChargeReport(): Promise<any> {
        return this.invoicereportservice.GetInvoiceCTNChargeReport(this.fromdate,this.todate, this.chargegroupguid, this.networkguid, this.billingplatformguid,this.benguid, UtilityMethod.IfNull(this.ban, '')).then(q => {
            this.model = q;

            this.clearGridFilter();

            //Getting charge group list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.chargegroupdescription === obj.chargegroupdescription }) === index).map(q => {
                return { 'value': q.chargegroupdescription, 'label': q.chargegroupdescription };
            }).forEach(q => { this.chargegroupfilterset.push(q); });
        });
    }



   
    handleRowSelect(event: any) {
        //let chargegroupguid = event.data["chargegroupguid"];
        //let chargedescription = event.data["chargedescription"]
        //this.router.navigate(['charge-detail-report', this.invoicedateguid, chargegroupguid], {
        //    queryParams: {
        //        cd: chargedescription
                
        //    }
        //});


        let chargereportdata = [];
        let chargegroupguid = event.data["chargegroupguid"];
        let chargedescription = event.data["chargedescription"];
        let networkguid = this.networkguid;
        let billingplatformguid = this.billingplatformguid;
        let benguid = this.benguid;        
        let networkdescription = this.networkArray.filter(x => x.value === this.networkguid)[0].label;
        let billingplatformdescription = this.billingPlatformArray === undefined || this.billingPlatformArray.length === 0 ? "" : this.billingPlatformArray.filter(x => x.value === this.billingplatformguid)[0].label;
        let bendescription = this.benArray === undefined || this.benArray.length === 0 ? "" : this.benArray.length > 2 ? this.benArray.filter(x => x.value === this.benguid)[0].label : "";
        let bandescription = this.banArray === undefined || this.banArray.length === 0 ? "" : this.banArray.length > 2 ? this.banArray.filter(x => x.value === this.ban)[0].label : "";

        chargereportdata.push({ billingplatformdescription: billingplatformdescription, bendescription: bendescription, networkdescription: networkdescription, bandescription: bandescription });

        LocalStorageProvider.setLabelStorage(LocalStorageProvider.chargereportstoragename, chargereportdata);
        //this.router.navigate(['non-geographic-detail-report', diallednumber, fromdate, todate], {
        //    queryParams: {
        //        nt: networkguid,
        //        bp: billingplatformguid,
        //        bn: benguid,
        //        ban: this.ban,
        //    }
        //});

        this.router.navigate(['charge-detail-report', this.fromdate, this.todate, chargegroupguid], {
            queryParams: {
                cd: chargedescription,
                nt: networkguid,
                bp: billingplatformguid,
                bn: benguid,
                ban: this.ban,
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
        this.loader.emit(Promise.all([process1, process2, process3]));
        this.refreshData();
    }
   

    onChangeBen() {
        this.refreshData();
    }

    onChangeBan() {
        this.refreshData();
    }

    onChangeBillingPlatForm() {
        this.loadBanDropDown();
        this.loadBenDropDown();
        this.refreshData();
    }




    /**
     * Clear the Charge Array dropdown and selecttion
     */
    clearChargeGroup() {
        this.chargeGroupArray = [];
        this.chargegroupguid = null;
    }
    
    clearGridFilter() {
        this.chargegroupfilterset = [{ value: null, label: "" }];
      
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
        this.ban = null;
    }

}