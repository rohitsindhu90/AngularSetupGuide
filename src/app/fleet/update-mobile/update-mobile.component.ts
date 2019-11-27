import { NgForm } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, ConfirmationService, AutoCompleteHeaderColumnMeta, ConfirmationDialogControl } from 'primengdevng8/api';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { NetworkService } from "../../_services/network.service";
import { CTNDetailModel } from "../../_models/ctn-details";
import { ReportingGroupType, FeatureType, CTNStatus, Feature, ClientControlEnum, ReportingGroupRelationshipType } from '../../_services/enumtype';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { MobileFilter } from "../../_models/mobile-filter";
import { UserFilter } from '../../_models/user-filter';
import { UserDetail } from '../../_models/user-detail';
import { Tariff } from '../../_models/tariff';
import { TariffService } from '../../_services/tariff.service';
import { GenericService } from '../../_services/generic.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FeatureRoleRelHierarchicalViewModel, } from '../../_models/features';
import { UserService } from '../../_services/user.service';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { CancellationPACRequestComponent } from './cancellation-pacrequest.component';
import { CTNDetailHistoryViewModel } from "../../_models/ctndetailhistoryviewmodel";
import { UpdateBarsComponent } from './update-bars.component';
import { UnallocateComponent } from './unallocate.component';
import { AddAssetComponent } from '../../asset/addasset/addasset.component';
import { RegexExpression } from '../../_common/regex-expression';
import { AssignAssetComponent } from './assign-asset.component';
import { String } from '../../_common/utility-method';
import { UserMaintenaceComponent } from '../../user/user-maintenance.component'
import { ClientControlService } from '../../_services/clientcontrol.service';
import { OrderService } from '../../_services/order/order.service';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';



@Component({
    selector: 'update-mobile',
    templateUrl: './update-mobile.component.html',
    styles: ['.ui-radiobutton-label{font-weight: normal;  }'],
    
})


export class UpdateMobileComponent implements OnInit {



    private loader: EventEmitter<any>;
    loading: boolean = false;
    isclient: boolean;
    showFields: boolean = false;
    userdetails: UserDetail;
    model: CTNDetailModel;
    currentModel: CTNDetailModel;

    /* Networks */
    networkArray: SelectItem[];
    benArray: SelectItem[];

    featurelinks: FeatureRoleRelHierarchicalViewModel[];

    tariffArray: SelectItem[];
    tariffByNetwork: Tariff[];
    statusArray: any[];

    reportinggroup1Array: SelectItem[];
    //reportinggroup1guid: string;
    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinggroup1Required: boolean;

    reportinggroup2Array: SelectItem[];
    //reportinggroup2guid: string;
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinggroup2Required: boolean;


    reportinggroup3Array: SelectItem[];
    //reportinggroup3guid: string;
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinggroup3Required: boolean;

    reportinggroup4Array: SelectItem[];
    //reportinggroup4guid: string;
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinggroup4Required: boolean;

    reportinggroup5Array: SelectItem[];
    //reportinggroup5guid: string;
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinggroup5Required: boolean;

    reportinggroup6Array: SelectItem[];
    //reportinggroup6guid: string;
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;
    reportinggroup6Required: boolean;


    queryStringParam: any;
    displayLabel: boolean = true;
    filteredMobile: MobileFilter[];
    selectedMobile: any;

