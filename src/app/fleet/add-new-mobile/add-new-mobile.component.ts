import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem, ConfirmationService, AutoCompleteHeaderColumnMeta } from 'primengdevng8/api';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { AccessGroupService } from '../../_services/access-group.service';
import { CustomReuseStrategy } from '../../_common/custom-route-reuse-strategy';
import { String } from '../../_common/utility-method';
import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { NetworkService } from "../../_services/network.service";
import { CTNDetailModel } from "../../_models/ctn-details";
import { ReportingGroupType } from '../../_services/enumtype';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { UserFilter } from '../../_models/user-filter';
import { Tariff } from '../../_models/tariff';
import { TariffService } from '../../_services/tariff.service';
import { GenericService } from '../../_services/generic.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ClientControlEnum, ReportingGroupRelationshipType } from '../../_services/enumtype';;
import { UserService } from '../../_services/user.service';
import { ModalPopupService } from '../../_common/modelpopup.service';

import { RegexExpression } from '../../_common/regex-expression';
import { OrderService } from '../../_services/order/order.service';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { AuthenticationService } from 'src/app/_services/authentication.service';


@Component({
    selector: 'add-new-mobile',
    templateUrl: './add-new-mobile.component.html'
})


export class AddNewMobileComponent implements OnInit {
    private loader: EventEmitter<any>;
    loading: boolean = false;
    isclient: boolean;
    mobilenumberregx: RegExp = RegexExpression.mobilenumber;
    simnumberregex: RegExp = RegexExpression.simnumberCTNUpdate;
    model: CTNDetailModel;

    /* Networks */
    networkArray: SelectItem[];
    benArray: SelectItem[];

    billingPlatformArray: SelectItem[];
    sharedtariffcontorlenabled: boolean;

    /* Tariff */
    tariffArray: SelectItem[];
    /* Status */
    //statusArray: SelectItem[];
    /* Shared Tariff Lead */
    sharedTariffLeadArray: SelectItem[];

    tariffConnectionTypeNetwork: Tariff[];

    reportinggroup1Array: SelectItem[];
    //reportinggroup1guid: string;
    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinhgroup1Required: boolean;

    reportinggroup2Array: SelectItem[];
    //reportinggroup2guid: string;
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinhgroup2Required: boolean;

    reportinggroup3Array: SelectItem[];
    //reportinggroup3guid: string;
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinhgroup3Required: boolean;

    reportinggroup4Array: SelectItem[];
    //reportinggroup4guid: string;
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinhgroup4Required: boolean;
    reportinggroup5Array: SelectItem[];
    //reportinggroup5guid: string;
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinhgroup5Required: boolean;

    reportinggroup6Array: SelectItem[];
    //reportinggroup6guid: string;
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;
    reportinhgroup6Required: boolean;

