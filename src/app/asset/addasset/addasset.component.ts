import { Component, OnInit, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectItem, ConfirmationService, AutoCompleteHeaderColumnMeta } from 'primengdevng8/api';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { AssetService } from '../../_services/asset.service';
import { UserService } from '../../_services/user.service';
import { ProductLibraryService } from '../../_services/admin/productlibrary.service';
import { AssetSupplierService } from '../../_services/assetsupplier.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { UserFilter } from '../../_models/user-filter';
import { AddAsset } from '../../_models/asset/addasset';
import { MobileFilter } from "../../_models/mobile-filter";
import { CTNDetailModel } from "../../_models/ctn-details";
import { RegexExpression } from '../../_common/regex-expression';
import { AddNewMobileComponent } from '../../fleet/add-new-mobile/add-new-mobile.component'
import { UserMaintenaceComponent } from '../../user/user-maintenance.component';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { GenericService } from '../../_services/generic.service';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ReportingGroupType, ReportingGroupRelationshipType } from '../../_services/enumtype';


@Component({

    templateUrl: './addasset.component.html'
})
export class AddAssetComponent implements OnInit {

    private loader: EventEmitter<any>;
    isclient: boolean;
    @Input() mobilenumber: string;
    @Input() ctndetailguid: string;
    //===========Hide Few Controls On Add And Assign Asse Page Pop Up;
    // isHideControls: boolean = false;
    decimalregx: RegExp = RegexExpression.decimal;
    model: AddAsset;
    productLibraryArray: SelectItem[];
    assetsupplierArray: SelectItem[];
    assetownershiparray: SelectItem[];
    ctndetailsarray: SelectItem[];
    userFilterList: UserFilter[];
    searchuserautocompletePlaceHolderText: string;
    userFilter: UserFilter = new UserFilter();

    mobileFilterList: MobileFilter[];
    mobileFilter: MobileFilter = new MobileFilter();

    reportinggroup1Array: SelectItem[];
    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinhgroup1Required: boolean;

    reportinggroup2Array: SelectItem[];
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinhgroup2Required: boolean;

    reportinggroup3Array: SelectItem[];
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinhgroup3Required: boolean;

    reportinggroup4Array: SelectItem[];
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinhgroup4Required: boolean;

    reportinggroup5Array: SelectItem[];
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinhgroup5Required: boolean;

    reportinggroup6Array: SelectItem[];
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;
    reportinhgroup6Required: boolean;

    ShowPOAgainstAssetActive: boolean;
    selectedCTNDetail: CTNDetailModel;
    error: string;

    mobilenumberheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: "mobilenumber", header: 'Mobile Number' },
    { field: 'staffname', header: 'Staff Name' },
    { field: 'status', header: 'Status' }
    ];

    userfilterheadermeta: AutoCompleteHeaderColumnMeta[];

    labelClass = "col-sm-2";


    reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
    reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
    reportingGroupTypeEnum = ReportingGroupType;
    reportingGroupRelationshipType = ReportingGroupRelationshipType;
    isAssetRegisterIDActive: boolean;
    @Input() isComponentINPopUp: boolean = false;

    constructor(
        private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private userService: UserService,
        private productLibraryService: ProductLibraryService,
        private assetSupplierService: AssetSupplierService,
        private reportinggroup1service: ReportingGroup1Service,
        private reportinggroup2service: ReportingGroup2Service,
        private reportinggroup3service: ReportingGroup3Service,
        private reportinggroup4service: ReportingGroup4Service,
        private reportinggroup5service: ReportingGroup5Service,
        private reportinggroup6service: ReportingGroup6Service,
        private invoicereportservice: InvoiceReportService,
        private ctnDetailService: CTNDetailService,
        private confirmationservice: ConfirmationService,
        private modalPopupService: ModalPopupService,
        private cdRef: ChangeDetectorRef,
        private activeModal: NgbActiveModal,
        private genericService: GenericService,
        private clientcontrolservice: ClientControlService,
        private authService: AuthenticationService) {

        this.loader = globalEvent.busySpinner;

    }


    ngOnInit() {
        this.model = new AddAsset();
        this.selectedCTNDetail = new CTNDetailModel();
        this.togglecontrol();
        //var p1 = this.loadProductLibraryDropdown();
        //var p2 = this.loadAssetSupplierDropdown();
        //var p3 = this.loadAssetownershipDropdown();
        //var p4 = this.loadReportingGroupList();
        //var p5 = this.IsShowPOAgainstAssetActive();
        var p6 = this.getReportingGroupRelationList();
        //var p7 = this.isCascade();


        this.loader.emit(Promise.all([this.getReportingGroupRelationList()]).then((data) => { this.loader.emit(Promise.all([this.isCascade()])) }).then((data) => {
            let p1 = this.loadProductLibraryDropdown();
            let p2 = this.loadAssetSupplierDropdown();
            let p3 = this.loadAssetownershipDropdown();
            let p4 = this.loadReportingGroupList();
            let p5 = this.IsShowPOAgainstAssetActive();
            let p6 = this.checkAssetRegisterIDActive();

            this.loader.emit(
                Promise.all([p1, p2, p3, p4, p5, p6])
            )
        }));

        //this.loader.emit(Promise.all([p1, p2, p3, p4, p5, p6, p7]));
        this.model.purchasedate = new Date();
        this.isAddAssignPopUp();

    }

    getReportingGroupRelationList(): Promise<any> {
        return this.genericService.GetReportingGroupRelationList().then((data) => {
            this.reportingGroupRelMasterArray = data;
        });
    }

    isCascade(): Promise<any> {
        return this.clientcontrolservice.IsReportingGroupCascade().then((data) => {
            this.reportingGroupCascade = { IsCasCade: null, CascadeValue: null };
            this.reportingGroupCascade.IsCasCade = data.iscascade;
            this.reportingGroupCascade.CascadeValue = data.cascadevalue;
        });
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    IsShowPOAgainstAssetActive() {
        this.assetService.IsShowPOAgainstAssetActive().then((data) => {
            this.ShowPOAgainstAssetActive = data;
        });
    }

    checkAssetRegisterIDActive() {
        this.assetService.isAssetRegisterIDActive().then((data) => {
            this.isAssetRegisterIDActive = data;
        });
    }

    loadProductLibraryDropdown(): Promise<any> {
        this.clearProductLibraryDropdown();
        this.productLibraryArray.push({ label: '--Select--', value: null });

        return this.productLibraryService.GetProductLibraryList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.productLibraryArray.push({
                    label: item.productdescription, value: item.productid
                }));
            }
        });
    }

    clearProductLibraryDropdown() {
        this.productLibraryArray = [];

    }

    loadAssetSupplierDropdown(): Promise<any> {
        this.clearAssetSupplierDropdown();
        this.assetsupplierArray.push({ label: '--Select--', value: null });

        return this.assetSupplierService.GetSuppliersList(true).then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.assetsupplierArray.push({
                    label: item.supplierdescription, value: item.supplierguid
                }));
            }
        });
    }

    clearAssetSupplierDropdown() {
        this.assetsupplierArray = [];

    }


    loadAssetownershipDropdown(): Promise<any> {
        this.clearAssetownershipDropdown();
        this.assetownershiparray.push({ label: '--Select--', value: null });

        return this.assetService.GetOwnershipList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.assetownershiparray.push({
                    label: item.assetownershipdescription, value: item.assetownershipid
                }));
            }
        });
    }

    clearAssetownershipDropdown() {
        this.assetownershiparray = [];

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
                this.reportinggroup3DisplayName = reportinggroup3.displayname;
                this.reportinhgroup3Required = reportinggroup3.isrequired;
                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    this.loadReportingGroup3Dropdown();
                }
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname;
                this.reportinhgroup4Required = reportinggroup4.isrequired;
                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    this.loadReportingGroup4Dropdown();
                }
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname;
                this.reportinhgroup5Required = reportinggroup5.isrequired;
                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    this.loadReportingGroup5Dropdown();
                }
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname;
                this.reportinhgroup6Required = reportinggroup6.isrequired;
                if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
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

            return this.reportinggroup1service.getReportingGroup1List(true).then((data) => {
                this.clearReportingGroup1();
                if (data != null) {
                    this.reportinggroup1Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup1Array.push({
                        label: item.reportinggroup1description, value: item.reportinggroup1guid
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

            this.reportinggroup2service.getReportingGroup2List(true).then((data) => {
                this.clearReportingGroup2();
                if (data != null) {
                    this.reportinggroup2Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.reportinggroup2description, value: item.reportinggroup2guid
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

            this.reportinggroup3service.getReportingGroup3List(true).then((data) => {
                this.clearReportingGroup3();
                if (data != null) {
                    this.reportinggroup3Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.reportinggroup3description, value: item.reportinggroup3guid
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

            this.reportinggroup4service.getReportingGroup4List(true).then((data) => {
                this.clearReportingGroup4();
                if (data != null) {
                    this.reportinggroup4Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.reportinggroup4description, value: item.reportinggroup4guid
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

            this.reportinggroup5service.getReportingGroup5List(true).then((data) => {
                this.clearReportingGroup5();
                if (data != null) {
                    this.reportinggroup5Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.reportinggroup5description, value: item.reportinggroup5guid
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

            this.reportinggroup6service.getReportingGroup6List(true).then((data) => {
                this.clearReportingGroup6();
                if (data != null) {
                    this.reportinggroup6Array.push({ label: '--Select--', value: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.reportinggroup6description, value: item.reportinggroup6guid
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

    togglecontrol() {
        //if Admin login, then isclient must be set to false bcz we are hiding and showing the controls for admin and client
        let data = this.authService.currentUserValue;

        this.isclient = !data.adminuser;
        this.userfilterheadermeta = [{ field: "name", header: 'Name' }];
        if (this.isclient) {
            this.searchuserautocompletePlaceHolderText = "Search by name,staffid,username";
            this.userfilterheadermeta.push({ field: 'username', header: 'User Name' });


        } else {
            this.searchuserautocompletePlaceHolderText = "Search by name,email";
            this.userfilterheadermeta.push({ field: 'emailaddress', header: 'Email' });
        }
    }

    completeMethodUserAccount(event: any) {

        let query: string;
        //if (event === null || event === undefined) {
        //    query = "chris.spencer@skanska.co.uk";
        //}
        //else {
        query = event.query
        //}
        this.userService.getUsersByFilter(query).then((data) => {
            this.userFilterList = data;
        });
    }

    onSelectUserAccount(event: any) {

        //if (event.id > 0) {
        // this.filteredname = "";mobileFilterList
        // this.model.name = event.name;
        this.model.userguid = event.userguid;
        this.model.email = event.emailaddress;
        this.model.staffid = event.staffid;
        ////
        // }

        this.model.dateassigned = new Date();

    }

    onClearUserAccount(event: any) {

        this.model.userguid = null;
        this.model.email = null;
        this.model.staffid = null;
        this.model.dateassigned = null;

    }

    completeMethodMobile(event: any) {
        return this.ctnDetailService.getMobileByFilter(event.query, true).then(data => {
            this.mobileFilterList = data;
        });
    }

    onSelectMobile(event: any) {
        if (event.ctndetailsguid != undefined) {
            this.loader.emit(this.loadCTNDetails(event.ctndetailsguid));
        }
        else {
            this.model = null;
        }
    }
    /**
 * Load the ctn details
 */
    loadCTNDetails(ctnGuid: string): Promise<any> {
        // let data: any;
        return this.ctnDetailService.getCTNDetailByGuid(ctnGuid).then((data) => {
            if (data != null) {
                this.selectedCTNDetail = data;
                this.setCTNValueInModel(data);
            }
        });
    }

    setCTNValueInModel(data: any) {
        let __this = this;
        __this.model.ctndetailguid = data.ctndetailsguid;
        __this.model.simnumber = data.simnumber;
        __this.model.reportinggroup1guid = data.reportinggroup1guid;

        if (this.reportingGroupCascade.IsCasCade) {

            this.onChangeReportingGroup1().then((item1) => {
                __this.model.reportinggroup2guid = data.reportinggroup2guid;
            }).then((item2) => {
                this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup2, this.reportinggroup3Active).then((item3) => {
                    __this.model.reportinggroup3guid = data.reportinggroup3guid;
                }).then((item4) => {
                    this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup3, this.reportinggroup4Active).then((item5) => {
                        __this.model.reportinggroup4guid = data.reportinggroup4guid;
                    })
                }).then((item6) => {
                    this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup4, this.reportinggroup5Active).then((item7) => {

                        __this.model.reportinggroup5guid = data.reportinggroup5guid;
                    })
                }).then((item8) => {
                    this.onChangeReportingGroup(this.reportingGroupTypeEnum.ReportingGroup5, this.reportinggroup6Active).then((item9) => {

                        __this.model.reportinggroup6guid = data.reportinggroup6guid;
                    })
                });
            })
        }
        else {
            __this.model.reportinggroup2guid = data.reportinggroup2guid;
            __this.model.reportinggroup3guid = data.reportinggroup3guid;
            __this.model.reportinggroup4guid = data.reportinggroup4guid;
            __this.model.reportinggroup5guid = data.reportinggroup5guid;
            __this.model.reportinggroup6guid = data.reportinggroup6guid;
        }

        __this.model.email = data.email;
        __this.model.staffid = data.staffid;
        __this.model.userguid = data.userguid;
        //===Set Value for USer AutoComplete 
        __this.userFilter = new UserFilter();
        __this.userFilter.staffid = data.staffid;
        __this.userFilter.name = data.name;
        __this.userFilter.userguid = data.userguid;
        __this.model.dateassigned = new Date();
    }

    clearModelMobile(event: any) {

        //  this.model.simnumber = null;
        //this.model.ctndetailguid = null;
        this.clearModelValues();
    }


    onlyNumberKey(event: any) {
        return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
    }

    imeiOnBlur(event: any) {

        if (this.model.imei === "" || this.model.imei === null) {
            //Clear Values IF CTN Is Selected by User;
            if (this.model.ctndetailguid) {
                this.clearModelValues();
            }

        }
        ////=========Should be Remove Below Code
        //this.mobileFilter = new MobileFilter();
        //this.mobileFilter.mobilenumber = '0444544545';
        //this.mobileFilter.ctndetailsguid = 'vmnndfgndfg';
    }

    clearModelValues() {
        this.mobileFilter = null;
        this.model.ctndetailguid = null;
        this.model.simnumber = null;
        this.model.reportinggroup1guid = null;
        this.model.reportinggroup2guid = null;
        this.model.reportinggroup3guid = null;
        this.model.reportinggroup4guid = null;
        this.model.reportinggroup5guid = null;
        this.model.reportinggroup6guid = null;

        this.userFilter = new UserFilter();

        this.model.userguid = null;
        this.model.email = null;
        this.model.staffid = null;
        this.model.dateassigned = null;



    }

    save(form: NgForm) {
        this.model.productdescription = this.productLibraryArray.filter(a => a.value == this.model.productid)[0].label;
        if (this.selectedCTNDetail.userguid && this.selectedCTNDetail.productname) {
            let msg = 'The mobile number ' + this.selectedCTNDetail.mobilenumber + ' number is currently allocated to ' + this.selectedCTNDetail.name;
            if (this.selectedCTNDetail.productname) {
                msg = msg + ', ' + this.selectedCTNDetail.productname;
            }
            msg = msg + ' - do you want to reallocate it to ' + this.selectedCTNDetail.name;
            if (this.model.productid) {
                msg = msg + ',' + this.productLibraryArray.filter(a => a.value == this.model.productid)[0].label + '?'
            }

            this.modalPopupService.openConfirmationPopup("Confirmation:", msg).result.then((res: any) => {
                if (res) {

                    this.saveAsset(form);
                }
                else {

                }
            })


        }
        else {
            this.saveAsset(form);
        }


    }

    saveAsset(form: NgForm) {

        this.loader.emit(this.assetService.addAsset(this.model).subscribe((result: any) => {
            if (result) {
                if (this.ctndetailguid) {

                    if (result.success) {
                        var message = "Update Successful";
                        this.activeModal.close(result.success);

                        this.confirmationservice.confirm({
                            message: message,
                            key: 'dialog',
                            rejectVisible: false,
                        });
                    }
                    else {
                        this.error = result.message;
                    }
                }
                else {
                    this.confirmationservice.confirm({
                        message: result.message,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result.success) {
                                form.resetForm();
                                this.ngOnInit();

                                //this.model = new AddAsset();
                                //this.model.purchasedate = new Date();

                            }
                        }
                    });
                }
            }
        }));
    }

    isAddAssignPopUp() {

        if (this.ctndetailguid) {
            this.model.ctndetailguid = this.ctndetailguid;
            //this.isHideControls = true;
            this.model.isaddandassignasset = true;
            this.labelClass = "col-sm-3";
            this.loader.emit(this.loadCTNDetails(this.ctndetailguid));
        }

    }

    //openModalPopup(comp: Component, title: string, params?: any) {
    //    this.modalPopupService.displayViewInPopup(title, comp, params, "lg").result.then(res => {
    //        if (res) {
    //            this.selectedCTNDetail.mobilenumber = res.mobilenumber;
    //            this.selectedCTNDetail.ctndetailsguid = res.ctndetailsguid;
    //            this.refreshData();
    //        }
    //    });
    //}

    //refreshData() {
    //    // if (this.mobileFilter != null) {
    //    //  this.mobileFilter.mobilenumber = this.selectedCTNDetail.mobilenumber;
    //    // }
    //    // else {
    //    this.mobileFilter = new MobileFilter();
    //    this.mobileFilter.mobilenumber = this.selectedCTNDetail.mobilenumber;
    //    //}

    //    this.loader.emit(this.loadCTNDetails(this.selectedCTNDetail.ctndetailsguid));
    //}
    onAddNewMobile() {
        let params: any = { isComponentINPopUp: true, componentname: "Add New Mobile" };
        this.modalPopupService.displayViewInPopup("Add New Mobile", <any>AddNewMobileComponent, params, "lg").result.then(res => {
            if (res) {
                this.selectedCTNDetail.mobilenumber = res.mobilenumber;
                this.selectedCTNDetail.ctndetailsguid = res.ctndetailsguid;
                //this.refreshData();

                this.mobileFilter = new MobileFilter();
                this.mobileFilter.mobilenumber = this.selectedCTNDetail.mobilenumber;
                //}

                this.loader.emit(this.loadCTNDetails(this.selectedCTNDetail.ctndetailsguid));

                this.completeMethodMobile({ query: res.mobilenumber });
            }
        });
        // this.openModalPopup(AddNewMobileComponent, "Add New Mobile", params);
    }
    onAddNewUser() {
        let params: any = { isComponentINPopUp: true, componentname: "Add New User", isAddnewuserDisabled: true, addnewuser: true };
        //this.openModalPopup(UserMaintenaceComponent, "Add New User", params);
        this.modalPopupService.displayViewInPopup("Add New User", <any>UserMaintenaceComponent, params, "lg").result.then(res => {
            if (res) {

                this.userFilter = new UserFilter();
                this.userFilter.staffid = res.staffid;
                this.userFilter.name = res.name;
                this.userFilter.userguid = res.userguid;
                let event = { userguid: res.userguid, emailaddress: res.emailaddress, staffid: res.staffid };
                this.onSelectUserAccount(event);

                this.completeMethodUserAccount({ query: res.staffid });
            };
        });
    }

    onChangeReportingGroup1(): Promise<any> {

        if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
            let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
            this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
            if (selectedReportingGroup.value) {

                if (this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                }

                if (this.reportinggroup3Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.value);
                }

                if (this.reportinggroup4Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.value);
                }
                if (this.reportinggroup5Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.value);
                }
                if (this.reportinggroup6Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
                    //this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.value);
                    this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.value);
                }
            }

        }
        else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

            let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
            this.clearReportingGroupDropDownWhenDaisyChain(2);
            if (selectedReportingGroup.value && this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
                // this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
                // return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
                return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.value);
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
            let selectedReportingGroup: SelectItem;
            if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
                value = ReportingGroupType.ReportingGroup1;
                selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(2);
            }
            else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {
                value = ReportingGroupType.ReportingGroup2;
                selectedReportingGroup = this.reportinggroup2Array.filter(x => x.value == this.model.reportinggroup2guid)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(3);
            }
            else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
                value = ReportingGroupType.ReportingGroup3;
                selectedReportingGroup = this.reportinggroup3Array.filter(x => x.value == this.model.reportinggroup3guid)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(4);
            }

            else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
                value = ReportingGroupType.ReportingGroup4;
                selectedReportingGroup = this.reportinggroup4Array.filter(x => x.value == this.model.reportinggroup4guid)[0];
                this.clearReportingGroupDropDownWhenDaisyChain(5);
            }
            else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
                value = ReportingGroupType.ReportingGroup5;
                selectedReportingGroup = this.reportinggroup5Array.filter(x => x.value == this.model.reportinggroup5guid)[0];
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