import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalEventsManager } from '../../../_common/global-event.manager'
import { Invoice } from 'src/app/_models/invoice';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { GenericService } from 'src/app/_services/generic.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { UtilityMethod } from 'src/app/_common/utility-method';

@Component({
    selector: 'non-geographic-detail-report',
    templateUrl: './non-geographic-detail.component.html'
})
export class NonGeographicDetailReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    model: Invoice[];
      
    diallednumber: string;
    frominvoicemonth: string;
    toinvoicemonth: string;
    fromdate: Date;
    todate: Date;
    networkguid: string;
    networkdescription: string;
    billingplatformguid: string;
    billingplatformdescription: string;
    bendescription: string;
    benguid: string;
    bandescription: string;
    ban: string;
    csvfilename: string;
    isbenexist: boolean;
    isbillingplatformxist: boolean;
    networkfilterset: any[] = [{ value: null, label: "" }];
    sub:any
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param : UploadInvoiceService to inject
     */
    constructor(private networkService: NetworkService,
        private bendetailService: BENDetailService,
        private authenticationService: AuthenticationService,
        private invoicereportservice: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private genericService: GenericService,
        private globalEvent: GlobalEventsManager,
        private router: Router, private route: ActivatedRoute) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.diallednumber = params["dn"];
            this.fromdate = params["fd"];
            this.todate = params["td"];
            this.sub = this.route.queryParams.subscribe(params => {
                this.benguid = params['bn'] || "";
                this.networkguid = params['nt'] || "";
                this.billingplatformguid = params['bp'] || "";
                this.ban = params['ban'] || "";
            });

            this.refreshData();
        });

    }

    refreshData()
    {
        var premiumdetaillabeldata = JSON.parse(localStorage.getItem(LocalStorageProvider.premiumlocalstoragename));
        if (premiumdetaillabeldata) {

            this.frominvoicemonth = premiumdetaillabeldata[0].frominvoicemonth;
            this.toinvoicemonth = premiumdetaillabeldata[0].toinvoicemonth;
            this.billingplatformdescription = premiumdetaillabeldata[0].billingplatformdescription;
            this.bendescription = premiumdetaillabeldata[0].bendescription;
            this.networkdescription = premiumdetaillabeldata[0].networkdescription;
            this.bandescription = premiumdetaillabeldata[0].bandescription;
        }
        this.LoadPremiumRateDetail();

    }


    GetPremiumRateNumberDetailReportList(): Promise<any> {
        return this.invoicereportservice.GetPremiumRateNumberDetailByDialledNumber(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.diallednumber, UtilityMethod.IfNull(this.ban, '')).then(q => {
            this.model = q;
            //Getting  network  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => { this.networkfilterset.push(q); });
          
            var data = this.networkfilterset;
        });
    }
    LoadPremiumRateDetail() {
        this.loader.emit(Promise.all([this.IsBenExistForCompanyAsnyc(), this.IsBillingPlatformExistForCompanyAsnyc(), this.GetPremiumRateNumberDetailReportList()]));
        this.csvfilename = "Non-Geographic Detail "+this.diallednumber+" "+ this.frominvoicemonth + " " + this.toinvoicemonth;
        }
   
    //Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
    IsBenExistForCompanyAsnyc(): Promise<any>{
      return  this.bendetailService.IsBenExistForCompanyAsnyc().then(res => {
            this.isbenexist = res;
        });
    }

    //Check for Billing platform exist for company to Dispaly column in grid
    IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
        return this.genericService.IsBillingExistForCompanyAsnyc(this.networkguid).then(res => {
           this.isbillingplatformxist = res;
        });
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    
}