
import { Component, Input, Output, OnInit, OnDestroy, EventEmitter, ViewChild, AfterViewChecked } from '@angular/core';
import { SelectItem, Message, ConfirmationService } from 'primengdevng8/api';
import { CompanyService } from '../_services/company.service';
import { NetworkService } from '../_services/network.service';
import { UploadInvoiceService } from '../_services/uploadinvoice.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ExportDataService } from '../_common/export.data.service';
import { ActivatedRoute, Data } from '@angular/router';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { UserDetail } from '../_models/user-detail';
import { UserService } from '../_services/user.service';
import { SessionStroageProvider } from '../_helper/session.storage.provider';


//let styles = String(require('./upload-invoice-component.css'));

@Component({
    selector: 'upload-invoice',
    templateUrl: './upload-invoice-component.html',
    //styles: [styles],
    styleUrls: ['./upload-invoice-component.css'],
    providers: [
        NetworkService,
        UploadInvoiceService,
        UserService
    ]
})

export class UploadInvoiceComponent implements OnInit, AfterViewChecked, OnDestroy {


    @ViewChild('callsFileUpload', { static: false }) input: any;
    uploadsuccessdisplay: boolean = false;
    inprocess: boolean = false;
    proceedwithdifferentcount: boolean = false;
    differentcount: number = 0;
    currentBatchId: number = 0;
    currentCount: number = 0;

    userDetail: UserDetail;

    /* CompanyId from parent */
    @Input() companyGuid: string;

    /* Companies */
    companies: SelectItem[];
    selectedCompany: any;

    /* Networks */
    networks: SelectItem[];
    selectedNetwork: string;

    /* Billing Platforms */
    billingPlatforms: SelectItem[];
    selectedBillingPlatform: string;

    /* file format VED */
    geminiFormatTypes: SelectItem[];
    selectedgeminiFormatType: number;

    /* Invoice Months */
    invoicemonths: SelectItem[];
    selectedInvoiceMonth: string;

    /* Flag to show hide file uploads  */
    showCallsFile: boolean = false;
    showChargesFile: boolean = false;
    showHandsetFile: boolean = false;

    /* file list */
    fileNamesList: string[];

    /* file names to upload */
    fileToUploadList: string[];

    msgs: Message[] = [];
    multiple: boolean = true;
    public files: File[];
    @Input() url: string;
    @Output() onSelect: EventEmitter<any> = new EventEmitter();
    @Output() onClear: EventEmitter<any> = new EventEmitter();
    @Output() onUpload: EventEmitter<any> = new EventEmitter();
    @Output() onError: EventEmitter<any> = new EventEmitter();
    public progress: number = 0;
    blockedPanel: boolean = false;
    processingMessage: string;
    queryStringParam: any;
    private loader: EventEmitter<any>;
    /**
     * Constructor: used to inject services
     * @param companyService: CompanyService to inject
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param uploadInvoiceService: UploadInvoiceService to inject
     * @exportDataService: ExportDataService to inject
     */
    constructor(private companyService: CompanyService,
        private networkService: NetworkService,
        private authenticationService: AuthenticationService,
        private uploadInvoiceService: UploadInvoiceService,
        private userService: UserService,
        private exportDataService: ExportDataService,
        private route: ActivatedRoute,
        private globalEvent: GlobalEventsManager,
        private authService: AuthenticationService,
        private confirmationservice: ConfirmationService) {
        this.loader = globalEvent.busySpinner;
        this.fileNamesList = [];
        this.fileToUploadList = [];
    }

