import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from '../../_services/authentication.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { InvoiceService } from '../../_services/invoice.service'
import { GlobalEventsManager } from '../../_common/global-event.manager'
import { ActivatedRoute, Data } from '@angular/router';
import { Invoice } from "../../_models/invoice";
import { InvoiceItemisedViewModel } from "../../_models/invoiceitemised";
import { Location } from '@angular/common';
import { GenericService } from '../../_services/generic.service';
import { BENDetailService } from '../../_services/bendetail.service';
import { LocalStorageProvider } from '../../_common/localstorageprovider';

@Component({
  selector: 'invoice-itemised-bill',
  templateUrl: './invoice.itemisedbill.component.html',
  styles: ['label {font-weight:bold}']
})
export class InvoiceItemisedBillComponent implements OnInit {
  private loader: EventEmitter<any>;
  /* Invoice Months */
  invoicemonthArray: SelectItem[];
  invoicedateguid: string;
  mobilenumber: string;
  benguid?: string;
  banguid?: string;



  invoicemodel: Invoice;
  invoiceitemisedmodel: InvoiceItemisedViewModel[]
  sub: any;
  csvfilename: string = "";
  categoryfilterset: any[] = [{ value: null, label: "" }];
  countryoforiginfilterset: any[] = [{ value: null, label: "" }];
  subcalltypefilterset: any[] = [{ value: null, label: "" }];
  //isbenexist: boolean;
  isbillingplatformexist: boolean;
  isbandisplay: boolean;

  reportinggroup1guid?: string
  reportinggroup2guid?: string
  reportinggroup3guid?: string
  reportinggroup4guid?: string
  reportinggroup5guid?: string
  reportinggroup6guid?: string
  dashboardOption: string

  networkguid?: string
  billingpltformguid?: string


  networkdescription: string;
  billingplatformdescription: string;
  bandescription: string;
  bendescription: string;
  reportinggroup1description: string;
  reportinggroup2description: string;
  reportinggroup3description: string;
  reportinggroup4description: string;
  reportinggroup5description: string;
  reportinggroup6description: string;
  r1desc: string;
  r2desc: string;
  r3desc: string;
  r4desc: string;
  r5desc: string;
  r6desc: string;
  categoryFilter: any;
  subcallTypeFilter: any;
  countryFilter: any;

  constructor(
    private authenticationService: AuthenticationService,
    private invoiceDateService: InvoiceDateService,
    private invoiceService: InvoiceService,
    private globalEvent: GlobalEventsManager,
    private route: ActivatedRoute,
    private bendetailService: BENDetailService,
    private genericService: GenericService,
    private location: Location
  ) {
    this.loader = globalEvent.busySpinner;
  }

