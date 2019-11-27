import { Component, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Message, ConfirmationService } from 'primengdevng8/api';
import { AddBulkAssetValidateViewModel } from 'src/app/_models/bulk-upload/addbulkassetvalidateviewmodel';
import { AssetService } from 'src/app/_services/asset.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-add-bulk-asset',
  templateUrl: './add-bulk-asset.component.html',
  styles: ['.zeromarginleft { margin-left :15px ; }'],

})
/** add-bulk-asset component*/
export class AddBulkAssetComponent {
  private loader: EventEmitter<any>;
  msgs: Message[] = [];
  files: File[];
  blockedPanel: boolean;
  progress: number = 0;
  processingMessage: string;
  uploadsuccessdisplay: boolean;
  selectedIndex: number = 0;

  model: AddBulkAssetValidateViewModel;
  modelCopy: AddBulkAssetValidateViewModel;
  csvfilename: string;
  constructor(private assetService: AssetService
    , private globalEvent: GlobalEventsManager
    , private confirmationservice: ConfirmationService
    , private authService: AuthenticationService) {
    this.loader = globalEvent.busySpinner;
  }

  ngOnInit() {
    this.model = new AddBulkAssetValidateViewModel();
    this.modelCopy = new AddBulkAssetValidateViewModel();
    this.files = null;
    this.blockedPanel = false;
    this.processingMessage = "";
    this.uploadsuccessdisplay = false;
    //this.selectedIndex = 0;
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

  remove(index: number) {
    this.msgs = [];
    this.files.splice(index, 1);
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

  onChooseClick(event: any, fileInput: any) {
    fileInput.value = null;
    //fileInput.click();
  }

  clear() {
    this.files = [];
    this.msgs = [];

  }

  upload() {
    this.msgs = [];
    let isFileValid = this.validateFiles();
    if (!isFileValid)
      return;

    let url = this.assetService.getBulkAddAssetUploadUrl();

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
          //==Test Comment
          //this.onUpload.emit({ xhr: xhr, files: this.files });
          if (xhr.responseText && xhr.responseText.indexOf('BatchID=') !== -1) {
            this.blockedPanel = false;
            this.processingMessage = "Files uploaded! Please wait while we validate your file header and column count!";
            this.blockedPanel = true;
            var parseResponse = JSON.parse(xhr.responseText);

            this.validateFileOnServer(parseResponse.substr(8));

            this.blockedPanel = false;
            this.uploadsuccessdisplay = true;
            this.clear();

          }
        }
        //    else
        //        //==Test Comment
        //        this.onError.emit({ xhr: xhr, files: this.files });                
      }

    };

    xhr.open('POST', url, true);

    this.processingMessage = "Please wait while we upload your file!";
    let currentUser = this.authService.currentUserValue;
    // here we are adding token for authorization
    if (currentUser) {
      let token = currentUser.userbasetoken;
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.send(formData);
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

  validateFileOnServer(batchId: string) {

    if (!batchId) {
      this.blockedPanel = false;
      this.processingMessage = 'some error occured while processing the files!'
      this.clear();
    }
    else {
      this.assetService.validateHeaderAddBulkAssetFiles(batchId).then(data => {
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

    this.assetService.insertInAddBulkAssetRawTable(batchId).then((data) => {
      this.blockedPanel = false;
      if (data.item1 === false) {
        this.processingMessage = data.item2;
        this.clear();
        return;
      }

      this.blockedPanel = true;
      this.processingMessage = "Files header validate done! Please wait while we insert data in raw table and validate file data!";
      this.validateAddBulkCTNData(batchId);
    });
  }

  validateAddBulkCTNData(batchId: string) {

    this.assetService.validateAddBulkAssetData(batchId).then((data) => {
      this.blockedPanel = false;
      this.model = data;
      this.clear();
      this.processingMessage = "";

      this.modelCopy = JSON.parse(JSON.stringify(data));
      this.model.batchid = data.batchid;
      this.onTabChange({ index: this.selectedIndex });
      //this.model.addassetrawviewmodellst = this.modelCopy.addassetrawviewmodellst.filter((val, index) => {
      //    return val.errormessage !== null;
      //});
    });
  }

  GetVisibleTabs() {
    //let array: { id: number, desc: string }[] = [
    //    { id: 0, desc: "Invalid Data" },
    //    { id: 1, desc: "Valid Data" },
    //    { id: 2, desc: "All Data" }
    //];

    let array: string[] = [
      "Invalid Data",
      "Valid Data",
      "All Data"
    ];
    return array;
  }

  hasValidRecord(): boolean {
    if (this.modelCopy.addassetrawviewmodellst) {
      return (this.modelCopy.addassetrawviewmodellst.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      }).length) > 0;
    }

    return true;
  }

  onTabChange(e: any) {
    // this gets the active tab name
    if (this.model.batchid) {
      this.selectedIndex = e.index;

      if (e.index == 0) {
        this.csvfilename = "AddBulkAsset-InvalidData";
        this.model.addassetrawviewmodellst = this.modelCopy.addassetrawviewmodellst.filter((val, index) => {
          return val.errormessage != null;
        })
      }

      else if (e.index == 1) {
        this.csvfilename = "AddBulkAsset-ValidData";
        this.model.addassetrawviewmodellst = this.modelCopy.addassetrawviewmodellst.filter((val, index) => {
          return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
        })
      }
      else if (e.index == 2) {
        this.csvfilename = "AddBulkAsset-AllData";
        this.model.addassetrawviewmodellst = this.modelCopy.addassetrawviewmodellst.slice();
      }
    }
  }

  DownloadFile(): void {
    this.assetService.GetAddBulkAssetProtoType().subscribe(response => {
      var fileName = "Add Asset Template.xlsx";
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

  saveValidateAsset() {

    this.loader.emit(this.assetService.InsertBulkAssetDataInAsset(this.model.batchid).subscribe((result: any) => {
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

  resetAfterSave() {
    this.ngOnInit();
  }
}