    /**
     * Initialize the network dropdown
     */
    ngOnInit() {
        this.uploadsuccessdisplay = false;
        this.inprocess = false;
        this.proceedwithdifferentcount = false;
        this.differentcount = 0;
        this.currentBatchId = 0;
        this.currentCount = 0;
        this.showCallsFile = false;
        this.showChargesFile = false;
        this.showHandsetFile = false;
        this.multiple = true;
        this.blockedPanel = false;
        this.clearNetworks();
        this.cleargeminiFormatTypes();
        this.clearBillingPlatform();
        this.clearInvoiceMonths();

        let companyGuid = '';
        let networkGuid = '';
        let billingplatformGuid = '';
        let invoiceMonth = '';
        this.queryStringParam = this.route.queryParams.subscribe(params => {

            companyGuid = params['companyguid'] || '';
            networkGuid = params['networkguid'] || '';
            billingplatformGuid = params['billingPlatformguid'] || '';
            invoiceMonth = params['invoiceMonth'] || '';
        });


        if (companyGuid != '') {
            this.loadComboboxByQueryParam(companyGuid, networkGuid, billingplatformGuid, invoiceMonth);
        } else {
            this.clearCompany();
            this.populateCompanyDropdown();
        }
    }

    ngAfterViewChecked() {

    }

    /* Populates the company dropdown */
    populateCompanyDropdown() {
        this.companyService.getCompanyList().then((data) => {
            this.companies.push({
                label: 'Select Company',
                value: '0'
            });
            data.forEach(item => this.companies.push({
                label: item.companydescription, value: { guid: item.companyguid, dns: item.dnsname }
            }));

            this.selectedCompany = '0';
        });
    }

    /**
     * Populates the network dropdown
     */
    populateNetworkDropdown(event: any) {

        SessionStroageProvider.setDNSSessionStorage(event.value.dns);


        this.clearNetworks();
        this.clearBillingPlatform();
        this.clearInvoiceMonths();
        this.hideFiles();
        this.clearSelectedFileList();
        if (this.selectedCompany === '0') {
            return;
        }

        this.networkService.getNetworkList().then((data) => {
            this.networks.push({
                label: 'Select Network',
                value: '0'
            });
            data.forEach(item => this.networks.push({
                label: item.networkdescription, value: item.networkguid
            }));
        });


    }

    /**
     * If billing platforms exists for given network, load them, else load the months
     */
    loadBillingPlatformOrMonth() {

        // clear the previous values
        this.cleargeminiFormatTypes();
        this.clearBillingPlatform();
        this.clearInvoiceMonths();
        this.hideFiles();
        this.clearSelectedFileList();
        if (this.selectedNetwork === '0') {
            return;
        }

        // load the list
        this.loadBillingPlatforms().then((data) => {
            if (!data || data.length === 0) {
                this.loadBillingMonths();
            }
            else {
                this.billingPlatforms.push({
                    label: 'Select Billing Platform',
                    value: '0'
                });
                data.forEach(item => this.billingPlatforms.push({
                    label: item.billingplatformdescription, value: item.billingplatformguid
                }));
            }
        });
    }

    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatforms() {
        return this.networkService.getBillingPlatforms(this.selectedNetwork, true);
    }

    onChangeBillingplatform() {
        this.cleargeminiFormatTypes();
        let billplatForm = this.billingPlatforms.filter((item) => item.value == this.selectedBillingPlatform)[0];
        if (billplatForm && billplatForm.label === 'Gemini') {
            this.clearInvoiceMonths();
            this.bindgeminiFormatTypes();
        }
        else {
            this.loadBillingMonths();
        }


    }

    /**
     * Load the avaialble upload months for given company, selected network and billingplatfrom
     */
    loadBillingMonths() {
        if (this.selectedBillingPlatform === '0' && this.billingPlatforms.length !== 0) {
            this.clearInvoiceMonths();
            return;
        }
        // clear the previous values
        this.clearInvoiceMonths();
        //if (this.selectedgeminiFormatType) {


        this.uploadInvoiceService.getInvoiceMonth(this.selectedCompany.guid, this.selectedNetwork, (typeof this.selectedBillingPlatform === 'undefined' ? null : this.selectedBillingPlatform), this.selectedgeminiFormatType).then((data) => {
            this.invoicemonths.push({
                label: 'Select Month',
                value: '0'
            });
            data.invoicedatemodellist.forEach(item => this.invoicemonths.push({
                label: item.invoicedatedescription, /*, value: item.id */
                value: item.invoicedatedescription
            }));
            this.fileToUploadList = [];
            data.filelist.forEach(item => this.fileToUploadList.push(item));
            this.clearProcessingMessage();
        });
        //}
    }

