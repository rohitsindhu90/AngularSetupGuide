import { Component, EventEmitter, OnInit } from '@angular/core';
import { Column } from 'src/app/_models/primeng-datatable';
import { NetworkService } from 'src/app/_services/network.service';
import { ReportingGroupService } from 'src/app/_services/reporting-group.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';

@Component({
  selector: 'data-history-report',
  templateUrl: './data-history-report.component.html'
})
export class DataHistoryReportComponent implements OnInit {
  private loader: EventEmitter<any>;

  monthColumn: Column[] = [];
  noInvoiceAvailable?: boolean;
  invoicemonthArray: SelectItem[];
  reportinggroupguid: string;
  header: string;
  model: any;
  sum: number = 0;
  monthCount: number = 0;

  fromdate: Date;
  todate: Date;
  csvfilename: string;
  error: string;

  networkArray: SelectItem[] = [];
  networkguid: string;

  billingPlatformArray: SelectItem[];
  billingplatformguid: string;

  benArray: SelectItem[];
  benguid: string;
  banguid: string;

  banArray: SelectItem[];
  ban: string;

  networkfilterset: any[] = [{ value: null, label: "" }];

  benfilterset: any[] = [{ value: null, label: "" }];
  banfilterset: any[] = [{ value: null, label: "" }];

  reportinggroup1guid: string;
  reportinggroup2guid: string;
  reportinggroup3guid: string;
  reportinggroup4guid: string;
  reportinggroup5guid: string;
  reportinggroup6guid: string;

  rgModelArray: ReportingGroupViewModel[];
  datacolumns: Column[] = [];
  canApplyCTNFilter: boolean = true;

  constructor(private networkService: NetworkService,
    private invoiceService: InvoiceService,
    private invoiceReportService: InvoiceReportService,
    private invoiceDateService: InvoiceDateService,
    private reportingGroupService: ReportingGroupService,
    private globalEvent: GlobalEventsManager) {
    this.loader = globalEvent.busySpinner;
  }

  ngOnInit() {
    this.loadReportingGroups();
    this.loadInvoiceMonthsNetworkCC(false);
  }

