import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Message, ConfirmationService } from 'primengdevng8/api';
import { AddBulkCTNValidateViewModel } from 'src/app/_models/bulk-upload/addbulkctnvalidateviewmodel';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { AuthenticationService } from 'src/app/_services/authentication.service';

let styles = '';//String(require('../upload-invoice/upload-invoice-component.css'));

@Component({

  templateUrl: './add-bulk-ctn.component.html',
  selector: 'add-bulk-ctn',
  styles: [styles,
    '.zeromarginleft { margin-left :15px ; }'],

})

export class AddBulkCtnComponent implements OnInit {
  private loader: EventEmitter<any>;
  msgs: Message[] = [];
  files: File[];
  blockedPanel: boolean;
  progress: number = 0;
  processingMessage: string;
  uploadsuccessdisplay: boolean;
  selectedIndex: number = 0;

  model: AddBulkCTNValidateViewModel;
  modelCopy: AddBulkCTNValidateViewModel;
  csvfilename: string;
  constructor(private ctndetaildservice: CTNDetailService
    , private globalEvent: GlobalEventsManager
    , private confirmationservice: ConfirmationService
    , private authService: AuthenticationService) {
    this.loader = globalEvent.busySpinner;
  }

  ngOnInit() {
    this.model = new AddBulkCTNValidateViewModel();
    this.modelCopy = new AddBulkCTNValidateViewModel();
    this.files = null;
    this.blockedPanel = false;
    this.processingMessage = "";
    this.uploadsuccessdisplay = false;

  }


  /**
 * On file select event
 * @param event: the file select event
 */
  onFileSelect(event: any) {
    this.msgs = [];
    this.files = [];

    let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      this.files.push(files[i]);
    }

    //==Test Comment
    //this.onSelect.emit({ originalEvent: event, files: files });
    this.processingMessage = "";
  }


  /**
 * Validates the file
 */
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

  //==Test Comment
  ///**
  // * Checks weather any files or not
  // */
  hasFiles(): boolean {
    return this.files && this.files.length > 0;
  }

  /**
   * Clears file array and message
   */
  clear() {
    this.files = [];
    this.msgs = [];
    //==Test Comment
    //this.onClear.emit();
  }

  upload() {
    this.msgs = [];
    let isFileValid = this.validateFiles();
    if (!isFileValid)
      return;

    let url = this.ctndetaildservice.getBulkAddCTNUploadUrl();

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
    let currentUser = this.authService.currentUserValue;;
    // here we are adding token for authorization
    if (currentUser) {
      let token = currentUser.userbasetoken;
      xhr.setRequestHeader('Authorization', token);
    }
    xhr.send(formData);
  }


  /**
  * Perform validation on server
  * @param batchId: the current batchId
  */
  validateFileOnServer(batchId: string) {

    if (!batchId) {
      this.blockedPanel = false;
      this.processingMessage = 'some error occured while processing the files!'
      this.clear();
    }
    else {
      this.ctndetaildservice.validateHeaderAddBulkCTNFiles(batchId).then(data => {
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

    this.ctndetaildservice.insertInRawTable(batchId).then((data) => {
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

    this.ctndetaildservice.validateAddBulkCTNData(batchId).then((data) => {
      this.blockedPanel = false;
      //this.model = data;
      this.clear();
      this.processingMessage = "";

      this.modelCopy = JSON.parse(JSON.stringify(data));
      this.model.batchid = data.batchid;
      //this.model.addctnrawviewmodellst = this.modelCopy.addctnrawviewmodellst.filter((val, index) => {
      //    return val.errormessage !== null;
      //});
      this.onTabChange({ index: this.selectedIndex });
    });
  }

  /**
 * On file select
 * @param event: the event
 * @param fileInput: fileInput
 */
  onChooseClick(event: any, fileInput: any) {
    fileInput.value = null;
    //fileInput.click();
  }


  /**
   * format the size to show
   * @param bytes: file size in bytes
   */
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

  /**
   * remove a file
   * @param index: index of file to remove
   */
  remove(index: number) {
    this.msgs = [];
    this.files.splice(index, 1);
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

  onTabChange(e: any) {
    // this gets the active tab name
    if (this.model.batchid) {
      this.selectedIndex = e.index;
      if (e.index == 0) {
        this.csvfilename = "AddBulkCTN-InvalidData";
        this.model.addctnrawviewmodellst = this.modelCopy.addctnrawviewmodellst.filter((val, index) => {
          return val.errormessage != null;
        })
      }

      else if (e.index == 1) {
        this.csvfilename = "AddBulkCTN-ValidData";
        this.model.addctnrawviewmodellst = this.modelCopy.addctnrawviewmodellst.filter((val, index) => {
          return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
        })
      }
      else if (e.index == 2) {
        this.csvfilename = "AddBulkCTN-AllData";
        this.model.addctnrawviewmodellst = this.modelCopy.addctnrawviewmodellst.slice();
      }
    }
  }

  saveValidateCTN() {

    this.loader.emit(this.ctndetaildservice.InsertBulkCTNDataInCTNDetail(this.model.batchid).subscribe((result: any) => {
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

  hasValidRecord(): boolean {
    if (this.modelCopy.addctnrawviewmodellst) {
      return (this.modelCopy.addctnrawviewmodellst.filter((val, index) => {
        return val.errormessage == "" || val.errormessage == null || val.errormessage == undefined;
      }).length) > 0;
    }

    return true;
  }

  DownloadFile(): void {
    this.ctndetaildservice.GetAddBulkCTNProtoType().subscribe(response => {
      var fileName = "Add CTN Template.xlsx";
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

  //exportFilename(dt: any) {
  //    if (this.selectedIndex == 0) {

  //    }
  //    else if (this.selectedIndex == 1) {

  //    }
  //    else if (this.selectedIndex == 2) {

  //    }

  //   // dt.exportExcel(true);
  //}


}