    cleargeminiFormatTypes() {
        this.geminiFormatTypes = null;
        this.selectedgeminiFormatType = null;
    }
    bindgeminiFormatTypes() {
        this.geminiFormatTypes = [];
        this.geminiFormatTypes.push({ label: 'Select', value: null },
            { label: 'VED Format', value: <string><any>1 });

        this.geminiFormatTypes.push({
            label: 'iServe CSV', value: <string><any>2
        });

        this.geminiFormatTypes.push({
            label: 'iServe Excel', value: <string><any>3
        });
    }


    /**
   * Clears the Company dropdown and selection
   */
    clearCompany() {
        this.companies = [];
        this.selectedCompany = null;
    }

    /**
     * Clears the networks dropdown and selecttion
     */
    clearNetworks() {
        this.networks = [];
        this.selectedNetwork = null;
    }

    /**
     * Clears the billing platform and selection
     */
    clearBillingPlatform() {
        this.billingPlatforms = [];
        this.selectedBillingPlatform = null;
    }

    /**
     * Clears the invoice months and selection
     */
    clearInvoiceMonths() {
        this.invoicemonths = [];
        this.selectedInvoiceMonth = null;
    }

    /**
     * sets the bits to false to hide file upload button
     */
    hideFiles() {
        this.showCallsFile = false;
        this.showHandsetFile = false;
        this.showChargesFile = false;
    }

    /**
     * On the selection of months, shows the appropriate file upload
     */
    showFileUploadInputs() {
        // ToDo: Change later, to get dynamic names and what not
        //if (this.selectedBillingPlatform && this.selectedBillingPlatform === 1) {
        this.showCallsFile = true;
        this.showChargesFile = true;
        //}
        this.showHandsetFile = true;
        this.clearProcessingMessage();
    }

    /**
     * To handle selection event, and update the selected file selected
     * @param event
     */
    fileSelected(event: any) {
        var totalFilesSelected = event.files.length;
        for (var i = 0; i < totalFilesSelected; i++) {
            this.fileNamesList.push(event.files[i]);
        }
    }

    /**
     * To handle file before upload event
     * @param event
     */
    fileBeforeUpload(event: any) {
        //this.fileNamesList.indexOf()
    }

    fileUpload(event: any) {
    }

    /**
     * Clears the last selection of files
     */
    clearSelectedFileList() {
        this.fileNamesList = [];
    }

    /**
     * set headers
     * @param event: any event
     */
    setHeaders(event: any) {
    }

    /**
     * Checks weather any files or not
     */
    hasFiles(): boolean {
        return this.files && this.files.length > 0;
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
     * On file select event
     * @param event: the file select event
     */
    onFileSelect(event: any) {

        this.msgs = [];
        //if (!this.multiple) {
        this.files = [];
        //}

        let files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            //if (this.validate(file)) {
            /*
            if (this.isImage(file)) {
                file.objectURL = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(files[i])));
            }
            */
            this.files.push(files[i]);
            //}
        }

        this.onSelect.emit({ originalEvent: event, files: files });

        /*
        if (this.hasFiles() && this.auto) {
            this.upload();
        }
        */

    }