  loadReportingGroups(): Promise<any> {
    return this.invoiceReportService.getReportingGroupDetails(true).then((res) => {
      this.rgModelArray = res;
      this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
    });
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

  loadInvoiceMonthsNetworkCC(clearValue: boolean = true): Promise<any> {
    this.clearInvoiceMonths();
    return this.invoiceDateService.getInvoiceMonth().then((data) => {
      if (data && data.length) {
        data.forEach(item => this.invoicemonthArray.push({
          label: item.invoicedatedescription,
          value: item.startdate,
        }));

        this.todate = data[0].startdate;

        if (data.length < 11) {
          this.fromdate = data[data.length].startdate;
        }
        else {
          this.fromdate = data[11].startdate;
        }

        this.noInvoiceAvailable = false;
        this.invoicemonthArray.find(x => x.value == this.todate).label;

        this.loadNetworkDropdown(clearValue);
        this.loadBenBanDropdown();
        this.refreshData();

      }
      else {
        this.noInvoiceAvailable = true;
      }
    });

  }

  loadReportingGroupDesc(): Promise<any> {
    return this.reportingGroupService.getReportingGroupDetailByGuid(this.reportinggroupguid).then(data => {
      this.header = data;
    });
  }

  loadNetworkDropdown(clearValue: boolean = true): Promise<any> {
    this.clearNetworks(clearValue);
    this.networkArray.push({ label: 'ALL', value: null });
    return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
      data.forEach(item => this.networkArray.push({
        label: item.networkdescription, value: item.networkguid
      }));
    });
  }

  loadBenBanDropdown() {
    this.loadBenDropDown();
    this.loadBanDropDown();
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

  onChangeNetwork() {
    this.loadBillingPlatformDropDown();
    this.loadBenBanDropdown();
    this.refreshData();
  }

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

  clearBillingPlatform() {
    this.billingPlatformArray = [];
    this.billingplatformguid = null;
  }

  loadBillingPlatforms() {
    return this.networkService.getBillingPlatforms(this.networkguid);
  }

  onReportingGroupChange() {
    let process1 = this.loadReportingGroupDesc();
    this.loader.emit(Promise.all([process1]).then(() => {
      this.refreshData();
    }));
  }

  refreshData() {
    this.loader.emit(this.invoiceReportService.getDataHistoryReportByCTN(this.fromdate, this.todate, this.networkguid,
      this.billingplatformguid, this.benguid, this.ban, this.reportinggroup1guid, this.reportinggroup2guid,
      this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid).subscribe(data => {
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

        this.monthCount = monthRange.length;
        if (this.monthCount <= 2) {
          this.canApplyCTNFilter = false;
        }
        else {
          this.canApplyCTNFilter = true;
        }
        this.monthColumn = [];

        let lastThreeMnthsArr = monthRange.slice(monthRange.length - 3);

        let lastSixMnthsArr = monthRange.slice(monthRange.length - 6);

        let lastTwelveMnthsArr = monthRange.slice(monthRange.length - 12);

        monthRange.forEach(x => {
          this.monthColumn.push({
            field: x,
            header: x + '(MB)',
            hidden: false,
            filter: false,
            sortable: true,
            ddfilter: false,
            ddfilterarray: [],
            dd_selectedarray: [],
            filtermode: "contains"
          });
        });

        this.model.forEach((x: any) => {
          this.sum = 0;
          monthRange.forEach(m => {
            let usagestring = 'NA';
            let monthwisedata = x.monthwisedetails.filter((s: any) => s.formatteddate == m)
            if (monthwisedata.length > 0) {
              usagestring = monthwisedata[0].totaldata ? (monthwisedata[0].totaldata).toFixed(2) : (0).toFixed(2);
            }
            x[m] = usagestring;
          });
        });

        this.model.forEach((x: any) => {
          if (x.monthwisedetails.length >= 12) {
            this.sum = 0;
            lastTwelveMnthsArr.forEach((m: any) => {
              if (x[m] === 'NA') {
                x['12mAVG'] = 'NA';
                return;
              }
              else {
                let monthwisedata = x.monthwisedetails.filter((s: any) => s.formatteddate == m);
                if (monthwisedata.length > 0) {
                  this.sum += monthwisedata[0].totaldata;
                }
              }
              x['12mAVG'] = (this.sum / 12).toFixed(2);
            });
          }
          else {
            x['12mAVG'] = 'NA';
          }
        });

        this.model.forEach((x: any) => {
          if (x.monthwisedetails.length >= 3) {
            this.sum = 0;
            lastThreeMnthsArr.forEach((m: any) => {
              if (x[m] === 'NA') {
                x['3mAVG'] = 'NA';
                return;
              }
              else {
                let monthwisedata = x.monthwisedetails.filter((s: any) => s.formatteddate == m);
                if (monthwisedata.length > 0) {
                  this.sum += monthwisedata[0].totaldata;
                }
              }
              x['3mAVG'] = (this.sum / 3).toFixed(2);
            });
          }
          else {
            x['3mAVG'] = 'NA';
          }
        });

        this.model.forEach((x: any) => {
          if (x.monthwisedetails.length >= 6) {
            this.sum = 0;
            lastSixMnthsArr.forEach((m: any) => {
              if (x[m] === 'NA') {
                x['6mAVG'] = 'NA';
                return;
              }
              else {
                let monthwisedata = x.monthwisedetails.filter((s: any) => s.formatteddate == m);
                if (monthwisedata.length > 0) {
                  this.sum += monthwisedata[0].totaldata;
                }
              }
              x['6mAVG'] = (this.sum / 6).toFixed(2);
            });
          }
          else {
            x['6mAVG'] = 'NA';
          }
        });
      }));
  }

  monthDiff(fromDate, toDate): number {
    let months = 0;
    months = (toDate.getFullYear() - fromDate.getFullYear()) * 12;
    months -= fromDate.getMonth() + 1;
    months += toDate.getMonth() + 2;
    return months <= 0 ? 0 : months;
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
      this.csvfilename = "DataHistoryReportByCTN" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
    }
  }

  clearGridFilter() {
    this.networkfilterset = [{ value: null, label: "" }];
    this.benfilterset = [{ value: null, label: "" }];
    this.banfilterset = [{ value: null, label: "" }];
  }

  getBenDetails() {
    return this.invoiceService.getBenList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
  }

  getBanDetails() {
    return this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
  }

  clearBens() {
    this.benArray = [];
    this.benguid = null;

  }

  clearBans() {
    this.banArray = [];
    this.ban = null;
  }

  clearNetworks(clearValue: boolean) {
    this.networkArray = [];
    if (clearValue) {
      this.networkguid = null;
    }
  }

  clearInvoiceMonths() {
    this.invoicemonthArray = [];
  }
}
