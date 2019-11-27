import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalEventsManager } from '../../../_common/global-event.manager'
import { Router, ActivatedRoute, Data} from '@angular/router';
import { Invoice } from 'src/app/_models/invoice';
import { NetworkService } from 'src/app/_services/network.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { GenericService } from 'src/app/_services/generic.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';

@Component({
    selector: 'most-dialled-number-detail-report',
    templateUrl: './most-dialled-number-detail.component.html'
})
export class MostDialledNumberDetailReportComponent implements OnInit {
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
      benguid: string;
      banguid: string;
      billingplatformdescription: string;
      bendescription: string;
      bandescription: string;
      csvfilename: string;
      isbenexist: boolean;
      isbillingplatformxist: boolean = false;
      sub: any;
      serviceused: string;
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
        private router: Router,
        private route: ActivatedRoute
    
        ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        
        this.route.params.subscribe(params => {
           
            this.diallednumber = params["dn"];
            this.fromdate = params["fd"];
            this.todate = params["td"];
            this.sub = this.route.queryParams.subscribe(params => {
                this.benguid = params['bn'] || null;
                this.banguid = params['ban'] || null;
                this.networkguid = params['nt'] || null;
                this.billingplatformguid = params['bp'] || null;
            });

            this.refreshData();
        });

    }

    refreshData()
    {
        
        var mostdialdescriptiondata = JSON.parse(localStorage.getItem(LocalStorageProvider.mostdialllocalstoragename));
        if (mostdialdescriptiondata) {
            this.frominvoicemonth = mostdialdescriptiondata[0].frominvoicemonth;
            this.toinvoicemonth = mostdialdescriptiondata[0].toinvoicemonth;
            this.billingplatformdescription = mostdialdescriptiondata[0].billingplatformdescription;
            this.bendescription = mostdialdescriptiondata[0].bendescription;
            this.networkdescription = mostdialdescriptiondata[0].networkdescription;
            this.bandescription = mostdialdescriptiondata[0].bandescription;
            this.serviceused = mostdialdescriptiondata[0].serviceused;
        }
        this.LoadMostDiallDetail();
    }
    
    LoadMostDiallDetail() {
        this.loader.emit(Promise.all([this.IsBenExistForCompanyAsnyc(), this.IsBillingPlatformExistForCompanyAsnyc(),this.GetMostDialledNumberDetailList()]));
        this.csvfilename = "Most Dialled Number Detail " + this.diallednumber + " " + this.frominvoicemonth + " " + this.toinvoicemonth;
    }

    GetMostDialledNumberDetailList(): Promise<any> {
        return this.invoicereportservice.GetMostDialledNumberDetail(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.banguid, this.diallednumber).then(q => {
            this.model = q;
        });
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

    sortDuration($event: any) {
        let sort = (model1: any, model2: any) => {
            let a = model1.duration;
            let b = model2.duration;
            let aParts = a.split(':').map((v: any) => Number(v));
            let bParts = b.split(':').map((v: any) => Number(v));;
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
        this.model.sort(sort);
    }
}