    userFilterList: UserFilter[];
    searchuserautocompletePlaceHolderText: string;
    filteredname: any;
    vodageminibillingid: number;
    reportingGroupRelationshipType = ReportingGroupRelationshipType;
    userfilterheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: "name", header: 'Name' },
    { field: 'staffid', header: 'StaffID' },
    ];

    @Input() isComponentINPopUp: boolean = false;

    //=========For Update Assign Page======//
    @Input() isUpdateAssignPopUp: boolean = false;
    @Input() oldMobileNumber: string;
    @Input() oldDevice: string;

    //=========For Update Assign Page======//
    labelClass = "col-sm-2";
    autocompleteAppendToTagName: string;
    autoCompleteContainerWidthClass: string;

    reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
    reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
    reportingGroupTypeEnum = ReportingGroupType;

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
        private activeModal: NgbActiveModal,
        private clientcontrolservice: ClientControlService,
        private orderService: OrderService,
        private authService: AuthenticationService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        if (this.isComponentINPopUp) {
            this.labelClass = "col-sm-3";
            this.autocompleteAppendToTagName = "ngb-modal-window";
            this.autoCompleteContainerWidthClass = "modal-body";
        }

        this.model = new CTNDetailModel();
        this.togglecontrol();

        this.getReportingGroupRelationList();
        this.isCascade().then(() => {
            var process1 = this.loadNetworkDropdown();
            var process2 = this.loadReportingGroupList();
            var process3 = this.clientcontrolservice.GetClientControlByKey(ClientControlEnum.ParentChildTariffShare).then(r => {
                this.sharedtariffcontorlenabled = r.active;
            });
            this.loader.emit(Promise.all([process1, process2, process3]));

        });
    }

    ngAfterViewChecked() {
    }

    /**
    * Load the network array for the given company
    */
    loadNetworkDropdown(): Promise<any> {
        this.clearNetworks();
        return this.networkService.getNetworkList(null, null, null).then((data) => {
            if (data != null) {
                if (data.length > 1) {
                    this.networkArray.push({ label: '--Select--', value: null });
                }
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.id
                }));

                if (data.length == 1) {
                    this.model.networkid = this.networkArray[0].value;
                    this.loadBillingPlatformDropDown();
                }
                else {
                    this.model.networkid = null;
                }
            }
        });
    }


    loadbenData() {
        this.clearBens();
        if (this.model.billingplatformid == this.vodageminibillingid) {
            return this.orderService.getBenForNewConnection().then((data) => {
                if (data && data.length) {
                    this.benArray.push({
                        label: 'Select BEN', value: null
                    });
                    data.forEach(item => this.benArray.push({
                        label: item.bendescription, value: item.benid
                    }));
                    if (data.length == 1) {
                        this.model.bendetailid = this.benArray[0].value;
                    }
                    else {
                        this.model.bendetailid = null;
                    }
                }
            });
        }
        else {
            return null;
        }

    }

    clearBens() {
        this.benArray = [];
        this.model.bendetailid = null;
    }
    /**
    * If billing platforms exists for given network, load them.
    */
    loadBillingPlatformDropDown(): Promise<any> {

        this.clearBillingPlatform();
        return this.networkService.getNetworkBillingPlatformsbyid(this.model.networkid).then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.billingPlatformArray.push({
                    label: item.billingplatformdescription, value: item.id
                }));
                this.model.billingplatformid = data[0].id;
                let gemdata = data.filter(c => c.billingplatformdescription.toLowerCase() == 'gemini')[0];
                if (gemdata != undefined) {
                    this.vodageminibillingid = gemdata.id;
                }

            }
            else {
                this.model.billingplatformid = null;
            }
            this.loadbenData();
            this.loadTariffDropdown();
        });
    }


    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.model.billingplatformid = null;
    }

    /**
   * Clears the networks dropdown and selecttion
   */
    clearNetworks() {
        this.networkArray = [];
        this.model.networkid = null;
    }

    /**
     * Load the ctn status array
     */
    //loadCTNStatusList(): Promise<any> {
    //    this.clearCTNStatusList();
    //    return this.genericService.GetCTNStatusList().then((data) => {
    //        if (data != null) {
    //            this.statusArray.push({ label: '--Select--', value: null });
    //            data.forEach(item => this.statusArray.push({
    //                label: item.description, value: item.id
    //            }));
    //        }
    //    });
    //}


    /**
    * Clears the networks dropdown and selecttion
    */
    //clearCTNStatusList() {
    //    this.statusArray = [];
    //    //this.networkguid = null;
    //}

    /**
      * Load the Tariff array for the given company
      */
    loadTariffDropdown(): Promise<any> {
        this.clearTariffDropdown();

        return this.tariffService.BindTariffDropDownByID(true, this.model.networkid, this.model.billingplatformid, undefined).then((data) => {
            if (data != null) {
                this.tariffArray.push({ label: '--Select--', value: null });
                data.forEach(item => this.tariffArray.push({
                    label: item.tariffdescription, value: item.tariffid
                }));

                this.tariffConnectionTypeNetwork = data;
            }
        });
    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearTariffDropdown() {
        this.tariffArray = [];
        this.tariffConnectionTypeNetwork = [];
    }

    /**
    * Clears the sharedtariff dropdown and selecttion
    */
    clearSharedTariffDropdown() {
        this.sharedTariffLeadArray = [];
    }

    /**
   * Clears the connection type selecttion
   */
    clearConnectionType() {
        this.model.connectiontype = null;
        this.model.connectiontypeid = null;
    }

    onChangeNetwork(event: any) {
        if (event != null && event.value != undefined) {
            let networkid = event.value;
            this.loadBillingPlatformDropDown();


        }
        else {
            this.clearTariffDropdown();
            this.clearSharedTariffDropdown();
            this.clearConnectionType();
            this.clearBens();
        }
    }

    onChangeBillingPaltform() {
        this.loadbenData();
        this.loadTariffDropdown();
    }

    onChangeTariff(event: any) {
        if (event != null && event.value != undefined) {
            let tariffid = event.value;


            var tariffConnectionTypeNetwork = this.tariffConnectionTypeNetwork.filter(x => x.tariffid == tariffid)[0];
            if (tariffConnectionTypeNetwork != null) {
                this.model.connectiontype = tariffConnectionTypeNetwork.connectiontypedescription;
                this.model.connectiontypeid = tariffConnectionTypeNetwork.connectiontypeid;
                //todo 
                this.model.tariffguid = tariffConnectionTypeNetwork.tariffguid;
            }
        }
        else {
            this.clearSharedTariffDropdown();
            this.clearConnectionType();
        }

        this.loadSharedTariffNumbers(this.model.tariffguid);
    }

    /**
   * Load the network array for the given company
   */
    loadSharedTariffNumbers(tariffGuid: string): Promise<any> {

        this.clearloadSharedTariff();
        return this.ctnDetailService.getEligibleSharedTariffAsync(null, tariffGuid).then((data) => {
            if (data != null) {
                this.sharedTariffLeadArray.push({ label: '--Select--', value: null });
                data.forEach(item => this.sharedTariffLeadArray.push({
                    label: item.mobilenumber, value: item.ctndetailid
                }));
            }
        });
    }

    /**
   * Clears the shared tariff dropdown and selection
   */
    clearloadSharedTariff() {
        this.sharedTariffLeadArray = [];
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
        if (this.isclient) {
            this.searchuserautocompletePlaceHolderText = "Search by name, staffid, username";
        } else {
            this.searchuserautocompletePlaceHolderText = "Search by name, email";
        }
    }

    loadReportingGroupList(): Promise<any> {


        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                this.reportinggroup1Active = reportinggroup1.active;
                this.reportinggroup1DisplayName = reportinggroup1.displayname;
                this.reportinhgroup1Required = reportinggroup1.isrequired;

                this.loadReportingGroup1Dropdown();
            }
            var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {
                this.reportinggroup2Active = reportinggroup2.active;
                this.reportinggroup2DisplayName = reportinggroup2.displayname;
                this.reportinhgroup2Required = reportinggroup2.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    this.loadReportingGroup2Dropdown();
                }
            }

            var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                this.reportinggroup3Active = reportinggroup3.active;
                this.reportinggroup3DisplayName = reportinggroup3.displayname
                this.reportinhgroup3Required = reportinggroup3.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    this.loadReportingGroup3Dropdown();
                }
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname
                this.reportinhgroup4Required = reportinggroup4.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    this.loadReportingGroup4Dropdown();
                }
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname
                this.reportinhgroup5Required = reportinggroup5.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    this.loadReportingGroup5Dropdown();
                }
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname
                this.reportinhgroup6Required = reportinggroup6.isrequired;

                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    this.loadReportingGroup6Dropdown();
                }

            }

        });

    }

    /**
      * Load the ReportingGroup1 array for the given company
      */
    loadReportingGroup1Dropdown() {
        this.clearReportingGroup1();
        if (this.reportinggroup1Active) {

            return this.reportinggroup1service.getReportingGroup1List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup1Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup1Array.push({
                        label: item.reportinggroup1description, value: item.reportinggroup1id
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
        this.model.reportinggroup1id = null;
    }


    /**
       * Load the ReportingGroup2 array for the given company
       */
    loadReportingGroup2Dropdown() {
        this.clearReportingGroup2();
        if (this.reportinggroup2Active) {

            this.reportinggroup2service.getReportingGroup2List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup2Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.reportinggroup2description, value: item.reportinggroup2id
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
        this.model.reportinggroup2id = null;
    }

    /**
       * Load the ReportingGroup3 array for the given company
       */
    loadReportingGroup3Dropdown() {
        this.clearReportingGroup3();
        if (this.reportinggroup3Active) {

            this.reportinggroup3service.getReportingGroup3List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup3Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.reportinggroup3description, value: item.reportinggroup3id
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
        this.model.reportinggroup3id = null;
    }

    /**
       * Load the ReportingGroup4 array for the given company
       */
    loadReportingGroup4Dropdown() {
        this.clearReportingGroup4();
        if (this.reportinggroup4Active) {

            this.reportinggroup4service.getReportingGroup4List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup4Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.reportinggroup4description, value: item.reportinggroup4id
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
        this.model.reportinggroup4id = null;
    }

    /**
       * Load the ReportingGroup5 array for the given company
       */
    loadReportingGroup5Dropdown() {
        this.clearReportingGroup5();
        if (this.reportinggroup5Active) {

            this.reportinggroup5service.getReportingGroup5List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup5Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.reportinggroup5description, value: item.reportinggroup5id
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
        this.model.reportinggroup5id = null;
    }

    /**
       * Load the ReportingGroup6 array for the given company
       */
    loadReportingGroup6Dropdown() {
        this.clearReportingGroup6();
        if (this.reportinggroup6Active) {

            this.reportinggroup6service.getReportingGroup6List(true).then((data) => {
                if (data != null) {
                    this.reportinggroup6Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.reportinggroup6description, value: item.reportinggroup6id
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
        this.model.reportinggroup6id = null;
    }

    /**
      * save method
      */
    save(form: NgForm) {
        if (this.model != null) {

            let popupHeaderMessage: string = '';
            let controls = null;
            if (this.isUpdateAssignPopUp && !String.isNullOrWhiteSpace(this.model.mobilenumber) && (this.model.mobilenumber != this.oldMobileNumber)) {
                popupHeaderMessage = 'The Mobile Number ' + this.model.mobilenumber + ' is currently allocated to ' + this.filteredname.name + ' this action will reallocate the asset ' + this.oldDevice + ' to ' + this.filteredname.name;
            }

            //============For  Update Asset Add New Mobile Button===
            if (popupHeaderMessage != '') {
                this.confirmationservice.confirm({
                    message: popupHeaderMessage,
                    key: 'modal-confirmation',
                    control: controls,
                    rejectVisible: false,
                    accept: (params: any) => {

                        //   this.model.optionselection = (params != undefined ? params[0] : undefined);

                        //Update Asset and Assign Mobile User To Asset 
                        this.saveCTN(form);
                    }
                });
            }
            else {
                this.saveCTN(form);
            }


        }
    }

    saveCTN(form: NgForm) {

        this.loader.emit(this.ctnDetailService.saveCTNDetails(this.model).subscribe((result:any) => {
            if (result) {

                if (this.isUpdateAssignPopUp) {
                    if (result.success) {
                        //this.clearModel(form);
                        form.resetForm();
                        this.ngOnInit();
                        if (this.isComponentINPopUp) {
                            this.activeModal.close(result.object);
                        }

                    }
                }
                else {
                    this.confirmationservice.confirm({
                        message: result.message,
                        key: (this.isComponentINPopUp ? 'modal-confirmation-dialog' : 'dialog'),
                        rejectVisible: false,
                        accept: () => {
                            if (result.success) {
                                // this.clearModel(form);
                                form.resetForm();
                                this.ngOnInit();
                                if (this.isComponentINPopUp) {
                                    this.activeModal.close(result.object);
                                }

                            }
                        }
                    });
                }
            }
        }));

    }

    diagnose() {
        return JSON.stringify(this.model);
    }


    completeMethodUserAccount(event: any) {

        let query: string;
        if (event === null || event === undefined) {
            query = "chris.spencer@skanska.co.uk";
        }
        else {
            query = event.query
        }
        this.userservice.getUsersByFilter(query).then((data) => {
            this.userFilterList = data;
        });
    }

    onSelectUserAccount(event: any) {
        if (event.id > 0) {
            this.model.userid = event.id;
            this.model.email = event.emailaddress;
            this.model.staffid = event.staffid;
        }
    }

    onClearUserAccount(event: any) {
        this.model.userguid = null;
        this.model.email = null;
        this.model.staffid = null;

    }

    clearModel(form: NgForm) {
        this.model = new CTNDetailModel();
        this.filteredname = null;
        this.clearTariffDropdown();
        this.clearConnectionType();
        this.clearSharedTariffDropdown();
        this.clearBillingPlatform();
        form.resetForm();
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
            //    selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == this.model.reportinggroup6guid)[0];
            //}



            let nextreportingGroupType = reportingGroupType + 1;
            if (selectedReportingGroup && selectedReportingGroup.value && childReportingGroupActive && this.isReportingGroupCascade(nextreportingGroupType).length) {
                this.clearReportingGroupDropDownWhenCascade(reportingGroupType);
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

    clearReportingGroupDropDownWhenDaisyChain(start: number) {
        for (var i = start; i <= 6; i++) {
            this["reportinggroup" + i + "Array"] = [];
            this.model["reportinggroup" + i + "guid"] = null;
            this.model["reportinggroup" + i + "id"] = null;
        }

    }

}