    userFilterList: UserFilter[];
    userfilterheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: "name", header: 'Name', width: '30%' },
    { field: 'staffid', header: 'StaffID', width: '30%' },
    { field: 'emailaddress', header: 'Email', width: '40%' }
    ];

    searchuserautocompletePlaceHolderText: string;
    filteredname: UserFilter = new UserFilter();
    currentFilteredname: any;

    gridmodel: CTNDetailHistoryViewModel[] = null;
    historygridcsvfilename: string;

    /* Networks */
    sharedTariffLeadArray: SelectItem[];
    sharedTariffDisplay: boolean = true;
    enable_edit_button: boolean = true;
    simnumberregex: RegExp = RegexExpression.simnumberCTNUpdate;

    mobilenumberheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: "mobilenumber", header: 'Mobile Number' },
    { field: 'staffname', header: 'Staff Name' },
    { field: 'status', header: 'Status' }
    ];
    sharedtariffcontorlenabled: boolean;

    effectivedatearray: SelectItem[];

    reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
    reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
    reportingGroupTypeEnum = ReportingGroupType;
    IsCtnNotesActive: boolean = false;
    IsSpareReallocateActive: boolean = false;
    ctnguid: string = "";
    assignAssetShowID: number;
    isAssignAssetActive: boolean;
    reportingGroupRelationshipType = ReportingGroupRelationshipType;
    isAdminUser: boolean;

    constructor(private globalEvent: GlobalEventsManager,
        private route: ActivatedRoute,
        private router: Router,
        private reportinggroup1service: ReportingGroup1Service,
        private reportinggroup2service: ReportingGroup2Service,
        private reportinggroup3service: ReportingGroup3Service,
        private reportinggroup4service: ReportingGroup4Service,
        private reportinggroup5service: ReportingGroup5Service,
        private reportinggroup6service: ReportingGroup6Service,
        private invoicereportservice: InvoiceReportService,
        private networkService: NetworkService,
        private ctnDetailService: CTNDetailService,
        private userservice: UserService,
        private tariffService: TariffService,
        private genericService: GenericService,
        private modalpopupservice: ModalPopupService,
        private confirmationservice: ConfirmationService,
        private clientcontrolservice: ClientControlService,
        private activeModal: NgbActiveModal,
        private orderService: OrderService,
        private authService: AuthenticationService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loading = false;
        //this.isAdminUser = false;
        this.userdetails = this.authService.currentUserValue;
        //LocalStorageProvider.getUserStorage();
        this.model = new CTNDetailModel();


        this.queryStringParam = this.route.queryParams.subscribe(params => {

            this.ctnguid = params['ctnguid'] || "";
        });

        this.togglecontrol();

        if (this.ctnguid != undefined) {



            let p1 = this.CheckIsSpareReallocateActive();
            let p2 = this.getClientControlByKey();
            this.loader.emit(Promise.all([p1, p2]));

            this.getReportingGroupRelationList().then(() => {
                this.isCascade().then(() => {
                    this.loadReportingGroupList().then(() => {
                        var process = this.ShowCtnNotes();
                        var process1 = this.loadCTNStatusList();
                        //var process2 = this.loadReportingGroupList();
                        var process3 = this.loadCTNDetails(this.ctnguid);
                        var process4 = this.loadEffectiveDate();
                        this.loader.emit(Promise.all([process, process1, process3, process4]));
                    });
                });
            });


            //this.getReportingGroupRelationList().then(() => {
            //    this.isCascade().then(() => {

            //            var process = this.ShowCtnNotes();
            //            var process1 = this.loadCTNStatusList();                        
            //            var process3 = this.loadCTNDetails(ctnguid);
            //            var process4 = this.loadEffectiveDate();
            //            var process6 = this.CheckIsSpareReallocateActive();
            //            this.loader.emit(Promise.all([process, process1, process3, process4, process6]));

            //    });
            //});

        }
    }

    getClientControlByKey() {
        this.clientcontrolservice.GetClientControlByKey(ClientControlEnum.ParentChildTariffShare).then(r => {
            this.sharedtariffcontorlenabled = r.active;
        });
    }
    ngAfterViewChecked() {
    }

    loadEffectiveDate(): Promise<any> {
        return this.genericService.GetEffectiveDate(3).then(data => {
            if (data != null) {
                this.effectivedatearray = [];
                this.effectivedatearray.push({ label: '--Select--', value: null });
                data.forEach(item => this.effectivedatearray.push({
                    label: item.datestring, value: item.datevalue
                }));
            }
        })
    }
    loadFeatures(): Promise<any> {


        return this.userservice.LoadFeatureTreeViewByUserRole(this.userdetails.roleid, this.userdetails.id, this.router.url.split('?')[0], FeatureType.Feature).then(res => {
            this.featurelinks = [];
            let spareStatusFeature: number[] = [Feature.Cancellation, Feature.PACRequest];
            let data = res;
            for (let i = 0; i < data.length; i++) {
                let feature: FeatureRoleRelHierarchicalViewModel = data[i];

                ////in case of live enable all link if access is already there else disable                
                //if (!this.featurelinks[f].data.isreadonly && (CTNStatus.Live == this.model.ctnstatusid)) {
                //    this.featurelinks[f].data.isreadonly = false;

                //}
                //else {
                //    this.featurelinks[f].data.isreadonly = true;
                //}

                if (CTNStatus.Live != this.model.ctnstatusid) {
                    feature.data.isreadonly = true;
                }
                if (!feature.data.isvisibleonly && feature.data.routeurl !== "AssignAsset") {
                    this.featurelinks.push(feature);
                }

                if (feature.data.routeurl == "AssignAsset") {
                    this.assignAssetShowID = feature.data.isvisibleonly ? 1 : (feature.data.isreadonly ? 2 : 3);
                    this.isAssignAssetActive = feature.data.active;
                }
            }
        });
    }

    /**
     * Load the ctn status array
     */
    loadCTNStatusList(): Promise<any> {
        this.clearCTNStatusList();
        return this.genericService.GetCTNStatusList().then((data) => {
            if (data != null) {

                data.forEach(item => this.statusArray.push({
                    label: item.description, value: item.id, isassetdeattach: item.isassetdeattach
                }));
            }
        });
    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearCTNStatusList() {
        this.statusArray = [];
        //this.networkguid = null;
    }

    /**
      * Load the Tariff array for the given company
      */
    loadTariffDropdown(networkid?: number, billingplatformid?: number, currentTariffid?: number): Promise<any> {
        this.clearTariffDropdown();
        return this.tariffService.BindTariffDropDownByID(true, networkid, billingplatformid, currentTariffid).then((data) => {
            if (data != null) {
                this.tariffArray.push({ label: '--Select--', value: null });

                data.forEach(item => this.tariffArray.push({
                    label: item.tariffdescription, value: item.tariffid
                }));

                this.tariffByNetwork = data;

                //this.currentModel.tariffguid = this.currentModel.tariffguid;

            }
        });
    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearTariffDropdown() {
        this.tariffArray = [];
        //this.networkguid = null;
    }

    onChangeTariff(event: any) {
        if (event != null) {
            let tariffid = event.value;
            var selectedTariff = this.tariffByNetwork.filter(x => x.tariffid == tariffid)[0];
            if (selectedTariff != null) {
                this.model.connectiontype = selectedTariff.connectiontypedescription;
                this.model.connectiontypeid = selectedTariff.connectiontypeid;
                this.model.tariff = selectedTariff.tariffdescription;
            }
        }
    }

    onChangeStatus(event: any) {
        if (event != null) {
            let statusID = event.value;

            var selectedStatus = this.statusArray.filter(x => x.value == statusID)[0];
            if (selectedStatus != null) {
                this.model.status = selectedStatus.label;

            }
        }
    }

    onChangeSharedTariff(event: any) {
        if (event != null) {
            let value = event.value;

            var selectedSharedTariff = this.sharedTariffLeadArray.filter(x => x.value == value)[0];
            if (selectedSharedTariff != null) {
                this.model.sharedtariffleadnumber = selectedSharedTariff.label;

            }
        }
    }

    onChangeReportingGroupOLD(event: any, group: string) {
        if (event != null && group) {

            let value = event.value;
            let selectedReportingGroup;

            if (group.toLowerCase() == "reportinggroup1") {
                selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == value)[0];
                this.model.reportinggroup1 = selectedReportingGroup.label;
            }
            if (group.toLowerCase() == "reportinggroup2") {
                selectedReportingGroup = this.reportinggroup2Array.filter(x => x.value == value)[0];
                this.model.reportinggroup2 = selectedReportingGroup.label;
            }
            if (group.toLowerCase() == "reportinggroup3") {
                selectedReportingGroup = this.reportinggroup3Array.filter(x => x.value == value)[0];
                this.model.reportinggroup3 = selectedReportingGroup.label;
            }
            if (group.toLowerCase() == "reportinggroup4") {
                selectedReportingGroup = this.reportinggroup4Array.filter(x => x.value == value)[0];
                this.model.reportinggroup4 = selectedReportingGroup.label;
            }
            if (group.toLowerCase() == "reportinggroup5") {
                selectedReportingGroup = this.reportinggroup5Array.filter(x => x.value == value)[0];
                this.model.reportinggroup6 = selectedReportingGroup.label;
            }
            if (group.toLowerCase() == "reportinggroup6") {
                selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == value)[0];
                this.model.reportinggroup6 = selectedReportingGroup.label;
            }
        }
    }

    /**
   * Load the network array for the given company
   */
    loadSharedTariffNumbers(ctnGuid: string, tariffGuid: string): Promise<any> {

        this.clearloadSharedTariff();
        return this.ctnDetailService.getEligibleSharedTariffAsync(ctnGuid, tariffGuid).then((data) => {
            if (data != null) {
                this.sharedTariffLeadArray.push({ label: '--Select--', value: null });
                data.forEach(item => this.sharedTariffLeadArray.push({
                    label: item.mobilenumber, value: item.ctndetailid
                }));

                var sharedTariffSelectedValue = data.filter(x => x.mobilenumber == this.model.sharedtariffleadnumber)[0];
                if (sharedTariffSelectedValue != null) {
                    this.model.sharedtariffleadid = sharedTariffSelectedValue.ctndetailid;
                    this.currentModel.sharedtariffleadid = sharedTariffSelectedValue.ctndetailid;
                }
            }
        });
    }

    loadUseraccountDropdown(query: string): Promise<any> {
        this.clearUseraccountDropdown();
        return this.userservice.getUsersByFilter(query).then((data) => {
            this.userFilterList = data;
        });
    }

    clearUseraccountDropdown() {
        this.userFilterList = null;

    }

    togglecontrol() {
        //if Admin login, then isclient must be set to false bcz we are hiding and showing the controls for admin and client
        let data = this.authService.currentUserValue;
        //LocalStorageProvider.getUserStorage() as UserDetail;
        this.isclient = data.isclient;
        this.isAdminUser = data.adminuser;
        if (this.isclient) {
            this.searchuserautocompletePlaceHolderText = "Search by name, staffid, username";
        } else {
            this.searchuserautocompletePlaceHolderText = "Search by name, email";
        }
    }

    /**
    * Clears the networks dropdown and selecttion
    */
    clearloadSharedTariff() {
        this.sharedTariffLeadArray = [];
    }

    loadReportingGroupList(): Promise<any> {


        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                this.reportinggroup1Active = reportinggroup1.active;
                this.reportinggroup1DisplayName = reportinggroup1.displayname;
                this.reportinggroup1Required = reportinggroup1.isrequired;

                this.loadReportingGroup1Dropdown();
            }
            var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {
                this.reportinggroup2Active = reportinggroup2.active;
                this.reportinggroup2DisplayName = reportinggroup2.displayname;
                this.reportinggroup2Required = reportinggroup2.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    this.loadReportingGroup2Dropdown();
                }
            }

            var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                this.reportinggroup3Active = reportinggroup3.active;
                this.reportinggroup3DisplayName = reportinggroup3.displayname
                this.reportinggroup3Required = reportinggroup3.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    this.loadReportingGroup3Dropdown();
                }
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname
                this.reportinggroup4Required = reportinggroup4.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    this.loadReportingGroup4Dropdown();
                }
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname
                this.reportinggroup5Required = reportinggroup5.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    this.loadReportingGroup5Dropdown();
                }
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname
                this.reportinggroup6Required = reportinggroup6.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    this.loadReportingGroup6Dropdown();
                }

            }

        });

    }

    /**
      * Load the ReportingGroup1 array for the given company
      */
    loadReportingGroup1Dropdown(): Promise<any> {
        this.clearReportingGroup1();
        if (this.reportinggroup1Active) {
            return this.reportinggroup1service.getReportingGroup1List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup1Array = [];
                    this.reportinggroup1Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup1Array.push({
                        label: item.reportinggroup1description, value: item.reportinggroup1id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup1 and selecttion
    */
    clearReportingGroup1() {
        this.reportinggroup1Array = [];
        this.model.reportinggroup1id = null;
    }


    /**
       * Load the ReportingGroup2 array for the given company
       */
    loadReportingGroup2Dropdown(): Promise<any> {
        this.clearReportingGroup2();
        if (this.reportinggroup2Active) {

            this.reportinggroup2service.getReportingGroup2List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup2Array = [];
                    this.reportinggroup2Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.reportinggroup2description, value: item.reportinggroup2id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup2 and selecttion
    */
    clearReportingGroup2() {
        this.reportinggroup2Array = [];
        this.model.reportinggroup2id = null;
    }

    /**
       * Load the ReportingGroup3 array for the given company
       */
    loadReportingGroup3Dropdown(): Promise<any> {
        this.clearReportingGroup3();
        if (this.reportinggroup3Active) {

            this.reportinggroup3service.getReportingGroup3List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup3Array = [];
                    this.reportinggroup3Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.reportinggroup3description, value: item.reportinggroup3id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup3 and selecttion
    */
    clearReportingGroup3() {
        this.reportinggroup3Array = [];
        this.model.reportinggroup3id = null;
    }

    /**
       * Load the ReportingGroup4 array for the given company
       */
    loadReportingGroup4Dropdown(): Promise<any> {
        this.clearReportingGroup4();
        if (this.reportinggroup4Active) {

            this.reportinggroup4service.getReportingGroup4List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup4Array = [];
                    this.reportinggroup4Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.reportinggroup4description, value: item.reportinggroup4id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup4 and selecttion
    */
    clearReportingGroup4() {
        this.reportinggroup4Array = [];
        this.model.reportinggroup4id = null;
    }

    /**
       * Load the ReportingGroup5 array for the given company
       */
    loadReportingGroup5Dropdown(): Promise<any> {
        this.clearReportingGroup5();
        if (this.reportinggroup5Active) {

            this.reportinggroup5service.getReportingGroup5List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup5Array = [];
                    this.reportinggroup5Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.reportinggroup5description, value: item.reportinggroup5id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup5 and selecttion
    */
    clearReportingGroup5() {
        this.reportinggroup5Array = [];
        this.model.reportinggroup5id = null;
    }

    /**
       * Load the ReportingGroup6 array for the given company
       */
    loadReportingGroup6Dropdown(): Promise<any> {
        this.clearReportingGroup6();
        if (this.reportinggroup6Active) {

            this.reportinggroup6service.getReportingGroup6List(true, this.ctnguid).then((data) => {
                if (data != null) {
                    this.reportinggroup6Array = [];
                    this.reportinggroup6Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.reportinggroup6description, value: item.reportinggroup6id
                    }));
                }
            });
        }
        else {
            return new Promise((resolve: any, reject: any) => { resolve(1); });
        }
    }


    /**
    * Clears the  ReportingGroup6 and selecttion
    */
    clearReportingGroup6() {
        this.reportinggroup6Array = [];
        //this.model.reportinggroup6id = null;
    }

    loadbenData() {
        this.clearBens();
        if (this.model.billingplatform.toLowerCase() == 'gemini') {
            return this.orderService.getBenForNewConnection(this.ctnguid).then((data) => {
                if (data && data.length) {
                    this.benArray.push({
                        label: 'Select BEN', value: null
                    });
                    data.forEach(item => this.benArray.push({
                        label: item.bendescription, value: item.benid
                    }));
                }
            });
        }
        else {
            return null;
        }

    }

    clearBens() {
        this.benArray = [];
    }

    /**
  * Load the ctn details
  */
    loadCTNDetails(ctnGuid: string): Promise<any> {

        return this.ctnDetailService.getCTNDetailByGuid(ctnGuid).then((data) => {
            if (data != null) {
                //this.displayLabel = true;
                this.historygridcsvfilename = data.mobilenumber + "_ChangeLog";

                this.model = data;
                this.currentModel = JSON.parse(JSON.stringify(this.model));


                //this.loadReportingGroupList().then(() => {

                this.loadTariffDropdown(data.networkid, data.billingplatformid, data.tariffid);

                this.filteredMobile = [];
                this.filteredMobile.push({ ctndetailsguid: data.ctndetailsguid, mobilenumber: data.mobilenumber, staffname: data.name, status: data.status } as MobileFilter);
                this.selectedMobile = this.filteredMobile[0];

                this.userFilterList = [];
                this.userFilterList.push({ userguid: data.userguid, name: data.name, staffid: data.staffid, emailaddress: data.email, username: data.username } as UserFilter);
                this.filteredname = this.userFilterList[0];
                this.currentFilteredname = JSON.parse(JSON.stringify(this.filteredname));

                if (!this.model.isalreadyshared) {
                    var ctnGuid = this.model.ctndetailsguid;
                    var tariffGuid = this.model.tariffguid;
                    this.loadSharedTariffNumbers(ctnGuid, tariffGuid);
                    //this.sharedTariffDisplay = false;
                }
                else {
                    this.model.sharedtariffleadnumber = this.model.mobilenumber;
                    this.currentModel.sharedtariffleadnumber = this.currentModel.mobilenumber;
                    this.sharedTariffDisplay = true;
                }

                this.showFields = true;
                //disable edit button in case of client user if status other than (Live or Spare)
                this.toggleEditInformationbutton();
                this.loadFeatures();
                this.loadbenData();
                //change the state to original 
                this.changeControlState(true, true);
                this.loader.emit(this.loadCTNHistory(this.model.ctndetailsguid));

                //});




            }
        });
    }

    toggleEditInformationbutton() {
        let enablecondition: any[] = [CTNStatus.Live];
        if (this.IsSpareReallocateActive) {
            enablecondition.push(CTNStatus.Spare);
        }
        if (!this.userdetails.adminuser && enablecondition.find(x => x == this.model.ctnstatusid) == undefined) {
            this.enable_edit_button = false;
        }
        else {
            this.enable_edit_button = true;
            //==============
            if (this.reportingGroupCascade.IsCasCade) {
                this.loader.emit(this.loadReportingGroupIDsWhenGUIDExist());
            }
        }
    }

    save(form: NgForm) {
        this.loading = true;

        if (!this.checkIsAnyChange()) {

            this.confirmationservice.confirm({
                message: "No Value Change",
                key: 'dialog',
                rejectVisible: false,
                accept: (params: any) => {
                    this.loading = false;
                }
            });

        }
        else {
            if (this.model != null && this.model.ctndetailsguid != undefined) {
                if (this.model.selectedeffectivedate) {
                    let dialogConfig: ConfirmationDialogControl = {
                        multiselect: true, rvalidation: true, msgcss: 'popup-error', controls: []
                    };

                    this.loader.emit(this.ctnDetailService.GetEffectiveDateColumn().then(data => {
                        if (data && data.length > 0) {
                            data.forEach(x => {
                                dialogConfig.controls.push({ value: x.id, text: x.columntext });
                            })
                        }
                        this.confirmationservice.confirm({
                            message: "Please Select the Columns :",
                            key: 'confirmation-dialog-without-icon',
                            control: dialogConfig,
                            rejectVisible: false,
                            accept: (params: any) => {
                                this.model.selectedcolumnids = params;
                                this.loader.emit(this.processCTNUpdate());
                                this.activeModal.dismiss();
                            },
                            reject: () => {
                                this.loading = false;
                            }
                        });

                    }));

                }
                else {
                    this.processCTNUpdate();
                }


            }
        }
    }

    processCTNUpdate() {
        let selectedStatus = this.statusArray.filter(x => x.value == this.model.ctnstatusid)[0];
        if (this.model.assetid > 0) {


            if (selectedStatus.isassetdeattach || (this.model.isemployeeownedasset && (this.model.userid != this.currentModel.userid))) {
                let msg = "This action will remove the asset {0} link with the CTN {1}";
                msg += (this.model.isemployeeownedasset ? " since the asset is employee owned" : "")
                msg += "\n Would you like to continue ?";
                msg = String.Format(msg, [this.model.productname, this.model.mobilenumber]);
                this.confirmationservice.confirm({
                    message: msg,
                    rejectVisible: false,
                    accept: () => {
                        this.updateCTNDetails();
                    },
                    reject: () => {
                        this.loading = false;
                    }
                });

            }
            else if (this.model.userid != this.currentModel.userid) {
                let popupHeaderMessage = '';
                let popupFirstOptionMessage = '';
                let popupSecondOptionMessage = '';
                popupHeaderMessage = 'This mobile has a Device ' + this.model.productname + ' link to it';
                popupFirstOptionMessage = 'Would you like to assign the Mobile number and Device ' + this.model.productname + ' to ' + this.model.name;
                popupSecondOptionMessage = 'Would you like to assign the mobile number to ' + this.model.name + ' and keep the Device with the existing user ' + this.currentModel.name + '.';

                let controls: ConfirmationDialogControl = {
                    multiselect: false, rvalidation: true, controls: [
                        { value: true, text: popupFirstOptionMessage },
                        { value: false, text: popupSecondOptionMessage }
                    ]
                };

                //let msg = "Do you wish to reallocate the asset attached to this device to {0} Name as well?";
                //msg = String.Format(msg, [this.model.name])
                //this.confirmationservice.confirm({
                //    message: msg,
                //    key: "confirmation-dialog",
                //    rejectVisible: true,
                //    accept: (param: any) => {
                //        this.model.assignctnuserwithasset = param;
                //        this.updateCTNDetails();
                //    }
                //});
                if (popupFirstOptionMessage == '' && popupSecondOptionMessage == '') {
                    controls = null;
                }

                if (!(popupFirstOptionMessage == '' && popupSecondOptionMessage == '' && popupHeaderMessage == '')) {
                    let __this = this;
                    setTimeout(function () {
                        __this.confirmationservice.confirm({
                            message: popupHeaderMessage,
                            key: 'confirmation-dialog-without-icon',
                            control: controls,
                            rejectVisible: false,
                            accept: (params: any) => {
                                __this.model.assignctnuserwithasset = params;
                                __this.updateCTNDetails();

                            },
                            reject: () => {
                                __this.loading = false;
                            }
                        })
                    }, 1000);
                }
            }
            else {
                this.updateCTNDetails();
            }
        }
        else {
            this.updateCTNDetails();
        }
    }


    updateCTNDetails() {
        this.loading = false;
        this.loader.emit(this.ctnDetailService.saveCTNDetails(this.model).subscribe((result: any) => {
            if (result) {
                if (result.success) {
                    this.loader.emit(this.loadCTNDetails(this.model.ctndetailsguid).then(r => {
                        this.confirmationservice.confirm({
                            message: result.message,
                            key: 'dialog',
                            rejectVisible: false
                            //accept: () => {

                            //}
                        });
                    }));
                }

            }
        }));
    }
    refreshData() {
        this.loader.emit(this.loadCTNDetails(this.model.ctndetailsguid));
    }
    changeControlState(value: any, benendrefresh: boolean = false, isLoadDropDown: boolean = false) {

        //this.loadCTNDetails(this.model.ctndetailsguid);
        this.displayLabel = value;
        if (!this.displayLabel && !this.model.isalreadyshared) {
            this.sharedTariffDisplay = false;
        }
        else {
            this.sharedTariffDisplay = true;
            if (!benendrefresh) {
                this.model = JSON.parse(JSON.stringify(this.currentModel));
                this.filteredname = JSON.parse(JSON.stringify(this.currentFilteredname));
            }
        }
        this.model = JSON.parse(JSON.stringify(this.currentModel));
        if (isLoadDropDown) {
            this.model = JSON.parse(JSON.stringify(this.currentModel));
            //this.onChangeReportingGroup1();
            //this.model.reportinggroup2id = this.currentModel.reportinggroup2id;
            //this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup2, this.reportinggroup3Active).then;
            //this.model.reportinggroup3id = this.currentModel.reportinggroup3id;
            //this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup3, this.reportinggroup4Active);
            //this.model.reportinggroup4id = this.currentModel.reportinggroup4id;
            //this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup4, this.reportinggroup5Active);
            //this.model.reportinggroup5id = this.currentModel.reportinggroup5id;
            //this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup5, this.reportinggroup6Active);
            //this.model = JSON.parse(JSON.stringify(this.currentModel));
            this.loadReportingGroupIDsWhenGUIDExist();
        }
    }

    filterMobile(event: any) {
        return this.ctnDetailService.getMobileByFilter(event.query).then(data => {
            this.filteredMobile = data;
        });
    }

    handleSelectClick(event: any) {
        if (event.ctndetailsguid != undefined) {
            let ctndetailsguid = event.ctndetailsguid;
            this.loader.emit(this.loadCTNDetails(ctndetailsguid));
        }
        else {
            this.model = new CTNDetailModel();
            this.currentModel = new CTNDetailModel();;
        }
    }

    completeMethodUserAccount(event: any) {

        let query: string;
        query = event.query

        this.userservice.getUsersByFilter(query, this.currentModel.userid).then((data) => {
            this.userFilterList = data;
        });
    }

    onSelectUserAccount(event: any) {
        if (event.id > 0) {
            this.model.userid = event.id;
            this.model.userguid = event.userguid;
            this.model.email = event.emailaddress;
            this.model.staffid = event.staffid;
            this.model.name = event.name;
        }
    }

    onClearUserAccount(event: any) {
        this.model.userid = null;
        this.model.userguid = null;
        this.model.email = null;
        this.model.staffid = null;
        this.model.name = null;
    }

    onClearMobile(event: any) {
        this.model = new CTNDetailModel();
        this.currentModel = new CTNDetailModel();
        this.showFields = false;
    }

    handleLinkClick(featurename: string, route: string) {
        if (route.toLowerCase() == Feature[Feature.Cancellation].toLowerCase() || route.toLowerCase() == Feature[Feature.PACRequest].toLowerCase()) {
            let params: any = { ctnguid: this.model.ctndetailsguid, componentname: featurename };
            this.openModalPopup(<any>CancellationPACRequestComponent, featurename, params);
        }
        else if (route.toLowerCase() == Feature[Feature.UpdateBars].toLowerCase()) {
            let params: any = { ctnguid: this.model.ctndetailsguid, componentname: featurename };
            this.openModalPopup(<any>UpdateBarsComponent, featurename, params);
        }
        else if (route.toLowerCase() == Feature[Feature.Unallocate].toLowerCase()) {
            let params: any = { ctnguid: this.model.ctndetailsguid, componentname: featurename };
            this.openModalPopup(<any>UnallocateComponent, featurename, params);
        }
    }

    openModalPopup(comp: Component, title: string, params?: any) {
        this.modalpopupservice.displayViewInPopup(title, comp, params, "lg").result.then(res => {
            if (res) {
                this.refreshData();
            }
        });
    }

    loadCTNHistory(ctnGuid: string): Promise<any> {
        return this.ctnDetailService.getCTNHistory(ctnGuid).then(data => {
            this.gridmodel = data;
        });
    }

    addAndAssignPopUpClick() {
        let params: any = { ctndetailguid: this.model.ctndetailsguid, componentname: "Add and Assign", isComponentINPopUp: true };
        this.openModalPopup(<any>AddAssetComponent, "Add and Assign Asset", params);
    }


    assignAssetClickEvent() {

        let featurename: string = "Assign Asset";
        let params: any = { ctnguid: this.model.ctndetailsguid, ctnusername: this.model.name, componentname: featurename };
        this.openModalPopup(<any>AssignAssetComponent, featurename, params);

    }

    onAddNewUser() {
        let params: any = { isComponentINPopUp: true, componentname: "Add New User", isAddnewuserDisabled: true, addnewuser: true };
        // this.openModalPopup(<any>UserMaintenaceComponent, "Add New User", params);
        this.modalpopupservice.displayViewInPopup("Add New User", <any>UserMaintenaceComponent, params, "lg").result.then(res => {
            if (res) {

                this.filteredname = new UserFilter();
                this.filteredname.staffid = res.staffid;
                this.filteredname.name = res.name;
                this.filteredname.userguid = res.userguid;
                let event = { id: res.id, userguid: res.userguid, emailaddress: res.emailaddress, staffid: res.staffid };
                this.onSelectUserAccount(event);

                this.completeMethodUserAccount({ query: res.staffid });
            };
        });
    }

    isCascade(): Promise<any> {
        return this.clientcontrolservice.IsReportingGroupCascade().then((data) => {
            this.reportingGroupCascade = { IsCasCade: null, CascadeValue: null };
            this.reportingGroupCascade.IsCasCade = data.iscascade;
            this.reportingGroupCascade.CascadeValue = data.cascadevalue;
        });
    }

    isReportingGroupCascade(id: number): ReportingGroupRelMasterModel[] {
        return this.reportingGroupRelMasterArray.filter(x => x.childrportinggroupid == id);
    }

    getReportingGroupRelationList() {
        return this.genericService.GetReportingGroupRelationList().then((data) => {
            this.reportingGroupRelMasterArray = data;
        });
    }

    onChangeReportingGroup1(): Promise<any> {
        //manish
        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
            let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1id)[0];
            this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
            if (selectedReportingGroup.value) {

                if (this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                }

                if (this.reportinggroup3Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.value);
                }

                if (this.reportinggroup4Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.value);
                }
                if (this.reportinggroup5Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.value);
                }
                if (this.reportinggroup6Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.value);
                }
            }

        }
        else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

            let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1id)[0];
            this.clearReportingGroupDropDownWhenDaisyChain(2);
            if (selectedReportingGroup.value && this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                //this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
                return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
            }
            else {
                return new Promise((resolve: any, reject: any) => { resolve(1); });
            }

        }

        return new Promise((resolve: any, reject: any) => { resolve(1); });

    }


    onChangeReportingGroup(reportingGroupType: number, childReportingGroupActive: boolean): Promise<any> {

        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {
            let selectedReportingGroup: SelectItem;
            if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
                selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1id)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(2);
            }
            else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {
                selectedReportingGroup = this.reportinggroup2Array.filter(x => x.value == this.model.reportinggroup2id)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(3);
            }
            else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
                selectedReportingGroup = this.reportinggroup3Array.filter(x => x.value == this.model.reportinggroup3id)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(4);
            }

            else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
                selectedReportingGroup = this.reportinggroup4Array.filter(x => x.value == this.model.reportinggroup4id)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(5);
            }
            else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
                selectedReportingGroup = this.reportinggroup5Array.filter(x => x.value == this.model.reportinggroup5id)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(6);
            }
            //else if (reportingGroupType=== ReportingGroupType.ReportingGroup6) {
            //    selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == this.model.reportinggroup6id)[0];
            //}



            let nextreportingGroupType = reportingGroupType + 1;
            if (selectedReportingGroup && selectedReportingGroup.value && childReportingGroupActive && this.isReportingGroupCascade(nextreportingGroupType).length) {
                //this.clearReportingGroupDropDownWhenCascade(reportingGroupType);
                return this.loadCascadeReportingGroupDropdown(nextreportingGroupType, selectedReportingGroup.value);
            }

            else {
                return new Promise((resolve: any, reject: any) => { resolve(1); });
            }

        }
        return new Promise((resolve: any, reject: any) => { resolve(1); });
    }




    loadCascadeReportingGroupDropdown(childRportingGroupId: number, parentReportingGroupRecordId: number): Promise<any> {


        return this.genericService.GetReportingGroupListByChildRportingGroupId(childRportingGroupId, parentReportingGroupRecordId, true).then((data) => {
            if (data != null) {

                if (childRportingGroupId === ReportingGroupType.ReportingGroup2) {

                    this.reportinggroup2Array = [];
                    this.reportinggroup2Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.description, value: item.id
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup3) {
                    this.reportinggroup3Array = [];
                    this.reportinggroup3Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.description, value: item.id
                    }));
                }

                else if (childRportingGroupId === ReportingGroupType.ReportingGroup4) {
                    this.reportinggroup4Array = [];
                    this.reportinggroup4Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.description, value: item.id
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup5) {
                    this.reportinggroup5Array = [];
                    this.reportinggroup5Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.description, value: item.id
                    }));
                }
                else if (childRportingGroupId === ReportingGroupType.ReportingGroup6) {
                    this.reportinggroup6Array = [];
                    this.reportinggroup6Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.description, value: item.id
                    }));
                }

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



    loadReportingGroupIDsWhenGUIDExist() {
        let _reportinggroup1id = this.model.reportinggroup1id;
        let _reportinggroup2id = this.model.reportinggroup2id;
        let _reportinggroup3id = this.model.reportinggroup3id;
        let _reportinggroup4id = this.model.reportinggroup4id;
        let _reportinggroup5id = this.model.reportinggroup5id;
        let _reportinggroup6id = this.model.reportinggroup6id;
        //manish
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

    ShowCtnNotes(): Promise<any> {
        return this.ctnDetailService.ShowCtnNotes().then((data) => {
            this.IsCtnNotesActive = data;
        });
    }

    CheckIsSpareReallocateActive(): Promise<any> {
        return this.ctnDetailService.CheckIsSpareReallocateActive().then((data) => {
            this.IsSpareReallocateActive = data;
        });
    }

    clearReportingGroupDropDownWhenDaisyChain(start: number) {
        for (var i = start; i <= 6; i++) {
            this["reportinggroup" + i + "Array"] = [];
            this.model["reportinggroup" + i + "guid"] = null;
            this.model["reportinggroup" + i + "id"] = null;
        }

    }



    checkIsAnyChange() {

        if (
            (this.model.userid === this.currentModel.userid)
            &&
            (this.model.reportinggroup1id === this.currentModel.reportinggroup1id)
            &&
            (this.model.reportinggroup2id === this.currentModel.reportinggroup2id)
            &&
            (this.model.reportinggroup3id === this.currentModel.reportinggroup3id)
            &&
            (this.model.reportinggroup4id === this.currentModel.reportinggroup4id)
            &&
            (this.model.reportinggroup5id === this.currentModel.reportinggroup5id)
            &&
            (this.model.reportinggroup6id === this.currentModel.reportinggroup6id)
            &&
            (this.model.simnumber === this.currentModel.simnumber)
            &&
            (this.model.bendetailid == this.currentModel.bendetailid)
            &&
            (this.model.tariffid == this.currentModel.tariffid)
            &&
            (this.model.status == this.currentModel.status)
            &&
            (this.model.selectedeffectivedate == this.currentModel.selectedeffectivedate)
            &&
            (this.model.note == this.currentModel.note)

        ) {
            return false;
        }

        return true;
    }

}