  ngOnInit() {
    this.loadInvoiceMonths().then(() => {
      this.route.params.subscribe(params => {
        this.invoicedateguid = params["id"];
        this.mobilenumber = params["mn"];
        this.sub = this.route.queryParams.subscribe(params => {
          this.benguid = params['ben'] || "";
          this.banguid = params['ban'] || "";

          // These are the parameter's which will pass from dashboard observations drill down section
          this.reportinggroup1guid = params['r1'] || "";
          this.reportinggroup2guid = params['r2'] || "";
          this.reportinggroup3guid = params['r3'] || "";
          this.reportinggroup4guid = params['r4'] || "";
          this.reportinggroup5guid = params['r5'] || "";
          this.reportinggroup6guid = params['r6'] || "";
          this.dashboardOption = params['op'] || "";

          this.networkguid = params['n'] || "";
          this.billingpltformguid = params['bp'] || "";

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


    var dasbhboardstoragename = JSON.parse(localStorage.getItem(LocalStorageProvider.dasbhboardstoragename));
    if (dasbhboardstoragename) {

      this.networkdescription = dasbhboardstoragename[0].networkdescription;
      this.billingplatformdescription = dasbhboardstoragename[0].billingplatformdescription;
      this.bandescription = dasbhboardstoragename[0].bandescription;
      this.bendescription = dasbhboardstoragename[0].bendescription;
      this.reportinggroup1description = dasbhboardstoragename[0].reportinggroup1description;
      this.reportinggroup2description = dasbhboardstoragename[0].reportinggroup2description;
      this.reportinggroup3description = dasbhboardstoragename[0].reportinggroup3description;
      this.reportinggroup4description = dasbhboardstoragename[0].reportinggroup4description;
      this.reportinggroup5description = dasbhboardstoragename[0].reportinggroup5description;
      this.reportinggroup6description = dasbhboardstoragename[0].reportinggroup6description;
      this.r1desc = dasbhboardstoragename[0].r1desc;
      this.r2desc = dasbhboardstoragename[0].r2desc;
      this.r3desc = dasbhboardstoragename[0].r3desc;
      this.r4desc = dasbhboardstoragename[0].r4desc;
      this.r5desc = dasbhboardstoragename[0].r5desc;
      this.r6desc = dasbhboardstoragename[0].r6desc;
    }


    this.csvfilename = "Invoice-Itemised-Bill" + " " + this.invoicemonthArray.find(x => x.value == this.invoicedateguid).label;
    var p1 = this.loadCTNInvoiceForItemisedSummary();
    var p2 = this.loadInvoiceItemised();
    this.loader.emit(Promise.all([p1, p2]));
  }

  //loading Itemised details selected mobilenumber details
  loadCTNInvoiceForItemisedSummary(): Promise<any> {
    if (this.mobilenumber != "") {
      return this.invoiceService.getInvoiceList('', this.invoicedateguid, this.mobilenumber, null, null, null, this.billingpltformguid, this.benguid, this.banguid, false).then(res => {
        this.invoicemodel = res[0];
        this.IsBANDisplay();
        this.IsBillingPlatformExistForCompanyAsnyc();
      });
    }

  }
  //loading select itemised data to grid
  loadInvoiceItemised(): Promise<any> {

    return this.invoiceService.GetCTNInvoiceItemised(this.invoicedateguid, this.mobilenumber, this.benguid, this.banguid
      , this.reportinggroup1guid
      , this.reportinggroup2guid
      , this.reportinggroup3guid
      , this.reportinggroup4guid
      , this.reportinggroup5guid
      , this.reportinggroup6guid
      , this.dashboardOption
      , this.networkguid
      , this.billingpltformguid

    ).then(res => {
      this.invoiceitemisedmodel = res;
      //Getting  category  list from grid data
      res.filter((obj, index, self) => self.findIndex((t) => { return t.calltype === obj.calltype }) === index).map(q => {
        return { 'value': q.calltype, 'label': q.calltype };
      }).sort(function (a, b) { return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0); }).forEach(q => {
        if (this.categoryfilterset.filter(n => n.value == q.value).length == 0) {
          this.categoryfilterset.push(q);
        }
      });

      //Getting  country of origin  list from grid data
      res.filter((obj, index, self) => self.findIndex((t) => { return t.countryoforigin === obj.countryoforigin }) === index).map(q => {
        return { 'value': q.countryoforigin, 'label': q.countryoforigin };
      })
        .sort(function (a, b) { return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0); })
        .forEach(q => {
          if (this.countryoforiginfilterset.filter(n => n.value == q.value).length == 0) {
            this.countryoforiginfilterset.push(q);
          }
        });


      //Getting  subcalltype  list from grid data
      res.filter((obj, index, self) => self.findIndex((t) => { return t.subcalltype === obj.subcalltype }) === index).map(q => {
        return { 'value': q.subcalltype, 'label': q.subcalltype };
      }).sort(function (a, b) { return (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0); }).forEach(q => {
        if (this.subcalltypefilterset.filter(n => n.value == q.value).length == 0) {
          this.subcalltypefilterset.push(q);
        }
      });
    });
  }

  ////Check for IsBenExistForCompanyAsnyc to Dispaly column in grid
  //IsBenExistForCompanyAsnyc(): Promise<any> {
  //    return this.bendetailService.IsBenExistForCompanyAsnyc().then(res => {
  //        this.isbenexist = res;
  //    });
  //}

  //Check for Billing platform exist for company to Dispaly column in grid
  IsBillingPlatformExistForCompanyAsnyc(): Promise<any> {
    return this.genericService.IsBillingExistForCompanyAsnyc(this.invoicemodel.networkguid).then(res => {
      this.isbillingplatformexist = res;
    });
  }
  IsBANDisplay() {
    this.invoiceService.IsBanDisplay(this.invoicedateguid, this.invoicemodel.networkguid, this.invoicemodel.billingplatformguid).then(res => this.isbandisplay = res);
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
