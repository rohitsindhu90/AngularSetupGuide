import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { CTNDetailService } from '../_services/ctndetail.service';
import { CareService } from '../_services/care.service';
import { InvoiceReportService } from '../_services/invoice-report.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { CareViewModel, NetworkFaultDetailViewModel } from '../_models/care/care';
import { RegexExpression } from '../_common/regex-expression';
import { CareMobileFilterViewModel } from "../_models/mobile-filter";
import { CareIssueTypeEnum } from '../_common/enumtype';
import { AutoCompleteHeaderColumnMeta, SelectItem, ConfirmationService } from 'primengdevng8/api';
import { ReportingGroupType } from '../_services/enumtype';

@Component({

  templateUrl: './care.component.html',
  styles: ['.controlWidth {width :160px !important}',
    'label.required::after {  content: "*"; color: red; padding :0em !important; padding-left: 1em;}',
    'textarea {min-width: 613px;}',
    '.zeroPaddngleft { padding-left: 0px !important;}',


  ]
})
export class CareComponent implements OnInit {
  @ViewChild('autoCompleteRef', { static: false }) autoCompleteRef;
  private loader: EventEmitter<any>;
  msg: string;
  showFields: boolean;
  displayLabel: boolean = true;
  model: CareViewModel;
  careIssueTypeEnum: any = CareIssueTypeEnum;
  onlyNumberregx: RegExp = RegexExpression.onlyNumber;
  //timeFormatregx: RegExp = RegexExpression.timeFormat;
  mobilenumberheadermeta: AutoCompleteHeaderColumnMeta[] = [
    { field: "mobilenumber", header: 'Mobile Number' },
    { field: 'staffname', header: 'Employee Name' },
    { field: 'productdescription', header: 'Device' },
    { field: 'imeinumber', header: 'IMEI' }
  ];

  filteredMobile: CareMobileFilterViewModel[];
  issueTypeArray: SelectItem[];
  reportTypeArray: SelectItem[];
  faultReasonArray: SelectItem[];

  reportinggroup1DisplayName: string;
  reportinggroup1Active: boolean;

  reportinggroup2DisplayName: string;
  reportinggroup2Active: boolean;

  reportinggroup3DisplayName: string;
  reportinggroup3Active: boolean;

  reportinggroup4DisplayName: string;
  reportinggroup4Active: boolean;

  reportinggroup5DisplayName: string;
  reportinggroup5Active: boolean;

  reportinggroup6DisplayName: string;
  reportinggroup6Active: boolean;

  constructor(
    private invoicereportservice: InvoiceReportService,
    private careService: CareService,
    private ctnDetailService: CTNDetailService,
    private globalEvent: GlobalEventsManager,
    private confirmationservice: ConfirmationService,
    private router: Router) {
    this.loader = globalEvent.busySpinner;
  }


  ngOnInit() {
    this.msg = "";
    this.resetModel(true);
    this.showFields = false;
  }

  ngAfterViewChecked() {
  }
  resetModel(isModelReset: boolean) {
    if (isModelReset) {
      this.model = new CareViewModel();
    }

    this.model.networkfaultdetaillist = [];
    this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
    this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
    this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
  }

  filterMobile(event: any) {
    return this.ctnDetailService.getMobileForCareFilter(event.query).then(data => {
      this.filteredMobile = data;
    });
  }

  handleSelectClick(event: any) {
    this.clearErrrMessage();
    if (event.ctndetailsguid != undefined) {
      let ctndetailsguid = event.ctndetailsguid;
      let process1 = this.loadCTNDetails(ctndetailsguid);
      let process2 = this.loadIssueTypeDropDown();
      let process3 = this.loadReportingGroupList();
      this.loader.emit(Promise.all([process1, process2, process3]));
    }
    else {
      this.resetModel(true);
    }
  }

  loadCTNDetails(ctnGuid: string): Promise<any> {

    return this.ctnDetailService.getCTNDetailByGuidForCareEnquiryAsync(ctnGuid).then((data) => {
      if (data != null) {
        this.model = data;
        this.showFields = true;
        this.resetModel(false);
        //  this.model.networkfaultdetaillist = [];
        //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
        //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
        //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
      }
    });
  }

  onClearMobile(event: any) {
    this.model = new CareViewModel();
    this.showFields = false;
  }

