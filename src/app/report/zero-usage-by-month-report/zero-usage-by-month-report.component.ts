import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ViewContainerRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Column } from 'src/app/_models/primeng-datatable';
import { SelectItem } from 'primengdevng8/api';
import { ZeroUsageViewModel } from 'src/app/_models/report/zerousage.model';
import { NetworkService } from 'src/app/_services/network.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { GenericService } from 'src/app/_services/generic.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { UtilityMethod } from 'src/app/_common/utility-method';


@Component({
  selector: 'zero-usage-by-month-report',
  templateUrl: './zero-usage-by-month-report.component.html'
})
export class ZeroUsageByMonthReportComponent implements OnInit {
  private loader: EventEmitter<any>;
  isInvoiceActive: boolean = false;
  datacolumns: Column[] = [];
  monthColumn: Column[] = [];
  /* Invoice Months */
  invoicemonthArray: SelectItem[];
  invoicemonthdetailArray: SelectItem[] = [];

  fromdate: Date;
  todate: Date;
  csvfilename: string;
  error: string;

  /* Networks */
  networkArray: SelectItem[];
  networkguid: string;

  /* Billing Platforms */
  billingPlatformArray: SelectItem[];
  billingplatformguid: string;


  /* Ben List */
  benArray: SelectItem[];
  benguid: string;;

  banArray: SelectItem[];
  ban: string;

  networkfilterset: any[] = [{ value: null, label: "" }];

  benfilterset: any[] = [{ value: null, label: "" }];
  banfilterset: any[] = [{ value: null, label: "" }];
  //isbenexist: boolean;
  //isbanexist: boolean;

  reportinggroup1guid: string;
  reportinggroup2guid: string;
  reportinggroup3guid: string;
  reportinggroup4guid: string;
  reportinggroup5guid: string;
  reportinggroup6guid: string;
  noInvoiceAvailable?: boolean;
  model: ZeroUsageViewModel[];

  qFilter: any;
  billingFilter: any;
  benFilter: any;
  qBanFilter: any;
  billingplatformfilterset: any;
  /**
   * Constructor: used to inject services
   * @param networkService: Network service to inject
   * @param authenticationService: AuthenticationService to inject
   * @param : UploadInvoiceService to inject
   */
  constructor(private networkService: NetworkService,
    private authenticationService: AuthenticationService,
    private invoiceReportService: InvoiceReportService,
    private invoiceDateService: InvoiceDateService,
    private invoiceService: InvoiceService,
    private genericService: GenericService,
    private globalEvent: GlobalEventsManager,
    private bendetailservice: BENDetailService,
    private route: ActivatedRoute,
    private router: Router,
    private featureservice: FeatureService,

  ) {
    this.loader = globalEvent.busySpinner;
  }


  ngOnInit() {
    //this.IsBENExist();
    this.loadReportingGroups();
    this.loadInvoiceMonthsNetworkCC(false);

  }
  //Check for BAN exist for company to Dispaly column in grid
  //IsBANDisplay(): Promise<any> {
  //    return this.invoiceService.IsBanDisplay(null, this.networkguid, UtilityMethod.IfNull(this.billingplatformguid, ''), this.fromdate, this.todate).then(res => this.isbanexist = res);
  //}

