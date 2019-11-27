import { Component, EventEmitter, OnInit } from '@angular/core';
//import { ConfirmationService, Message, SelectItem } from 'primeng-dev-ng4/primeng';
import { ConfirmationService, Message, SelectItem } from 'primengdevng8/api';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { CompanyService } from '../_services/company.service'
import { NewCompanySetUpViewModel, NewClientValidateViewModel } from '../_models/Admin/newcompanysetupviewmodel';
import { RegexExpression } from '../_common/regex-expression';
//import { LocalStorageProvider } from '../_common/localstorageprovider';
import { ResponseModel } from '../_models/response';
import { NgForm } from '@angular/forms';
import { NewClientValidationDataType } from '../_services/enumtype';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-newcompany-setup',
  templateUrl: './newcompany-setup.component.html',
  styles: ['.no-border { border: 0;}',
    '#file-container-panel > div div.ui-panel-content {padding: 0;}',
    '#file-container-panel > div > div.ui-panel-titlebar {padding: 0;border: 0;}',
    '.no-padding{padding-left:0px;padding-right:0px;}',
    `
.input-group-append {
    margin-left: -1px;
}

.input-group-text {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    padding: .375rem .75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #ced4da;
    border-radius: .25rem;
}

.input-group>.input-group-append>.btn, .input-group>.input-group-append>.input-group-text, .input-group>.input-group-prepend:first-child>.btn:not(:first-child), .input-group>.input-group-prepend:first-child>.input-group-text:not(:first-child), .input-group>.input-group-prepend:not(:first-child)>.btn, .input-group>.input-group-prepend:not(:first-child)>.input-group-text {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
            `]
})
/** new company-setup component*/
export class NewCompanySetupComponent implements OnInit {

  private loader: EventEmitter<any>;
  model: NewCompanySetUpViewModel = new NewCompanySetUpViewModel();
  uploadedFiles: any[] = [];
  multipleEmailAddressregx: RegExp = RegexExpression.multipleEmailAddress;
  files: File[];
  multiple: boolean = true;
  msgs: Message[] = [];
  expectFileCount: number;
  imageExtension: string[];
  blockedPanel: boolean;
  processingMessage: string;
  validateModel: NewClientValidateViewModel;
  validateModelCopy: NewClientValidateViewModel;
  tabIndex: number;
  validateDDID: number;
  dnsNameRegx: RegExp = RegexExpression.dnsName;
  constructor(private companyService: CompanyService,
    private globalEventsManager: GlobalEventsManager,
    private confirmationservice: ConfirmationService,
    private authService: AuthenticationService) {
    this.loader = globalEventsManager.busySpinner;
  }

  ngOnInit() {
    this.model = new NewCompanySetUpViewModel();
    this.validateModel = new NewClientValidateViewModel();
    this.validateModelCopy = new NewClientValidateViewModel();

    //this.model.name = "Arup1";
    //this.model.dns = "Arup1";
    //this.model.ip = "10.10.0.115";
    //this.model.emailto = "a@a.com";
    //this.model.emailcc = "a@a.com";

    this.model.ip = this.companyService.getNewCompanySetupIPAddress();
    this.files = [];
    this.processingMessage = "";
    this.blockedPanel = false;
    this.expectFileCount = 2;
    this.imageExtension = [];
    this.imageExtension.push(".gif", ".png", ".jpg", ".jpeg");
    this.tabIndex = 0;
  }