    /**
     * Validates the file
     */
    validate() {
        // check how many files count can be there
        // for now, only checking for voda - gemini, so harcoding 3
        // ToDo: remove 
        var fileCount = this.files.length;
        if (fileCount !== this.fileToUploadList.length) {
            this.msgs.push({
                detail: 'Plase make sure you select ' + this.fileToUploadList.length + ' files',
                severity: 'error',
                summary: 'invalid file count'
            })
            return false;
        }

        // check the fileNames
        var fileNamesValid = this.checkFileNames();
        return fileNamesValid;

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

    /**
     * Clears file array and message
     */
    clear() {
        this.files = [];
        this.msgs = [];
        this.onClear.emit();
    }

    /**
     * Upload the file
     */
    upload() {

        this.msgs = [];
        let isFileValid = this.validate();
        if (!isFileValid)
            return;

        this.url = this.uploadInvoiceService.getInvoiceUploadUrl();

        this.blockedPanel = true;

        let xhr = new XMLHttpRequest(),
            formData = new FormData();

        //this.onBeforeUpload.emit({
        //    'xhr': xhr,
        //    'formData': formData
        //});

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
                    this.onUpload.emit({ xhr: xhr, files: this.files });
                    if (xhr.responseText && xhr.responseText.indexOf('BatchID=') !== -1) {
                        this.blockedPanel = false;
                        this.processingMessage = 'Files uploaded! Please wait while we validate your files!';
                        this.blockedPanel = true;
                        //this.validateFileOnServer(Number(xhr.responseText.substr(8)));
                        var parseResponse = JSON.parse(xhr.responseText);
                        this.validateFileOnServer(parseResponse.substr(8));
                    }
                }
                else
                    this.onError.emit({ xhr: xhr, files: this.files });

                //this.clear();
            }
        };

        xhr.open('POST', this.url, true);
        //xhr.setRequestHeader('X-XSRF-TOKEN', this.xsrfToken);
        //const headers = new Headers({ 'X-XSRF-TOKEN': this.xsrfToken });

        //this.onBeforeSend.emit({
        //    'xhr': xhr,
        //    'formData': formData
        //});
        this.processingMessage = 'Please wait while we upload your files!';
        let currentUser = this.authService.currentUserValue;
        //LocalStorageProvider.getUserStorage();
        // here we are adding token for authorization
        if (currentUser) {
            let token = currentUser.userbasetoken;
            xhr.setRequestHeader('Authorization', token);
        }
        xhr.send(formData);
    }

    /**
     * Check files names
     */
    checkFileNames() {
        var fileInvalid = false;
        var fileNames = this.fileToUploadList;
        var fileNotExits = fileNames.filter(item => {
            return item !== null && this.files.map(file => file.name.toLowerCase().trim()).indexOf(item) === -1;
        });
        // validate extension
        if (fileNotExits.some(item => item.indexOf('ext:') === 0)) {
            // based on assumption that only 1 file
            // ToDo: if needed modify for handling multiple cases
            let firstFile = this.files[0].name;
            let firstFileExtension = firstFile.substr((~-firstFile.lastIndexOf('.') >>> 0) + 2);
            let firstFileExpectedExtension = fileNames[0].replace('ext:', '');
            if ('.' + firstFileExtension !== firstFileExpectedExtension) {
                this.msgs.push({
                    severity: 'error',
                    summary: 'Invalid file extension',
                    detail: 'Please select a ' + firstFileExpectedExtension + ' file'
                });
                fileInvalid = true;
            }
        }
        // validate filename
        else {
            fileNotExits.forEach(item => {
                this.msgs.push({
                    severity: 'error',
                    summary: item,
                    detail: 'Could not find the file: ' + item
                });
                fileInvalid = true;
            });
        }
        return !fileInvalid;
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
            this.uploadInvoiceService.validateInvoiceFiles(batchId, this.selectedNetwork, (typeof this.selectedBillingPlatform === 'undefined' ? null : this.selectedBillingPlatform), this.selectedgeminiFormatType).then(data => {
                this.blockedPanel = false;
                if (data.item1 === false) {
                    this.processingMessage = data.item2;
                    this.clear();
                    return;
                }

                this.blockedPanel = true;

                this.insertInInvoiceDate(batchId);

            });

        }
    }

    /**
     * Inserts data in invoice date
     * @param batchId: the current batchId
     */
    insertInInvoiceDate(batchId: string) {
       
        const msg:string =`Logged in UserID:${ this.authService.currentUserValue.id} , EmailID:${ this.authService.currentUserValue.emailaddress} , Name:${ this.authService.currentUserValue.name}`
        this.authService.currentUserValue.id
        this.uploadInvoiceService.insertInInvoiceDate(this.selectedInvoiceMonth, this.selectedCompany.guid).then(() => {
            this.confirmationservice.confirm({
                message: msg,
                key: 'dialog',
                rejectVisible: false,
                accept: (params: any) => {
                    this.createQueue(batchId);
                },
                reject:()=>{
                    //this.performLocalCleanUp();
                    this.ngOnInit();
                    
                }
            });

            
        });
    }

    /**
     * Create the upload queue  to process
     * @param batchId: the current batchId
     */
    createQueue(batchId: string) {
        this.uploadInvoiceService.createQueue(batchId, this.selectedCompany.guid, this.selectedNetwork, this.selectedInvoiceMonth, (typeof this.selectedBillingPlatform === 'undefined' ? null : this.selectedBillingPlatform), this.selectedgeminiFormatType).then(data => {
            if (!data) {
                // already uploaded
                this.blockedPanel = false;
                this.inprocess = true;
                this.clearProcessingMessage();
                this.uploadsuccessdisplay = false;
                this.clear();
                this.loadBillingMonths();

            }
            else {
                this.performLocalCleanUp();
            }
            this.clearStorage();
        });
    }

    /**
     * performs the local clean up
     */
    performLocalCleanUp() {
        this.blockedPanel = false;
        this.uploadsuccessdisplay = true;
        this.clearProcessingMessage();
        this.clear();
        this.loadBillingMonths();
    }

    clearProcessingMessage() {
        this.processingMessage = '';
    }

    loadComboboxByQueryParam(companyGuid: string, networkGuid: string, billingplatformGuid: string, invoiceMonth: string) {

        this.loader.emit(this.uploadInvoiceService.getUploadInvoiceComboBoxData(companyGuid, networkGuid, billingplatformGuid).then(data => {

            this.clearCompany();

            if (data.companylist != undefined && data.companylist != null) {
                this.companies.push({
                    label: 'Select Company',
                    value: '0'
                });
                data.companylist.forEach(item => this.companies.push({
                    label: item.companydescription, value: item.companyguid
                }));

                this.selectedCompany = companyGuid;
            }

            this.clearNetworks();

            if (data.networklist != undefined && data.networklist != null) {

                this.networks.push({
                    label: 'Select Network',
                    value: '0'
                });
                data.networklist.forEach(item => this.networks.push({
                    label: item.networkdescription, value: item.networkguid
                }));

                this.selectedNetwork = networkGuid;
            }

            this.clearBillingPlatform();

            if (data.billingplatformlist != undefined || data.billingplatformlist != null) {



                this.billingPlatforms.push({
                    label: 'Select Billing Platform',
                    value: '0'
                });
                data.billingplatformlist.forEach(item => this.billingPlatforms.push({
                    label: item.billingplatformdescription, value: item.billingplatformguid
                }));

                this.selectedBillingPlatform = billingplatformGuid;
            }

            this.cleargeminiFormatTypes();

            let billplatForm = this.billingPlatforms.filter((item) => item.value == this.selectedBillingPlatform)[0];
            if (billplatForm && billplatForm.label === 'Gemini') {
                this.bindgeminiFormatTypes();
                //Defaut Whne we comes from InvoiceMonitering  Page//
                this.selectedgeminiFormatType = 2;
            }

            this.clearInvoiceMonths();

            if (data.invoicemonthlist.invoicedatemodellist != undefined && data.invoicemonthlist.invoicedatemodellist != null) {



                this.invoicemonths.push({
                    label: 'Select Month',
                    value: '0'
                });
                data.invoicemonthlist.invoicedatemodellist.forEach(item => this.invoicemonths.push({
                    label: item.invoicedatedescription, /*, value: item.id */
                    value: item.invoicedatedescription
                }));

                if (data.invoicemonthlist.filelist != undefined && data.invoicemonthlist.filelist != null) {
                    this.fileToUploadList = [];
                    data.invoicemonthlist.filelist.forEach(item => this.fileToUploadList.push(item));
                }

                this.selectedInvoiceMonth = invoiceMonth;
                this.showCallsFile = true;
            }

        }));
    }

    ngOnDestroy() {
        this.clearStorage();
    }
    resetPage() {
        this.uploadsuccessdisplay = false;
        this.ngOnInit();
    }

    clearStorage(){
        SessionStroageProvider.clearSessionStorage();
    }

}
