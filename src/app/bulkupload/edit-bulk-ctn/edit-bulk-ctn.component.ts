import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Message, ConfirmationService } from 'primengdevng8/api';
import { EditBulkCTNValidateViewModel } from 'src/app/_models/bulk-upload/editbulkctnvalidateviewmodel';
import { EditBulkCTNRequiredColumns } from 'src/app/_models/editbulkctnrequiredcolumnsmodel';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { AuthenticationService } from 'src/app/_services/authentication.service';



@Component({
  selector: 'edit-bulk-ctn',
  templateUrl: './edit-bulk-ctn.component.html'
})

export class EditBulkCTNComponent implements OnInit {
  private loader: EventEmitter<any>;
  msgs: Message[] = [];
  files: File[];
  blockedPanel: boolean;
  progress: number = 0;
  processingMessage: string;
  uploadsuccessdisplay: boolean;
  selectedIndex: number = 0;
  model: EditBulkCTNValidateViewModel;
  modelCopy: EditBulkCTNValidateViewModel;
  colitems: EditBulkCTNRequiredColumns[];
  selectAll: boolean;
  checkBoxNotSelected = false;
  csvfilename: string;
  @ViewChild('dt', { static: false }) dtChild: any;
  /**
   * Constructor: used to inject services
   * @param companyService: CompanyService to inject
   * @param networkService: Network service to inject
   * @param authenticationService: AuthenticationService to inject
   * @param uploadInvoiceService: UploadInvoiceService to inject
   * @exportDataService: ExportDataService to inject
   */
  constructor(
    private globalEvent: GlobalEventsManager,
    private ctnDetailService: CTNDetailService,
    private confirmationservice: ConfirmationService,
    private authService: AuthenticationService) {
    this.loader = globalEvent.busySpinner;
  }


  ngOnInit() {

    this.getEditCTNColumnDetails();
    this.model = new EditBulkCTNValidateViewModel();
    this.modelCopy = new EditBulkCTNValidateViewModel();
    this.files = null;
    this.blockedPanel = false;
    this.processingMessage = "";
    this.uploadsuccessdisplay = false;
    this.selectAll = false;
  }

  ngAfterViewChecked() {

  }

  getEditCTNColumnDetails() {
    this.colitems = [];
    this.colitems.push({ columnid: 1, columnname: "MobileNumber", ischecked: true, isrequired: true });
    this.colitems.push({ columnid: 2, columnname: "UserDetails", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 3, columnname: "ReportingGroup1", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 4, columnname: "ReportingGroup2", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 5, columnname: "ReportingGroup3", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 6, columnname: "ReportingGroup4", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 7, columnname: "ReportingGroup5", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 8, columnname: "ReportingGroup6", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 9, columnname: "SIMNUMBER", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 10, columnname: "Tariff", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 11, columnname: "Network", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 12, columnname: "BEN", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 13, columnname: "CTNStatus", ischecked: false, isrequired: false });
    this.colitems.push({ columnid: 14, columnname: "Asset", ischecked: false, isrequired: false });
  }

  filtergetEditCTNColumnDetails() {
    return this.colitems.filter(value => {
      return value.columnid < 13;
    })
  }