  loadInvoiceMonthsNetworkCC(clearValue: boolean = true): Promise<any> {
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



        this.todate = data[0].startdate;

        if (data.length == 1) {
          this.fromdate = data[0].startdate;
        }
        else if (data.length == 2) {
          this.fromdate = data[1].startdate;
        }
        else if (data.length >= 3) {
          this.fromdate = data[2].startdate;
        }



        this.noInvoiceAvailable = false;
        this.csvfilename = "ZeroUsageByMonthReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;

        this.loadNetworkDropdown(clearValue);
        this.loadBenBanDropdown();
        //this.IsBANDisplay();
        this.refreshData();

      }
      else {
        this.noInvoiceAvailable = true;
      }
    });

  }



  clearGridFilter() {
    this.networkfilterset = [{ value: null, label: "" }];
    this.benfilterset = [{ value: null, label: "" }];
    this.banfilterset = [{ value: null, label: "" }];
  }



  loadReportingGroups(): Promise<any> {
    return this.invoiceReportService.getReportingGroupDetails(true).then(res => {
      this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
    });
  }

  refreshData() {
    this.loader.emit(this.invoiceReportService.GetZeroUsageReportByMonth(this.fromdate, this.todate, this.networkguid, this.billingplatformguid, this.benguid, this.ban).then((data) => {
      this.clearGridFilter();
      this.model = data;

      let endDate = new Date(this.todate);
      endDate.setDate(1);
      let startDate = new Date(this.fromdate);
      startDate.setMonth(startDate.getMonth());
      startDate.setDate(1);
      let monthDiff = this.monthDiff(startDate, endDate);
      let monthArray = [];
      for (let i = 0; i < monthDiff; i++) {
        let local = new Date();
        local.setDate(1);
        local.setFullYear(startDate.getFullYear());
        local.setMonth(startDate.getMonth() + i);
        monthArray.push(local);
      }
      let monthRange = monthArray.map(x => UtilityMethod.getShortMonthYearFormatter(x));
      this.monthColumn = [];

      monthRange.forEach(x => {
        this.monthColumn.push({
          field: x,
          header: x,
          hidden: false,
          filter: false,
          sortable: true,
          ddfilter: false,
          ddfilterarray: [],
          dd_selectedarray: [],
          filtermode: "contains"
        });
      });
      this.model.forEach(x => {
        monthRange.forEach(m => {
          let usagestring: string = "NA";
          let monthwisedata = x.monthwisedetails.filter(s => s.month == m);
          if (monthwisedata.length > 0) {
            usagestring = monthwisedata[0].nousagestring;
          }
          x[m] = usagestring;
        })
      });

      this.refreshGridFilter(data);
    }));

  }

  monthDiff(fromDate, toDate): number {
    let months = 0;
    months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months -= fromDate.getMonth() + 1;
    months += toDate.getMonth() + 2;
    return months <= 0 ? 0 : months;
  }


  //IsBENExist() {
  //    this.bendetailservice.IsBenExistForCompanyAsnyc().then(data => {
  //        this.isbenexist = data;
  //    });
  //}

  /**
 * Load the billing platforms for the given company and selected network
 */
  getBenDetails() {
    return this.invoiceService.getBenList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
  }

  getBanDetails() {
    return this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
  }

  /**
 * Clears the ben dropdown and selecttion
 */
  clearBens() {
    this.benArray = [];
    this.benguid = null;

  }

  /**
* Clears the ben dropdown and selecttion
*/
  clearBans() {
    this.banArray = [];
    this.ban = null;
  }


  loadBenDropDown() {
    this.clearBens();
    this.getBenDetails().then((data) => {
      if (data && data.length > 0) {
        this.benArray.push({ label: 'ALL', value: null });
        data.forEach(item => this.benArray.push({
          label: item.bendescription, value: item.benguid
        }));
      }

    });

  }

  loadBanDropDown() {
    this.clearBans();
    this.getBanDetails().then((data) => {
      if (data && data.length > 0) {

        this.banArray.push({ label: 'ALL', value: null });
        data.forEach(item => this.banArray.push({
          label: item.description, value: item.banguid
        }));
      }

    });

  }

  loadBenBanDropdown() {
    this.loadBenDropDown();
    this.loadBanDropDown();
  }


  /**
   * Populates the network dropdown
   */
  loadNetworkDropdown(clearValue: boolean = true): Promise<any> {
    this.clearNetworks(clearValue);
    this.networkArray.push({ label: 'ALL', value: null });
    return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
      data.forEach(item => this.networkArray.push({
        label: item.networkdescription, value: item.networkguid
      }));
    });
  }



  onChangeNetwork() {
    var p1 = this.loadBillingPlatformDropDown();
    var p2 = this.loadBenBanDropdown();
    var p3 = this.refreshData();

  }


  /**
   * Load the billing platforms for the selected network
   */
  loadBillingPlatforms() {
    return this.networkService.getBillingPlatforms(this.networkguid);
  }



  /**
   * If billing platforms exists for given network, load them, else load the months
   */
  loadBillingPlatformDropDown() {

    this.clearBillingPlatform();

    this.loadBillingPlatforms().then((data) => {
      if (data) {
        this.billingPlatformArray.push({ label: 'ALL', value: null });
        data.forEach(item => this.billingPlatformArray.push({
          label: item.billingplatformdescription, value: item.billingplatformguid
        }));

      }
    });

  }

  onChangeBillingPlatForm() {
    this.loadBenBanDropdown();
    this.refreshData();
  }


  /**
   * Clears the invoice months and selection
   */
  clearInvoiceMonths() {
    this.invoicemonthArray = [];
  }

  /**
   * Clears the networks dropdown and selecttion
   */
  clearNetworks(clearValue: boolean) {
    this.networkArray = [];
    if (clearValue) {
      this.networkguid = null;
    }
  }

  /**
   * Clears the billing platform and selection
   */
  clearBillingPlatform() {
    this.billingPlatformArray = [];
    this.billingplatformguid = null;
  }
  onChangeReportingGroupEvent(reportinggroupsguidids: any) {

    if (reportinggroupsguidids != null) {
      this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
      this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
      this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
      this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
      this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
      this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

      this.refreshData();
    }
  }

  refreshGridFilter(data: ZeroUsageViewModel[]) {
    this.clearGridFilter();

    //Getting network list from grid data
    data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
      return { 'value': q.networkdescription, 'label': q.networkdescription };
    }).forEach(q => {
      if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
        this.networkfilterset.push(q);
      }
    });

    if (this.benArray && this.benArray.length > 1) {
      //Getting  ben  list from grid data
      data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
        return { 'value': q.bendescription, 'label': q.bendescription };
      })
        //.sort((a, b) => {
        //return a.value - b.value;
        //})
        .forEach(q => {
          if (q.value) {
            this.benfilterset.push(q);
          }
        });
    }

    //Getting  ban  list from grid data
    if (this.banArray && this.banArray.length > 1) {
      //Getting  ben  list from grid data
      data.filter((obj, index, self) => self.findIndex((t) => { return t.bandescription === obj.bandescription }) === index).map(q => {
        return { 'value': q.bandescription, 'label': q.bandescription };
      }).sort((a, b) => {
        return parseInt(a.value) - parseInt(b.value);
      }).forEach(q => {
        if (q.value) {
          this.banfilterset.push(q);
        }
      });
    }

  }



  onInvoiceMonthChange() {
    this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
    if (this.error) {
      this.model = [];
    }
    else {
      this.loadNetworkDropdown();
      this.loadBenBanDropdown();
      this.refreshData();
      this.csvfilename = "ZeroUsageReportByMonth" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
    }
  }
}