  loadReportingGroupList(): Promise<any> {

    return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

      var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
      if (reportinggroup1 != null) {
        this.reportinggroup1Active = reportinggroup1.active;
        this.reportinggroup1DisplayName = reportinggroup1.displayname;
      }
      var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
      if (reportinggroup2 != null) {
        this.reportinggroup2Active = reportinggroup2.active;
        this.reportinggroup2DisplayName = reportinggroup2.displayname;
      }

      var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
      if (reportinggroup3 != null) {
        this.reportinggroup3Active = reportinggroup3.active;
        this.reportinggroup3DisplayName = reportinggroup3.displayname;
      }

      var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
      if (reportinggroup4 != null) {
        this.reportinggroup4Active = reportinggroup4.active;
        this.reportinggroup4DisplayName = reportinggroup4.displayname;
      }

      var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
      if (reportinggroup5 != null) {
        this.reportinggroup5Active = reportinggroup5.active;
        this.reportinggroup5DisplayName = reportinggroup5.displayname;
      }

      var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
      if (reportinggroup6 != null) {
        this.reportinggroup6Active = reportinggroup6.active;
        this.reportinggroup6DisplayName = reportinggroup6.displayname;
      }

    });

  }

  loadIssueTypeDropDown() {
    this.clearIssueType();

    return this.careService.getIssueTypeList().then((data) => {
      if (data != null) {
        this.issueTypeArray.push({ label: '--Select--', value: null });
        data.forEach(item => this.issueTypeArray.push({
          label: item.issuetypedescription, value: item.issuetypeid
        }));
      }
    });

  }

  clearIssueType() {
    this.issueTypeArray = [];
    this.model.issuetypeid = null;
    this.model.reporttypeid = null;
    this.model.reportreasonid = null;
  }

  onChangeIssuetypeid(event: any) {
    if (event.value) {
      this.loader.emit(this.loadReportTypeDropDown(event.value).then((data) => {
        if (event.value != CareIssueTypeEnum.Device) {
          this.model.reporttypeid = this.reportTypeArray[1].value;
          this.loadFaultReasonDropDown(this.model.reporttypeid);
        }
        if (event.value == CareIssueTypeEnum.Network) { }
        else {
          this.resetModel(false);
          // this.model.networkfaultdetaillist = [];
          //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
          //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
          //this.model.networkfaultdetaillist.push(new NetworkFaultDetailViewModel());
        }
      }));
    }
  }

  loadReportTypeDropDown(issuetypeid: number) {
    this.clearReportType();

    return this.careService.getReportTypeByIssueTypeID(issuetypeid).then((data) => {
      if (data != null) {
        this.reportTypeArray.push({ label: '--Select--', value: null });
        data.forEach(item => this.reportTypeArray.push({
          label: item.reporttypedescription, value: item.reporttypeid
        }));
      }
    });

  }

  clearReportType() {
    this.reportTypeArray = [];
    this.model.reporttypeid = null;
    this.model.reportreasonid = null;
  }


  onChangeReporttypeid(event: any) {
    this.loader.emit(this.loadFaultReasonDropDown(event.value));
  }

  loadFaultReasonDropDown(reportreasonid: number) {
    this.clearFaultReason();

    return this.careService.getFaultReasonByReportTypeID(reportreasonid).then((data) => {
      if (data != null) {
        this.faultReasonArray.push({ label: '--Select--', value: null });
        data.forEach(item => this.faultReasonArray.push({
          label: item.faultdescription, value: item.faultreasonid
        }));
      }
    });

  }

  clearFaultReason() {
    this.faultReasonArray = [];
    this.model.reportreasonid = null;
  }
  clearErrrMessage() {
    this.msg = "";
  }
  save(form: NgForm) {

    let isFormValid = false;
    this.clearErrrMessage();
    if (this.model.mobilenumber == null || this.model.mobilenumber == undefined) {

      return;
    }
    if (this.model.issuetypeid == CareIssueTypeEnum.Network) {
      isFormValid = this.model.networkfaultdetaillist.some((item: any) => {
        return item.faultdate && item.faulttime && item.mobilenumber;
      });

      this.model.networkfaultdetaillist.forEach((item: any, index: number, arr: NetworkFaultDetailViewModel[]) => {

        if (item.faultdate && item.faulttime && item.mobilenumber) {
          //  arr[index].mobilenumber = item.faultdate.toUTCString();
          // arr[index].faulttime = item.faulttime.toUTCString();

          // let dt = new Date(item.faultdate.getFullYear(), item.faultdate.getMonth() + 1, item.faultdate.getDate(), item.faulttime.getHours(),
          //   item.faulttime.getMinutes());
          //arr[index].mobilenumber = dt.toString();
          //arr[index].faultdatetimestring = dt.toUTCString();

          // arr[index].faultdate = dt;
          let day = item.faultdate.getDate().toString();
          let month = (item.faultdate.getMonth() + 1).toString();

          day = day.length == 1 ? "0" + day : day;
          month = month.length == 1 ? "0" + month : month;

          let dt = day + "/" + month + "/" + item.faultdate.getFullYear() + " " + item.faulttime.getHours() + ':' +
            item.faulttime.getMinutes() + ':00';
          arr[index].faultdatetimestring = dt;
        }
      });

      //this.model.networkfaultdetaillist[0].mobilenumber = this.model.networkfaultdetaillist[0].faultdate.toString();
    }
    else {
      isFormValid = true;
    }

    // let a = Globalize.dateParser(this.model.networkfaultdetaillist[0].faultdate.toString());
    // let a1 = Globalize.dateParser(this.model.networkfaultdetaillist[0].faulttime.toString());
    if (!isFormValid) {
      this.msg = " At least One example is required.";
    }
    else {
      this.loader.emit(this.careService.saveCareEnqiury(this.model).subscribe((result: any) => {
        if (result) {
          this.confirmationservice.confirm({
            message: result.message,
            key: 'dialog',
            rejectVisible: false,
            accept: () => {
              if (result.success) {
                this.ngOnInit();
                form.resetForm();
                this.autoCompleteRef.inputEL.nativeElement.value = '';
              }
            }
          });
        }

      }));

    }

  }

  onBlurTime(event: any) {

    let res = RegexExpression.timeFormat.test(event.target.value);
    if (!res) {
      event.target.value = "";
    }

  }
  onBlurDate(event: any) {

    let res = RegexExpression.dateRegex.test(event.target.value);
    if (!res) {
      event.target.value = "";
    }

  }

}