  formatSize(bytes: number) {
    if (bytes == 0) {
      return '0 B';
    }
    let k = 1024,
      dm = 3,
      sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  onFileSelect(event: any) {
    this.msgs = [];
    this.files = [];

    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      this.files.push(files[i]);
    }

    this.processingMessage = "";
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  selectAllChange() {
    if (this.selectAll) {
      this.colitems.filter(item => !item.isrequired).forEach(item => item.ischecked = true);
      this.colitems.find(a => a.columnid === 13).ischecked = false;
      this.colitems.find(a => a.columnid === 14).ischecked = false;
    }
    else
      this.colitems.filter(item => !item.isrequired).forEach(item => item.ischecked = false);
  }

  onChangeChk(item: EditBulkCTNRequiredColumns, event: boolean) {
    this.colitems.find(a => a.columnid === 13).ischecked = false;
    this.colitems.find(a => a.columnid === 14).ischecked = false;

    if (item.columnid == 11 && item.ischecked) {
      this.colitems.find(a => a.columnid === 10).ischecked = true;
    }
    else if (item.columnid == 10 && !item.ischecked) {
      if (this.colitems.find(a => a.columnid === 11).ischecked) {
        setTimeout(() => {
          this.colitems.find(a => a.columnid === 10).ischecked = true;
          this.checkedAllChk();
        }, 1000);
      }
    }
    this.checkedAllChk();
  }
  checkedAllChk() {
    let isAllCheck = this.colitems.filter(item => item.columnid != 13 && item.columnid != 14).every(value => {
      return value.ischecked
    });
    this.selectAll = isAllCheck;
  }
  onChangeCTNStatus(item: EditBulkCTNRequiredColumns, event: boolean) {
    if (item.columnid == 13 && event) {
      this.colitems.filter(item => !item.isrequired && item.columnid != 13).forEach(item => item.ischecked = false);
      this.selectAll = false;
    }
  }

  onChangeChkAsset(item: EditBulkCTNRequiredColumns, event: boolean) {
    if (item.columnid == 14 && event) {
      this.colitems.filter(item => !item.isrequired && item.columnid != 14).forEach(item => item.ischecked = false);
      this.selectAll = false;
    }
  }

  validateFiles() {

    let firstFile = this.files[0].name;
    let firstFileExtension = firstFile.substr((~-firstFile.lastIndexOf(".") >>> 0) + 2);
    if ('.' + firstFileExtension === '.xlsx') {
      return true;
    }
    else {
      this.msgs.push({
        severity: 'error',
        summary: 'Invalid file extension',
        detail: 'Please select a .xlsx file'
      });
      return false;
    }

  }

  clear() {
    this.files = [];
    this.msgs = [];
  }

  atleastOneChkSelected(): boolean {
    return this.colitems.filter(item => !item.isrequired).some(item => item.ischecked);
  }

  upload() {
    this.msgs = [];
    this.checkBoxNotSelected = false;
    if (!this.atleastOneChkSelected()) {
      this.checkBoxNotSelected = true;
      return;
    }
    if (!this.validateFiles())
      return;

    let url = this.ctnDetailService.getEditBulkCTNUploadUrl();

    this.blockedPanel = true;

    let xhr = new XMLHttpRequest(),
      formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append(this.files[i].name, this.files[i], this.files[i].name);
    }

    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        this.progress = Math.round((e.loaded * 100) / e.total);
      }
    }, false);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        this.progress = 0;

        if (xhr.status >= 200 && xhr.status < 300) {
          if (xhr.responseText && xhr.responseText.indexOf('BatchID=') !== -1) {
            this.blockedPanel = false;
            this.processingMessage = "Files uploaded! Please wait while we validate your file header and column count!";
            this.blockedPanel = true;
            var parseResponse = JSON.parse(xhr.responseText);

            this.validateHeaderEditBulkCTNFiles(parseResponse.substr(8));

            this.blockedPanel = false;
            this.uploadsuccessdisplay = true;
            this.clear();

          }
        }
      }

    };

    xhr.open('POST', url, true);

    this.processingMessage = "Please wait while we upload your file!";
    let currentUser = this.authService.currentUserValue;;
    // here we are adding token for authorization
    if (currentUser) {
      let token = currentUser.userbasetoken;
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.send(formData);
  }

  onChooseClick(event: any, fileInput: any) {
    fileInput.value = null;
    //fileInput.click();
  }

  remove(index: number) {
    this.msgs = [];
    this.files.splice(index, 1);
  }

  DownloadFile(): void {
    this.ctnDetailService.getEditBulkCTNProtoType().subscribe(response => {
      var fileName = "Edit CTN Template.xlsx";
      if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveBlob(response, fileName);
      }
      else {
        var link = document.createElement('a');
        link.setAttribute("type", "hidden");
        link.download = fileName;
        link.href = window.URL.createObjectURL(response);
        document.body.appendChild(link);
        link.click();
      }
    });
  }

  validateHeaderEditBulkCTNFiles(batchId: string) {

    if (!batchId) {
      this.blockedPanel = false;
      this.processingMessage = 'some error occurred while processing the files!'
      this.clear();
    }
    else {
      this.ctnDetailService.validateHeaderEditBulkCTNFiles(batchId).then(data => {
        this.blockedPanel = false;
        if (data.item1 === false) {
          this.processingMessage = data.item2;
          this.clear();
          return;
        }

        this.blockedPanel = true;
        this.processingMessage = "Files header validate done! Please wait while we insert data in raw table and validate file data!";
        this.insertInRawTable(batchId);
      });

    }
  }

  insertInRawTable(batchId: string) {

    this.ctnDetailService.insertEditCTNInRawTable(batchId, this.colitems).then((data) => {
      this.blockedPanel = false;
      if (data.item1 === false) {
        this.processingMessage = data.item2;
        this.clear();
        return;
      }

      this.blockedPanel = true;
      this.processingMessage = "Files header validate done! Please wait while we insert data in raw table and validate file data!";
      this.validateEditBulkCTNData(batchId);
    });
  }

  validateEditBulkCTNData(batchId: string) {
    this.ctnDetailService.validateEditBulkCTNData(batchId).then((data) => {
      this.blockedPanel = false;
      this.model = data;
      this.clear();
      this.processingMessage = "";
      this.modelCopy = JSON.parse(JSON.stringify(data));
      //this.model.batchid = data.batchid;
      this.onTabChange({ index: this.selectedIndex });
    });
  }

  GetVisibleTabs() {

    let array: string[] = [
      "Invalid Data",
      "Valid Data",
      "All Data"
    ];
    return array;
  }

  onTabChange(e: any) {
    // this gets the active tab name
    if (this.model.batchid) {
      this.selectedIndex = e.index;

      if (e.index == 0) {
        this.csvfilename = "EditBulkCTN-InvalidData";
        this.model.editctnrawviewmodellst = this.modelCopy.editctnrawviewmodellst.filter((val, index) => {
          return val.errormessage != null;
        })
      }

      else if (e.index == 1) {
        this.csvfilename = "EditBulkCTN-ValidData";
        this.model.editctnrawviewmodellst = this.modelCopy.editctnrawviewmodellst.filter((val, index) => {
          return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
        })
      }
      else if (e.index == 2) {
        this.csvfilename = "EditBulkCTN-AllData";
        this.model.editctnrawviewmodellst = this.modelCopy.editctnrawviewmodellst.slice();
      }
    }
  }

  hasValidRecord(): boolean {
    if (this.modelCopy.editctnrawviewmodellst) {
      return (this.modelCopy.editctnrawviewmodellst.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      }).length) > 0;
    }

    return true;
  }

  resetAfterSave() {
    this.dtChild.onFilterKeyup('', 'data', 'contains');
    this.ngOnInit();
  }

  saveValidateCTN() {
    this.loader.emit(this.ctnDetailService.InsertEditBulkCTNDataInCTNDetail(this.model.batchid).subscribe((result: any) => {
      if (result) {
        this.confirmationservice.confirm({
          message: result.message,
          key: 'dialog',
          rejectVisible: false,
          accept: () => {
            if (result.success) {
              this.resetAfterSave();
            }
          }
        });
      }
    }));
  }

}
