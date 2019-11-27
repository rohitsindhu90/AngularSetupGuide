import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalEventsManager } from '../../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { EuroWordItemisedViewModel } from 'src/app/_models/euro-world-itemised';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { EuroWorldTravellerService } from 'src/app/_services/euroworldtraveller.service';
import { ActivatedRoute } from '@angular/router';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';

@Component({
    selector: 'euro-world-itemised-bill',
    templateUrl: './euro-world-itemisedbill.component.html'
})
export class EuroWorldItemisedBillComponent implements OnInit {
    private loader: EventEmitter<any>;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicedateguid: string;
    //benguid?: string;

    invoiceitemisedmodel: EuroWordItemisedViewModel[]
    sub: any;
    csvfilename: string = "";
    categoryfilterset: any[] = [{ value: null, label: "" }];
    countryoforiginfilterset: any[] = [{ value: null, label: "" }];
    subcalltypefilterset: any[] = [{ value: null, label: "" }];
    countryoforigin: string = "";
    monthname: string = "";
    networkguid: string;
    networkdescription: string;
    billingplatformguid: string;
    billingplatformdescription: string;
    benguid: string;
    banguid: string;
    bendescription: string;
    bandescription: string;
    
    categoryFilter:any;
    subcallTypeFilter:any;
    constructor(
        private authenticationService: AuthenticationService,
        private invoiceDateService: InvoiceDateService,
        private euroWorldTravellerService: EuroWorldTravellerService,
        private globalEvent: GlobalEventsManager,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loadInvoiceMonths().then(() => {
            this.route.params.subscribe(params => {

                this.invoicedateguid = params["id"];
                this.sub = this.route.queryParams.subscribe(params => {
                    this.countryoforigin = params['co'] || "";
                    this.networkguid = params['nd'] || "";
                    this.billingplatformguid = params['bpd'] || "";
                    this.benguid = params['ben'] || "";
                    this.banguid = params['banid'] || "";
                    this.bandescription = params['ban'] || "";
                });
                this.refreshdata();
            })
        });
    }


    /**
    * This will redirect to the previous page
    */
    goback() {
        this.location.back();
    }


    /**
    * Load the avaialble  months for given company
    */
    loadInvoiceMonths(): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            data.forEach(item => this.invoicemonthArray.push({
                label: item.invoicedatedescription,
                value: item.invoicedateguid.toString(),
            }));

        });
    }

    /**
     * Clears the invoice months and selection
     */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.invoicedateguid = "";
    }

    //loading CallClass Number Details and there itemised data 
    refreshdata() {

        this.monthname = this.invoicemonthArray.find(x => x.value == this.invoicedateguid).label;
        this.csvfilename = "EuroWorldReport" +"_"+this.countryoforigin+ "_" + this.monthname;
        var p1 = this.GetEuroWorldInvoiceItemised();
        this.loader.emit(Promise.all([p1]));

        var euroworldlocalstoragedata = JSON.parse(localStorage.getItem(LocalStorageProvider.euroworldlocalstoragename));
        if (euroworldlocalstoragedata) {
            this.billingplatformdescription = euroworldlocalstoragedata[0].billingplatformdescription;
            this.bendescription = euroworldlocalstoragedata[0].bendescription;
            this.networkdescription = euroworldlocalstoragedata[0].networkdescription;
            this.bandescription = euroworldlocalstoragedata[0].bandescription;
        }

    }


    //loading select itemised data to grid
    GetEuroWorldInvoiceItemised(): Promise<any> {

        return this.euroWorldTravellerService.GetEuroWorldInvoiceItemised(this.invoicedateguid, this.countryoforigin, this.networkguid, this.billingplatformguid, this.benguid, this.banguid).then(res => {
            this.invoiceitemisedmodel = res;
            //Getting  category  list from grid data
            res.filter((obj, index, self) => self.findIndex((t) => { return t.calltype === obj.calltype }) === index).map(q => {
                return { 'value': q.calltype, 'label': q.calltype };
            }).forEach(q => {
                if (this.categoryfilterset.filter(n => n.value == q.value).length == 0) {
                    this.categoryfilterset.push(q);
                }
            });

            //Getting  subcalltype  list from grid data
            res.filter((obj, index, self) => self.findIndex((t) => { return t.subcalltype === obj.subcalltype }) === index).map(q => {
                return { 'value': q.subcalltype, 'label': q.subcalltype };
            }).forEach(q => {
                if (this.subcalltypefilterset.filter(n => n.value == q.value).length == 0) {
                    this.subcalltypefilterset.push(q);
                }
            });
        });
    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    } 
}