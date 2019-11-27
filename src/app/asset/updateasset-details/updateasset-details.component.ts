import { Component, Input, OnInit, Output, EventEmitter, OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { SelectItem, ConfirmationService, AutoCompleteHeaderColumnMeta, ConfirmationDialogControl } from 'primengdevng8/api';
import { UpdateAssetViewModel } from '../../_models/asset/addasset';
import { AssetChangeLogViewModel } from '../../_models/asset/asset-changelog';
import { AssetFilter } from '../../_models/asset/asset-filter';
import { AssetService } from '../../_services/asset.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportingGroupType, AssetStatus, AssetOwnership, ReportingGroupRelationshipType } from '../../_services/enumtype';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { GenericService } from '../../_services/generic.service';
import { UserDetail } from '../../_models/user-detail';
import { UserService } from '../../_services/user.service';
import { UserFilter } from '../../_models/user-filter';
import { MobileFilter } from "../../_models/mobile-filter";
import { CTNDetailService } from '../../_services/ctndetail.service';
import { String } from '../../_common/utility-method';
import { CTNDetailModel } from "../../_models/ctn-details";
import { AddNewMobileComponent } from '../../fleet/add-new-mobile/add-new-mobile.component'
import { UserMaintenaceComponent } from '../../user/user-maintenance.component';
import { AssignMobilenumberComponent } from '../../asset/updateasset-details/assign-mobilenumber.component';
import { ProductLibraryService } from '../../_services/admin/productlibrary.service';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { promise } from 'selenium-webdriver';
import { Location } from '@angular/common';
import { AuthenticationService } from 'src/app/_services/authentication.service';


@Component({
    selector: 'update-asset-details',
    templateUrl: './updateasset-details.component.html',
    styles: ['.btn-height{ height: 33px;}'
    ]
})
export class UpdateAssetDetailsComponent implements OnInit {


    private loader: EventEmitter<any>;
    isAdmin: boolean = false;
    model: UpdateAssetViewModel = new UpdateAssetViewModel();

    oldmodel: UpdateAssetViewModel = new UpdateAssetViewModel();

    isclient: boolean;
    searchuserautocompletePlaceHolderText: string;

    reportinggroup1Array: { label: string, value: any, guid: string }[];
    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinhgroup1Required: boolean;

    reportinggroup2Array: { label: string, value: any, guid: string }[];
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinhgroup2Required: boolean;

    reportinggroup3Array: { label: string, value: any, guid: string }[];
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinhgroup3Required: boolean;

    reportinggroup4Array: { label: string, value: any, guid: string }[];
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinhgroup4Required: boolean;

    reportinggroup5Array: { label: string, value: any, guid: string }[];
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinhgroup5Required: boolean;

    reportinggroup6Array: { label: string, value: any, guid: string }[];
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;
    reportinhgroup6Required: boolean;

    displayLabel: boolean = true;
    assetArray: SelectItem[];
    assetID: number;
    ShowPOAgainstAssetActive: boolean;

    gridmodel: AssetChangeLogViewModel[];

    assetFilterList: AssetFilter[];
    assetFilterheadermeta: AutoCompleteHeaderColumnMeta[] = [

        { field: 'device', header: 'Device', width: '25%' }
        , { field: 'imei', header: 'IMEI', width: '20%' }
        , { field: 'serialnumber', header: 'Serial No' }
        , { field: 'status', header: 'Status' }
        , { field: 'employeename', header: 'Employee Name' }
        , { field: 'mobilenumber', header: 'Mobile Number', width: '15%' }
    ];

    sub: any;
    csvfilename = "Asset History";
    selectedAsset: any;

    assetStatusArray: any[];
    assetLocationArray: any[];
    assetownershiparray: SelectItem[];

    isAssignMobileNumber: boolean = false;
    isEdit: boolean = false;

    productLibraryArray: SelectItem[];

    // userFilterList: UserFilter[];
    // mobileFilterList: MobileFilter[];
    //mobileFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [{ field: "mobilenumber", header: 'Mobile Number' },
    //{ field: 'staffname', header: 'Staff Name' },
    //{ field: 'status', header: 'Status' }
    //];


    // userFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [{ field: "name", header: 'Employee Name', width: '30%' },
    //{ field: 'username', header: 'User Name', width: '30%' },
    //{ field: 'emailaddress', header: 'Email', width: '40%' }
    //];

    //userFilter: UserFilter;

    reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
    reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
    reportingGroupTypeEnum = ReportingGroupType;
    reportingGroupRelationshipType = ReportingGroupRelationshipType;
    isAssetRegisterIDActive: boolean;
    isComingFromFleet: boolean = false;

    constructor(private assetService: AssetService
        , private globalEvent: GlobalEventsManager
        , private route: ActivatedRoute
        , private router: Router
        , private reportinggroup1service: ReportingGroup1Service
        , private reportinggroup2service: ReportingGroup2Service
        , private reportinggroup3service: ReportingGroup3Service
        , private reportinggroup4service: ReportingGroup4Service
        , private reportinggroup5service: ReportingGroup5Service
        , private reportinggroup6service: ReportingGroup6Service
        , private userService: UserService
        , private invoicereportservice: InvoiceReportService
        , private confirmationservice: ConfirmationService
        , private ctnDetailService: CTNDetailService
        , private modalPopupService: ModalPopupService
        , private productLibraryService: ProductLibraryService
        , private genericService: GenericService
        , private clientcontrolservice: ClientControlService
        , private location: Location
        , private authService: AuthenticationService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loadProductLibraryDropdown();
        let data = this.authService.currentUserValue;
        this.isAdmin = data.adminuser;
        //this.isAssignMobileNumber = false;
        //this.isEdit = false;
        let process5 = this.loadReportingGroupList();
        let process6 = this.isCascade();
        let process7 = this.getReportingGroupRelationList();
        this.route.params.subscribe(params => {
            this.sub = this.route.queryParams.subscribe(params => {

                this.model.assetguid = params['assetguid'] || "";
                if (params['assetguid']) {
                    this.isComingFromFleet = true;
                }
                var process5 = this.IsShowPOAgainstAssetActive();
                let p6 = this.checkAssetRegisterIDActive();
                this.loader.emit(Promise.all([process5, p6]).then(() => {
                    if (this.model.assetguid != undefined && this.model.assetguid != "") {
                        let process3 = this.LoadAssetDetails();
                        let process4 = this.loadAssetChageLog();
                        //var process5 = this.loadReportingGroupList();
                        //var process6 = this.isCascade();
                        //var process7 = this.getReportingGroupRelationList();
                    }

                }));

            });
        });

    }

    getReportingGroupRelationList() {
        return this.genericService.GetReportingGroupRelationList().then((data) => {
            this.reportingGroupRelMasterArray = data;
        });
    }

    ngAfterViewChecked() {
    }

    showButton() {
        if (this.isAdmin) {
            this.isAssignMobileNumber = true;
        }
        else if ((this.model.assetstatusid == AssetStatus.InUse || this.model.assetstatusid == AssetStatus.Spare)
            && (this.model.assetownershipid == AssetOwnership.Company || this.model.assetownershipid == AssetOwnership.Employee)) {
            this.isAssignMobileNumber = true;
        }

        if (this.isAdmin || (this.model.assetstatusid == AssetStatus.InUse || this.model.assetstatusid == AssetStatus.Spare)) {
            this.isEdit = true;
        }

    }


    completeMethodAsset(event: any) {
        this.assetService.getAssetByFilter(event.query).then(data => {
            this.assetFilterList = data;
        });
    }

    onSelectAsset(event: any) {
        if (event.assetguid != undefined) {
            this.displayLabel = true;
            this.model.assetguid = event.assetguid;
            this.selectedAsset = event.device;
            var process1 = this.LoadAssetDetails();
            var process2 = this.loadAssetChageLog();
            var process3 = this.loadReportingGroupList();
            this.loader.emit(Promise.all([process1, process2, process3]).then(() => {
                //this.showButton();
            }));



        }
        else {
            this.model = null;
        }
    }

    clearModelAsset(event: any) {

        this.model = new UpdateAssetViewModel();
        //this.oldmodel = new UpdateAssetViewModel();        
        this.loadAssetChageLog();
        this.displayLabel = true;
    }

    IsShowPOAgainstAssetActive() {
        this.assetService.IsShowPOAgainstAssetActive().then((data) => {
            this.ShowPOAgainstAssetActive = data;
        });
    }

    loadAssetChageLog() {
        this.assetService.GetAssetChangeLog(this.model.assetguid).then((data) => {
            //
            this.gridmodel = data;
        });
    }

    LoadAssetDetails() {

        this.loader.emit(this.assetService.GetAssetDetails(this.model.assetguid).then((data) => {


            this.model = data;
            this.model.productdescription = data.device;

            this.oldmodel = JSON.parse(JSON.stringify(data)) as UpdateAssetViewModel;

            this.assetFilterList = [];
            this.assetFilterList.push({ assetguid: data.assetguid, mobilenumber: data.mobilenumber, employeename: data.employeename, status: data.assetstatusdescription, imei: data.imei, serialnumber: data.serialnumber, device: data.device } as AssetFilter);
            this.selectedAsset = this.assetFilterList[0];


            if (this.model.isuserdeattch) {

                //  this.userFilter = new UserFilter();

                this.model.staffid = null;
                this.model.employeename = null;
                this.model.userguid = null;
                this.model.employeeemail = null;
                this.model.employeestaffid = null;


            }

            if (this.model.isctndeattch && !this.model.mobilenumber) {
                this.model.simnumber = null;
                this.model.ctndetailguid = null;
                this.model.mobilenumber = null;

                this.setOldValuetoAsset(this.model.isuserdeattch);

            }
            this.showButton();
            this.loadReportingGroupIDsWhenGUIDExist();
        }));
    }

    loadReportingGroupList(): Promise<any> {

        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                this.reportinggroup1Active = reportinggroup1.active;
                this.reportinggroup1DisplayName = reportinggroup1.displayname;
                this.reportinhgroup1Required = reportinggroup1.isrequired;
                if (!this.displayLabel) {
                    this.loadReportingGroup1Dropdown();
                }
            }
            var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {
                this.reportinggroup2Active = reportinggroup2.active;
                this.reportinggroup2DisplayName = reportinggroup2.displayname;
                this.reportinhgroup2Required = reportinggroup2.isrequired;
                if (!this.displayLabel && !this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    this.loadReportingGroup2Dropdown();
                }
            }

            var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                this.reportinggroup3Active = reportinggroup3.active;
                this.reportinggroup3DisplayName = reportinggroup3.displayname;
                this.reportinhgroup3Required = reportinggroup3.isrequired;
                if (!this.displayLabel && !this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    this.loadReportingGroup3Dropdown();
                }
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname;
                this.reportinhgroup4Required = reportinggroup4.isrequired;
                if (!this.displayLabel && !this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    this.loadReportingGroup4Dropdown();
                }
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname;
                this.reportinhgroup5Required = reportinggroup5.isrequired;
                if (!this.displayLabel && !this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    this.loadReportingGroup5Dropdown();
                }
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname;
                this.reportinhgroup6Required = reportinggroup6.isrequired;
                if (!this.displayLabel && !this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    this.loadReportingGroup6Dropdown();
                }

            }

        });

    }


    isReportingGroupCascade(id: number): ReportingGroupRelMasterModel[] {
        return this.reportingGroupRelMasterArray.filter(x => x.childrportinggroupid == id);
    }

    /**
      * Load the ReportingGroup1 array for the given company
      */
    loadReportingGroup1Dropdown() {
        
        if (this.reportinggroup1Active) {
            return this.reportinggroup1service.getReportingGroup1List(true, null, this.model.reportinggroup1id).then((data) => {
                this.clearReportingGroup1();
                if (data != null) {
                    this.reportinggroup1Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup1Array.push({
                        label: item.reportinggroup1description, value: item.reportinggroup1id, guid: item.reportinggroup1guid
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup1 and selecttion
    */
    clearReportingGroup1() {
        this.reportinggroup1Array = [];

    }


    /**
       * Load the ReportingGroup2 array for the given company
       */
    loadReportingGroup2Dropdown() {
       
        if (this.reportinggroup2Active) {

            this.reportinggroup2service.getReportingGroup2List(true, null, this.model.reportinggroup2id).then((data) => {
                this.clearReportingGroup2();
                if (data != null) {
                    this.reportinggroup2Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.reportinggroup2description, value: item.reportinggroup2id, guid: item.reportinggroup2guid
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup2 and selecttion
    */
    clearReportingGroup2() {
        this.reportinggroup2Array = [];

    }

    /**
       * Load the ReportingGroup3 array for the given company
       */
    loadReportingGroup3Dropdown() {
        
        if (this.reportinggroup3Active) {

            this.reportinggroup3service.getReportingGroup3List(true, null, this.model.reportinggroup3id).then((data) => {
                this.clearReportingGroup3();
                if (data != null) {
                    this.reportinggroup3Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.reportinggroup3description, value: item.reportinggroup3id, guid: item.reportinggroup3guid
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup3 and selecttion
    */
    clearReportingGroup3() {
        this.reportinggroup3Array = [];
    }

    /**
       * Load the ReportingGroup4 array for the given company
       */
    loadReportingGroup4Dropdown() {
       
        if (this.reportinggroup4Active) {

            this.reportinggroup4service.getReportingGroup4List(true, null, this.model.reportinggroup4id).then((data) => {
                this.clearReportingGroup4();
                if (data != null) {
                    this.reportinggroup4Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.reportinggroup4description, value: item.reportinggroup4id, guid: item.reportinggroup4guid
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup4 and selecttion
    */
    clearReportingGroup4() {
        this.reportinggroup4Array = [];
    }

    /**
       * Load the ReportingGroup5 array for the given company
       */
    loadReportingGroup5Dropdown() {
       
        if (this.reportinggroup5Active) {

            this.reportinggroup5service.getReportingGroup5List(true, null, this.model.reportinggroup5id).then((data) => {
                this.clearReportingGroup5();
                if (data != null) {
                    this.reportinggroup5Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.reportinggroup5description, value: item.reportinggroup5id, guid: item.reportinggroup5guid
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup5 and selecttion
    */
    clearReportingGroup5() {
        this.reportinggroup5Array = [];
    }

    /**
       * Load the ReportingGroup6 array for the given company
       */
    loadReportingGroup6Dropdown() {
       
        if (this.reportinggroup6Active) {

            this.reportinggroup6service.getReportingGroup6List(true, null, this.model.reportinggroup6id).then((data) => {
                this.clearReportingGroup6();
                if (data != null) {
                    this.reportinggroup6Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.reportinggroup6description, value: item.reportinggroup6id, guid: item.reportinggroup6guid

                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup6 and selecttion
    */
    clearReportingGroup6() {
        this.reportinggroup6Array = [];
    }


    diagnose() {
        return JSON.stringify(this.model);
    }

    changeControlState(value: any) {

        this.displayLabel = value;

        var process1 = this.loadAssetStatusDropdown();

        //var process2 = this.loadAssetLocationDropdown();

        process1.then(() => {
            this.loadAssetLocationDropdown();
        });



        var process3 = this.loadAssetOwnershipDropdown();
        var process4 = this.loadReportingGroupList();
        var process5 = this.LoadAssetDetails();
        this.togglecontrol();
        this.loader.emit(Promise.all([process1, process3, process4, process5]));

    }

    /**
       * Load the AssetStatus array 
       */
    loadAssetStatusDropdown(): Promise<any> {
        
        return this.assetService.getAssetStatusList().then((data) => {
            this.clearAssetStatus();
            if (data != null) {
                this.assetStatusArray.push({ label: '--Select--', value: null });
                data.forEach(item => this.assetStatusArray.push({
                    label: item.description, value: item.assetstatusid, isuserdeattch: item.isuserdeattch, isctndeattch: item.isctndeattch
                }));

                //
                // this.loadAssetStatusDropdown();
            }
        });
    }



    /**
    * Clears the  AssetStatus and selecttion
    */
    clearAssetStatus() {
        this.assetStatusArray = [];
    }


    onAssetLocationDropdownChange() {

        let selectedAssetLocation = this.assetLocationArray.filter(x => x.value == this.model.assetlocationid)[0];
        this.model.isuserdeattch = selectedAssetLocation.isuserdeattch;

        if (this.model.isuserdeattch) {

            //this.userFilter = new UserFilter();

            this.model.staffid = null;
            this.model.employeename = null;
            this.model.userguid = null;
            this.model.employeeemail = null;
            this.model.employeestaffid = null;


        }
    }
    /**
       * Load the AssetLocation array 
       */
    loadAssetLocationDropdown() {

        this.clearAssetLocation();
        if (this.model.assetstatusid != null) {

            let selectedAssetStatus = this.assetStatusArray.filter(x => x.value == this.model.assetstatusid)[0];

            this.model.isctndeattch = selectedAssetStatus.isctndeattch;
            this.model.isuserdeattch = selectedAssetStatus.isuserdeattch;

            if (this.model.isctndeattch) {
                this.model.simnumber = null;
                this.model.ctndetailguid = null;
                this.model.mobilenumber = null;

                this.setOldValuetoAsset(this.model.isuserdeattch);

            }


            this.assetService.getAssetLocationByAssetStatusID(this.model.assetstatusid).then((data) => {
                this.clearAssetLocation();
                if (data != null) {
                    this.assetLocationArray.push({ label: '--Select--', value: null });
                    data.forEach(item => this.assetLocationArray.push({
                        label: item.description, value: item.assetlocationid, isuserdeattch: item.isuserdeattch
                    }));
                }
            });
        }
    }

    /**
    * Clears the  ReportingGroup6 and selecttion
    */
    clearAssetLocation() {
        this.assetLocationArray = [];
    }

    /**
       * Load the AssetOwnership array 
       */
    loadAssetOwnershipDropdown() {
        

        this.assetService.GetOwnershipList().then((data) => {
            this.clearAssetOwnership();
            if (data != null) {
                this.assetownershiparray.push({ label: '--Select--', value: null });
                data.forEach(item => this.assetownershiparray.push({
                    label: item.assetownershipdescription, value: item.assetownershipid
                }));
            }
        });
    }

    /**
    * Clears the  clearAssetOwnership and selection
    */
    clearAssetOwnership() {
        this.assetownershiparray = [];
    }

    togglecontrol() {
        //if Admin login, then isclient must be set to false bcz we are hiding and showing the controls for admin and client
        let data = this.authService.currentUserValue;
        this.isclient = !data.adminuser;//data.isclient;        
        //this.isclient = false;
        if (this.isclient) {
            this.searchuserautocompletePlaceHolderText = "Search by name,staffid,username";
        } else {
            this.searchuserautocompletePlaceHolderText = "Search by name,email";
        }
    }

    /**
* Load the ctn details
*/
    loadCTNDetails(ctnGuid: string): Promise<any> {

        return this.ctnDetailService.getCTNDetailByGuid(ctnGuid).then((data) => {
            if (data != null) {
                //


                this.model.ctndetailguid = ctnGuid;//data.ctndetailsguid;
                this.model.simnumber = data.simnumber;
                this.model.reportinggroup1guid = data.reportinggroup1guid;
                this.model.reportinggroup2guid = data.reportinggroup2guid;
                this.model.reportinggroup3guid = data.reportinggroup3guid;
                this.model.reportinggroup4guid = data.reportinggroup4guid;
                this.model.reportinggroup5guid = data.reportinggroup5guid;
                this.model.reportinggroup6guid = data.reportinggroup6guid;
                this.model.employeeemail = data.email;
                this.model.employeestaffid = data.staffid;
                this.model.userguid = data.userguid;
                this.model.employeename = data.name;
                this.model.mobilenumber = data.mobilenumber;
                this.model.selectedmobilemployeename = this.model.employeename;// (this.model.ctndetailguid !=null ? JSON.stringify(this.model.employeename).toString() : null);

            }
        });
    }

    save(form: NgForm) {

        if (!this.checkIsAnyChange()) {

            this.confirmationservice.confirm({
                message: "No Value Change",
                key: 'dialog',
                rejectVisible: false,
                accept: (params: any) => {

                }
            });

        }
        else {

            //Update Asset and Assign Mobile User To Asset 
            this.model.iseditonly = true;
            this.saveAsset();
        }

    }

    saveAsset() {


        this.loader.emit(this.assetService.updateAsset(this.model).subscribe((result: any) => {
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
        this.displayLabel = true;
        this.isEdit = false;
        this.isAssignMobileNumber = false;
        var process1 = this.IsShowPOAgainstAssetActive();
        this.loader.emit(Promise.all([process1]).then(() => {
            if (this.model.assetguid != undefined && this.model.assetguid != "") {
                var process3 = this.LoadAssetDetails();
                var process4 = this.loadAssetChageLog();
                var process5 = this.loadReportingGroupList();
            }

        }));

    }

    onlyNumberKey(event: any) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }

    imeiOnBlur(event: any) {

        if (this.model.imei === "" || this.model.imei === null) {
            this.model.mobilenumber = null;
            this.model.simnumber = null;
        }
    }

    setOldValuetoAsset(isUserDettacked: boolean) {
        //

        var data = this.oldmodel;
        this.model.reportinggroup1guid = data.reportinggroup1guid;
        this.model.reportinggroup2guid = data.reportinggroup2guid;
        this.model.reportinggroup3guid = data.reportinggroup3guid;
        this.model.reportinggroup4guid = data.reportinggroup4guid;
        this.model.reportinggroup5guid = data.reportinggroup5guid;
        this.model.reportinggroup6guid = data.reportinggroup6guid;
        this.model.employeeemail = data.employeeemail;
        this.model.employeestaffid = data.employeestaffid;
        this.model.userguid = data.userguid;
        this.model.employeename = data.employeename;

        //===Set Value for USer AutoComplete 
        // this.userFilter = new UserFilter();

        if (!isUserDettacked) {
            // this.userFilter.staffid = data.staffid;
            // this.userFilter.name = data.employeename;
            // this.userFilter.userguid = data.userguid;
            this.model.employeeemail = data.employeeemail;
            this.model.employeestaffid = data.employeestaffid;

        } else {
            this.model.staffid = null;
            this.model.employeename = null;
            this.model.userguid = null;
            this.model.employeeemail = null;
            this.model.employeestaffid = null;
        }

        //this.mobileFilter = new MobileFilter();
    }


    onAddNewMobile() {
        let params: any = { isComponentINPopUp: true, componentname: "Add New Mobile", isUpdateAssignPopUp: true, oldMobileNumber: this.model.mobilenumber, oldDevice: this.model.device };
        this.modalPopupService.displayViewInPopup("Add New Mobile", <any>AddNewMobileComponent, params, "lg").result.then(res => {
            if (res) {

                var process1 = this.loadCTNDetails(res.ctndetailsguid);
                this.loader.emit(Promise.all([process1]).then(() => {

                    this.saveAsset();

                }));

            }
        });

    }


    onAssignMobileNumber() {

        let params: any = { isComponentINPopUp: true, componentname: "Assign Mobile Number", oldmodel: this.oldmodel };
        this.modalPopupService.displayViewInPopup("Assign Mobile Number", <any>AssignMobilenumberComponent, params, "lg").result.then(res => {
            if (res) {
                this.resetAfterSave();
            }
        });


    }

    onAddNewUser() {
        let params: any = {
            isComponentINPopUp: true,
            componentname: "Assign User",
            isUpdateAssignPopUp: true,
            oldMobileNumber: this.model.mobilenumber,
            oldDevice: this.model.device,
            oldEmployeename: this.model.employeename
        };

        this.modalPopupService.displayViewInPopup("Assign User", <any>UserMaintenaceComponent, params, "lg").result.then(res => {
            if (res) {
                this.model.optionselection = res.optionselection ? res.optionselection : false;
                let event = { userguid: res.userguid, emailaddress: res.emailaddress, staffid: res.staffid, name: res.name };
                this.onSelectUserAccount(event);

                //this.model.simnumber = null;
                //this.model.ctndetailguid = null;
                //this.model.mobilenumber = null;
                // this.saveAsset();
                this.loader.emit(this.assetService.reassignAsset(this.model).subscribe((result: any) => {
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

            };
        });
    }

    onSelectUserAccount(event: any) {
        this.model.userguid = event.userguid;
        this.model.employeeemail = event.emailaddress;
        this.model.employeestaffid = event.staffid;
        this.model.employeename = event.name
    }

    onDisassociateMobile() {
        this.confirmationservice.confirm({
            message: "Are you sure want to Disassociate Mobile?",
            key: 'confirmation-dialog-without-icon',
            control: null,
            rejectVisible: false,
            accept: (params: any) => {
                this.model.simnumber = null;
                this.model.ctndetailguid = null;
                this.model.mobilenumber = null;

                this.saveAsset();
            }
        });
    }

    loadProductLibraryDropdown(): Promise<any> {
        this.clearProductLibraryDropdown();

        return this.productLibraryService.GetProductLibraryList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.productLibraryArray.push({
                    label: item.productdescription, value: item.productdescription
                }));
            }
        });
    }

    clearProductLibraryDropdown() {
        this.productLibraryArray = [];

    }

    onChangeReportingGroup1(): Promise<any> {

        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
            let selectedReportingGroup = this.model.reportinggroup1id;
            //this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
            this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
            if (selectedReportingGroup) {
                if (this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup, this.model.reportinggroup2id);
                }

                if (this.reportinggroup3Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup, this.model.reportinggroup3id);
                }

                if (this.reportinggroup4Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup, this.model.reportinggroup4id);
                }
                if (this.reportinggroup5Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup, this.model.reportinggroup5id);
                }
                if (this.reportinggroup6Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup, this.model.reportinggroup6id);
                }
            }

        }
        else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

            let selectedReportingGroup = this.model.reportinggroup1id;
            //this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
            this.clearReportingGroupDropDownWhenDaisyChain(2);
            if (selectedReportingGroup && this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                //this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
                // return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup);
            }
            else {
                return new Promise((resolve: any, reject: any) => { resolve(1); });
            }

        }

        return new Promise((resolve: any, reject: any) => { resolve(1); });

    }


    onChangeReportingGroup(reportingGroupType: number, childReportingGroupActive: boolean): Promise<any> {
        let value = 0;
        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {
            let selectedReportingGroup: any;
            if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
                value = ReportingGroupType.ReportingGroup1;
                selectedReportingGroup = this.model.reportinggroup1id;
                this.clearReportingGroupDropDownWhenDaisyChain(2);
            }
            else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {
                value = ReportingGroupType.ReportingGroup2;
                selectedReportingGroup = this.model.reportinggroup2id;
                this.clearReportingGroupDropDownWhenDaisyChain(3);
            }
            else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
                value = ReportingGroupType.ReportingGroup3;
                selectedReportingGroup = this.model.reportinggroup3id;
                this.clearReportingGroupDropDownWhenDaisyChain(4);
            }

            else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
                value = ReportingGroupType.ReportingGroup4;
                selectedReportingGroup = this.model.reportinggroup4id;
                this.clearReportingGroupDropDownWhenDaisyChain(5);
            }
            else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
                value = ReportingGroupType.ReportingGroup5;
                selectedReportingGroup = this.model.reportinggroup5id;
                this.clearReportingGroupDropDownWhenDaisyChain(6);
            }
            //else if (reportingGroupType=== ReportingGroupType.ReportingGroup6) {
            //    selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == this.model.reportinggroup6guid)[0];
            //}



            let nextreportingGroupType = reportingGroupType + 1;
            if (selectedReportingGroup && childReportingGroupActive && this.isReportingGroupCascade(nextreportingGroupType).length) {
                this.clearReportingGroupDropDownWhenCascade(reportingGroupType);
                return this.loadCascadeReportingGroupDropdown(nextreportingGroupType, selectedReportingGroup);
            }

            else {
                return new Promise((resolve: any, reject: any) => { resolve(1); });
            }

        }
        return new Promise((resolve: any, reject: any) => { resolve(1); });
    }




    loadCascadeReportingGroupDropdown(childRportingGroupId: number, parentReportingGroupRecordId: number, recordID?: number): Promise<any> {


        return this.genericService.GetReportingGroupListByChildRportingGroupId(childRportingGroupId, parentReportingGroupRecordId, true, recordID).then((data) => {
            if (data != null) {

                if (childRportingGroupId === ReportingGroupType.ReportingGroup2) {

                    this.reportinggroup2Array = [];
                    this.reportinggroup2Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.description, value: item.id, guid: item.reportinggroupguid
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup3) {
                    this.reportinggroup3Array = [];
                    this.reportinggroup3Array.push({
                        label: '--Select--', value: null, guid: null
                    });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.description, value: item.id, guid: item.reportinggroupguid
                    }));
                }

                else if (childRportingGroupId === ReportingGroupType.ReportingGroup4) {
                    this.reportinggroup4Array = [];
                    this.reportinggroup4Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.description, value: item.id, guid: item.reportinggroupguid
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup5) {
                    this.reportinggroup5Array = [];
                    this.reportinggroup5Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.description, value: item.id, guid: item.reportinggroupguid
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup6) {
                    this.reportinggroup6Array = [];
                    this.reportinggroup6Array.push({ label: '--Select--', value: null, guid: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.description, value: item.id, guid: item.reportinggroupguid
                    }));
                }
                new Promise((resolve: any, reject: any) => { resolve(1); });
            }
        });

    }
    clearReportingGroupDropDownWhenCascade(id: number) {

        let reportingGroups = this.reportingGroupRelMasterArray.filter(a => a.childrportinggroupid > id);
        if (this.reportinggroup2Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup2)) {
            this.clearReportingGroup2();
        }
        if (this.reportinggroup3Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup3)) {
            this.clearReportingGroup3();
        }

        if (this.reportinggroup4Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup4)) {
            this.clearReportingGroup4();
        }
        if (this.reportinggroup5Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup5)) {
            this.clearReportingGroup5();
        }
        if (this.reportinggroup6Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup6)) {
            this.clearReportingGroup6();
        }
    }

    isCascade(): Promise<any> {
        return this.clientcontrolservice.IsReportingGroupCascade().then((data: any) => {
            this.reportingGroupCascade = { IsCasCade: null, CascadeValue: null };
            this.reportingGroupCascade.IsCasCade = data.iscascade;
            this.reportingGroupCascade.CascadeValue = data.cascadevalue;
        });
    }

    clearReportingGroupDropDownWhenDaisyChain(start: number) {
        for (var i = start; i <= 6; i++) {
            this["reportinggroup" + i + "Array"] = [];
            this.model["reportinggroup" + i + "guid"] = null;
            this.model["reportinggroup" + i + "id"] = null;
        }

    }

    loadReportingGroupIDsWhenGUIDExist() {
        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {
            let _reportinggroup1id = this.model.reportinggroup1id;
            let _reportinggroup2id = this.model.reportinggroup2id;
            let _reportinggroup3id = this.model.reportinggroup3id;
            let _reportinggroup4id = this.model.reportinggroup4id;
            let _reportinggroup5id = this.model.reportinggroup5id;
            let _reportinggroup6id = this.model.reportinggroup6id;
            this.onChangeReportingGroup1().then((res: any) => {
                this.model.reportinggroup1id = _reportinggroup1id;
                this.model.reportinggroup2id = _reportinggroup2id;

                this.onChangeReportingGroup(ReportingGroupType.ReportingGroup2, this.reportinggroup3Active).then(() => {
                    this.model.reportinggroup3id = _reportinggroup3id;
                    this.onChangeReportingGroup(ReportingGroupType.ReportingGroup3, this.reportinggroup4Active).then(() => {
                        this.model.reportinggroup4id = _reportinggroup4id;
                        this.onChangeReportingGroup(ReportingGroupType.ReportingGroup4, this.reportinggroup5Active).then(() => {
                            this.model.reportinggroup5id = _reportinggroup5id;
                            this.onChangeReportingGroup(ReportingGroupType.ReportingGroup5, this.reportinggroup6Active).then(() => {
                                this.model.reportinggroup6id = _reportinggroup6id;
                            });
                        });;
                    });;
                });

            });
        }
        else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
            this.onChangeReportingGroup1();
        }

    }

    checkAssetRegisterIDActive() {
        this.assetService.isAssetRegisterIDActive().then((data) => {
            this.isAssetRegisterIDActive = data;
        });
    }

    goBack() {
        this.location.back();
    }

    checkIsAnyChange() {

        if (
            (this.model.userid === this.oldmodel.userid)
            &&
            (this.model.reportinggroup1id === this.oldmodel.reportinggroup1id)
            &&
            (this.model.reportinggroup2id === this.oldmodel.reportinggroup2id)
            &&
            (this.model.reportinggroup3id === this.oldmodel.reportinggroup3id)
            &&
            (this.model.reportinggroup4id === this.oldmodel.reportinggroup4id)
            &&
            (this.model.reportinggroup5id === this.oldmodel.reportinggroup5id)
            &&
            (this.model.reportinggroup6id === this.oldmodel.reportinggroup6id)
            &&
            (this.model.dateassigned === this.oldmodel.dateassigned)
            &&
            (this.model.note === this.oldmodel.note)
            &&
            (this.model.registerid === this.oldmodel.registerid)
            &&
            (this.model.supplierdescription === this.oldmodel.supplierdescription)
            &&
            (this.model.assetownershipid === this.oldmodel.assetownershipid)
            &&
            (this.model.assetlocationid === this.oldmodel.assetlocationid)
            &&
            (this.model.assetstatusid === this.oldmodel.assetstatusid)
            &&
            (this.model.imei === this.oldmodel.imei)
            &&
            (this.model.serialnumber === this.oldmodel.serialnumber)
            &&
            (this.model.productdescription === this.oldmodel.productdescription)
            &&
            (this.model.dateassigneddisplay === this.oldmodel.dateassigneddisplay)

        ) {
            return false;
        }

        return true;
    }


}