  onFileSelect(event: any) {
    this.files = [];
    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.files.push(files[i]);
    }
    this.validate();
  }

  onChooseClick(event: any, fileInput: any) {
    fileInput.value = null;
    //fileInput.click();
  }

  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  remove(index: number) {
    this.msgs = [];
    this.files.splice(index, 1);
  }
  clear() {
    this.files = [];
    this.msgs = [];
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

  validate() {
    this.msgs = [];

    //var fileCount = this.files.length;
    if (!this.files || this.files.length !== this.expectFileCount) {
      this.msgs.push({
        detail: 'Please make sure you select ' + this.expectFileCount + ' files',
        severity: 'error',
        summary: 'invalid file count'
      })
      return false;
    }

    // check the fileNames
    var fileNamesValid = this.checkFileNames();
    return fileNamesValid;

  }

  checkFileNames() {
    let filevalid = true;
    let excelExtension = ".xlsx";
    //====Check Excel is select or not=======
    let fileExtensions = this.files.map(item => item.name.toLowerCase().substr(item.name.lastIndexOf('.')));

    let isExcelFile = fileExtensions.some(item => excelExtension.indexOf(item) >= 0);
    if (!isExcelFile) {

      this.msgs.push({
        severity: 'error',
        summary: 'Invalid file extension',
        detail: 'Please select a ' + excelExtension + ' file'
      });
      filevalid = false;
      return filevalid
    }

    let isImageFile = fileExtensions.some(item => this.imageExtension.indexOf(item) >= 0);
    if (!isImageFile) {

      this.msgs.push({
        severity: 'error',
        summary: 'Invalid file extension',
        detail: 'Please select a image file'
      });
      filevalid = false;
      return filevalid
    }

    return filevalid;
  }

  save(f: NgForm) {
    //f.form.disable();// = true;
    if (this.validate()) {
      this.loader.emit(this.uploadFile());
    }
  }

  uploadFile() {
    this.enableDisableForm(true);
    let url = this.companyService.getNewCompanyFileUploadUrl();
    let xhr = new XMLHttpRequest(),
      formData = new FormData();

    for (let i = 0; i < this.files.length; i++) {
      formData.append(this.files[i].name, this.files[i], this.files[i].name);
    }

    xhr.upload.addEventListener('progress', (e: ProgressEvent) => {
      if (e.lengthComputable) {
        //this.progress = Math.round((e.loaded * 100) / e.total);
      }
    }, false);

    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          //==Test Comment
          //this.onUpload.emit({ xhr: xhr, files: this.files });
          if (xhr.responseText && xhr.responseText.indexOf('BatchID=') !== -1) {
            var parseResponse = JSON.parse(xhr.responseText);
            this.newCompanySetUp(parseResponse.substr(8));
          }
          else {
            this.enableDisableForm(false);
          }
        }
      }
    };

    xhr.open('POST', url, true);

    //this.processingMessage = "Please wait while we upload your file!";
    let currentUser = this.authService.currentUserValue;
    //LocalStorageProvider.getUserStorage();
    // here we are adding token for authorization
    if (currentUser) {
      let token = currentUser.userbasetoken;
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.send(formData);
  }

  newCompanySetUp(batchId: string) {
    this.model.batchid = batchId;
    this.companyService.newCompanySetUp(this.model).then((data: ResponseModel) => {
      if (data && data.success) {
        this.validateModel = data.object;
        this.validateModelCopy = JSON.parse(JSON.stringify(this.validateModel));
        this.validateDDID = NewClientValidationDataType.Invalid;
        this.onDropDownChange();
      }
      else {
        this.enableDisableForm(false);
        this.confirmationservice.confirm({
          message: data.message,
          key: 'dialog',
          rejectVisible: false,

        });
      }
      this.enableDisableForm(false);
    });
  }

  enableDisableForm(isDisable: boolean) {
    if (isDisable) {
      this.blockedPanel = true;
      this.processingMessage = "Files uploading! Please wait while we validate your file header and data !";
    }
    else {
      this.blockedPanel = false;
      this.processingMessage = "";
    }
  }

  getVisibleTabs() {

    let array: string[] = [
      "Main Data",
      "Address",
      "Tariff",
      "Product"
    ];
    return array;
  }

  getValidateDataDropDown() {
    let array: SelectItem[];
    array = [];
    array.push({ label: "Invalid", value: 0 });
    array.push({ label: "Valid", value: 1 });
    array.push({ label: "All", value: 2 });

    return array;
  }

  hasValidRecord(): boolean {
    //if (this.validateModel.lstmaindataimportviewmodel) {
    //    return (this.validateModel.lstmaindataimportviewmodel.filter((val, index) => {
    //        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
    //    }).length) > 0;
    //}

    let isErrorMessage = function (element: any) {
      return element.errormessage;
    }

    let mainDataSheetValid = this.validateModelCopy.lstmaindataimportviewmodel ?
      this.validateModelCopy.lstmaindataimportviewmodel.some(isErrorMessage) : false;
    let addressSheetValid = this.validateModelCopy.lstaddressimportviewmodel ? this.validateModelCopy.lstaddressimportviewmodel.some(isErrorMessage) : false;
    let tariffSheetValid = this.validateModelCopy.lsttariffimportviewmodel ? this.validateModelCopy.lsttariffimportviewmodel.some(isErrorMessage) : false;
    let productSheetValid = this.validateModelCopy.lstproductimportviewmodel ? this.validateModelCopy.lstproductimportviewmodel.some(isErrorMessage) : false;

    if (!mainDataSheetValid && !addressSheetValid && !tariffSheetValid && !productSheetValid) {
      return true;
    }
    return false;
  }

  resetAfterSave() {
    //this.fileinput.nativeElement.value = "";
    this.ngOnInit();
  }

  onTabChange(e: any) {
    // this gets the active tab name
    if (this.model.batchid) {
      this.tabIndex = e.index;
    }
  }

  onDropDownChange() {
    if (this.validateDDID === NewClientValidationDataType.Invalid) {
      this.validateModel.lstmaindataimportviewmodel = this.validateModelCopy.lstmaindataimportviewmodel.filter((val, index) => {
        return val.errormessage != null;
      });
      this.validateModel.lstaddressimportviewmodel = this.validateModelCopy.lstaddressimportviewmodel.filter((val, index) => {
        return val.errormessage != null;
      });
      this.validateModel.lsttariffimportviewmodel = this.validateModelCopy.lsttariffimportviewmodel.filter((val, index) => {
        return val.errormessage != null;
      })
      this.validateModel.lstproductimportviewmodel = this.validateModelCopy.lstproductimportviewmodel.filter((val, index) => {
        return val.errormessage != null;
      })
    }

    else if (this.validateDDID === NewClientValidationDataType.Valid) {
      this.validateModel.lstmaindataimportviewmodel = this.validateModelCopy.lstmaindataimportviewmodel.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      });
      this.validateModel.lstaddressimportviewmodel = this.validateModelCopy.lstaddressimportviewmodel.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      });
      this.validateModel.lsttariffimportviewmodel = this.validateModelCopy.lsttariffimportviewmodel.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      })
      this.validateModel.lstproductimportviewmodel = this.validateModelCopy.lstproductimportviewmodel.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      })

    }
    else if (this.validateDDID === NewClientValidationDataType.All) {
      this.validateModel.lstmaindataimportviewmodel = this.validateModelCopy.lstmaindataimportviewmodel.slice();
      this.validateModel.lstaddressimportviewmodel = this.validateModelCopy.lstaddressimportviewmodel.slice();
      this.validateModel.lsttariffimportviewmodel = this.validateModelCopy.lsttariffimportviewmodel.slice();
      this.validateModel.lstproductimportviewmodel = this.validateModelCopy.lstproductimportviewmodel.slice();

    }
  }

  processValidateData() {
    this.loader.emit(this.companyService.processValidateData(this.validateModelCopy).then((data: ResponseModel) => {

      if (data && data.success) {
        //alert(data.message);
        this.confirmationservice.confirm({
          message: data.message,
          key: 'dialog',
          rejectVisible: false,
          accept: () => { this.ngOnInit() }
        });
      }
      else {
        this.confirmationservice.confirm({
          message: data.message,
          key: 'dialog',
          rejectVisible: false,
        });
      }

    }));
  }

  downloadTemplateFile(): void {
    this.companyService.getNewCompanySetupProtoType().subscribe(response => {
      var fileName = "NewCompany-Setup-Template.xlsx";
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

  getValidationExcel(): void {
    this.companyService.getValidationExcel(this.validateModelCopy.newcompanysetupmodel.batchid, this.validateDDID)
      .subscribe(response => {
        let tabValue = this.validateDDID == NewClientValidationDataType.Invalid ? "Invalid" : (this.validateDDID == NewClientValidationDataType.Valid ? "Valid" : "All");
        //fileNameFull = string.Format("NewCompany-{0}-Data-{1}", fileName, Date.UtcNow.ToString("dd-MM-yyyy") + "-" + Date.UtcNow.ToString("hh-mm-ss-fff") + ".xlsx");
        var fileName = `NewCompany-${tabValue}Data.xlsx`;
        var link = document.createElement('a');
        link.setAttribute("type", "hidden");
        link.download = fileName;
        link.href = window.URL.createObjectURL(response);
        document.body.appendChild(link);
        link.click();
      });
  }
}
