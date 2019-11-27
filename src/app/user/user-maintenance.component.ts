import { Component, OnInit, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { AutoCompleteHeaderColumnMeta, ConfirmationDialogControl } from 'primengdevng8/api';
import { UserDetail, FeatureUserRoleRel } from '../_models/user-detail';
import { UserService } from '../_services/user.service';
import { CompanyService } from '../_services/company.service';
import { GlobalEventsManager } from '../_common/global-event.manager'
import { AccessGroupService } from '../_services/access-group.service';
import { Company } from '../_models/company';
import { UserFilter } from '../_models/user-filter';
import { RoleService } from '../_services/role.service';
import { UserRole } from '../_models/user-roles';
import { UtilityMethod } from '../_common/utility-method';
import { ClientRole, CompanyUserRule } from '../_common/enumtype';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from '../_services/authentication.service';

import { RegexExpression } from '../_common/regex-expression';

@Component({
    selector: 'user-maintenance',
    templateUrl: './user-maintenance.component.html'

})


export class UserMaintenaceComponent implements OnInit {
    loading: boolean = false;
    /* User */
    userArray: SelectItem[]; // array to hold user data
    roleArray: SelectItem[]; // array to hold roles
    statusArray: any[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "Inactive" }];

    roleList: UserRole[];

    /* Companys */
    companyArraySourceListCopy: Company[];
    companyArraySourceList: Company[];
    companyArrayTragetList: Company[];
    model: UserDetail = new UserDetail();
    @Input() addnewuser: boolean = false;
    //permissionSetArrayList: SelectItem[];
    permissionSetArrayListNew: SelectItem[];
    accesstypeArrayList: SelectItem[];

    userruletype: string;
    isclient: boolean;
    dataacessdropdowndisable: boolean;
    filteredname: string;
    userFilterList: UserFilter[];
    originalFeautredata: any;
    treeNodedata: any;
    changedTreeData: any;
    defaultfeaturearray: SelectItem[];
    featureList: FeatureUserRoleRel[] = [];
    showuserpermissionset: boolean = false;
    rolesType: any = ClientRole;
    isEmailRequired: boolean = false;
    searchuserautocompletePlaceHolderText: string;
    userRule: any = CompanyUserRule;
    emailfocus: boolean = false;
    staffidvalidated: boolean = true;
    staffvalidationmsg: string;
    usernamevalidated: boolean = true;
    usernamevalidationmsg: string;
    emailvalidated: boolean = true;
    emailvalidationmsg: string;
    private loader: EventEmitter<any>;
    @ViewChild('email', { static: false }) private elementRef: ElementRef;
    @Input() isComponentINPopUp: boolean = false;
    //=========For Update Assign Page======//
    @Input() isUpdateAssignPopUp: boolean = false;
    @Input() oldMobileNumber: string;
    @Input() oldDevice: string;
    @Input() oldEmployeename: string;
    @Input() isAddnewuserDisabled: boolean = false;
    isEndUserWelcomeEmailActive: boolean = false;
    isAccessAllDataDisabled: boolean = false;
    //=========For Update Assign Page======//

    userfilterheadermeta: AutoCompleteHeaderColumnMeta[];
    preRoleID: number;

    userDetail: UserDetail;
    mailRegex = RegexExpression.emailRegex;
    constructor(private userService: UserService,
        private confirmationservice: ConfirmationService,
        private companyservice: CompanyService,
        private globalEvent: GlobalEventsManager,
        private accessGroupService: AccessGroupService,
        private roleService: RoleService,
        private activeModal: NgbActiveModal,
        private accessgroupservice: AccessGroupService,
        private authenticationservice: AuthenticationService) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loadPageCombobox();
        this.userDetail = this.authenticationservice.currentUserValue;
        // LocalStorageProvider.getUserStorage();
        if (this.isComponentINPopUp) {
            this.model.roleid = ClientRole.EndUser;
            this.model.active = true;
            this.model.companydetails = this.userDetail.companydetails;
            // this.addnewuser = true;

        }
    }
    ngAfterViewChecked() {

    }
    /**
    * Load the data
    */
    loadPageCombobox() {
        this.togglecontrol();
        var p1 = this.loadRole();

        if (this.isclient) {
            this.IsEndUserWelcomeEmailActive();
        }

        if (!this.isclient) {
            this.emailControlRequired();
            var p3 = this.loadCompanySourceList();
            this.loader.emit(Promise.all([p1, p3]));

        } else {
            var p4 = this.setUserRuleType();
            //var p5 = this.loadPermissionSet();
            //var p6 = this.loadPermissionSetNew();
            var p7 = this.loadAccessTypeSet();
            this.loader.emit(Promise.all([p1, p4, p7]).then(() => {
                var p8 = this.loadCompanyDefaultAccessType();
                this.loader.emit(Promise.all([p8]).then(() => {
                    //this.loadPermissionSetNew(this.model.accesstypearray);
                }));
            }));
        }


    }
    userSearch(event: any) {
        setTimeout(() => {

            return this.userService.getUsersByFilter(event.query).then(data => {
                this.userFilterList = data;
            });
        }, 100);
    }
    handleSelectClick(event: any) {


        this.staffidvalidated = true;
        this.emailvalidated = true;
        this.usernamevalidated = true;

        setTimeout(() => {

            if (event.id > 0) {
                this.filteredname = "";
                // this.model.name = event.name;
                this.model.id = event.id;
                this.loadData();
            }
        }, 100)

    }
    handleClearClick(event: any) {



    }
    //handleDropdownClick(event:  {originalEvent: Event, query: string}) {
    //    
    //    this.results = [];
    //    return this.userService.getUsersByFilter(event.query).then(data => {
    //        
    //        this.results = data;
    //    });
    //}


    //loadUser(): Promise<any> {
    //    //populate user drop down
    //    this.clearUser();
    //    return this.userService.getUsers().then(data => {

    //        this.userArray.push({ label: 'Select', value: null });
    //        if (data != null) {
    //            data.forEach(item =>
    //                this.userArray.push({
    //                    label: item.name,
    //                    value: item.id
    //                }));
    //        }
    //    });

    //}

    loadRole(): Promise<any> {
        this.clearRole();
        return this.userService.getAllRoleList().then(data => {
            if (data != null) {
                this.roleList = data;
                this.roleArray.push({ label: 'Select', value: null });
                data.forEach(item =>
                    this.roleArray.push({
                        label: item.roledescription,
                        value: item.id
                    }));
            }
        });
    }

    //loadPermissionSet(): Promise<any> {
    //    this.clearPermissionSet();
    //    return this.accessGroupService.getPermissionSet(true).then(data => {
    //        if (data != null) {
    //            data.forEach(item =>
    //                this.permissionSetArrayList.push({
    //                    label: item.description,
    //                    value: item.id
    //                }));
    //        }
    //    });
    //}

    loadAccessTypeSet(): Promise<any> {
        this.clearAccessTypeSet();

        return this.accessgroupservice.getPermissionGroup(true).then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.accesstypeArrayList.push({
                    label: item.name, value: item.id
                }));
            }
        });
    }



    loadPermissionSetNew(accesstypelist: number[]): Promise<any> {
        this.clearPermissionSetNew();
        var previousselectedvalues = this.model.permissionsetarrayNew;
        this.model.permissionsetarrayNew = null;
        return this.accessGroupService.getPermissionSetNew(true, accesstypelist).then(data => {
            if (data != null) {
                data.forEach(item =>
                    this.permissionSetArrayListNew.push({
                        label: item.description,
                        value: { permissionsetid: item.permissionsetid, description: item.description, recordid: item.recordid, typeid: item.typeid, typename: item.typename + ':' }
                    }));
                this.model.permissionsetarrayNew = previousselectedvalues;
            }
        });
    }

    // For Admin Only Bind the Company list

    loadCompanySourceList(): Promise<any> {
        this.companyArrayTragetList = [];
        return this.companyservice.getCompanyList().then(data => {
            if (data != null) {
                this.companyArraySourceListCopy = data;
                this.companyArraySourceList = data
                this.sortCompanyArrayPickList();
            }
        });
    }

    addSelectedCompany(e: any) {
        this.sortCompanyArrayPickList();

    }

    removeSelectedCompany(e: any) {
        this.sortCompanyArrayPickList();
    }

    sortCompanyArrayPickList() {
        this.companyArraySourceListCopy.sort(this.comparetosortcompanydescription);
        this.companyArraySourceList.sort(this.comparetosortcompanydescription);
        if (this.companyArrayTragetList.length > 0) {
            this.companyArrayTragetList.sort(this.comparetosortcompanydescription);
        }
    }

    comparetosortcompanydescription(a: any, b: any) {
        // Use toUpperCase() to ignore character casing
        const x = a.companydescription.toUpperCase();
        const y = b.companydescription.toUpperCase();
        let comparison = 0;
        if (x > y) {
            comparison = 1;
        } else if (x < y) {
            comparison = -1;
        }
        return comparison;
    }

    checkboxChange(form: NgForm) {

        this.staffidvalidated = true;
        this.emailvalidated = true;
        this.usernamevalidated = true;

        form.resetForm({ addnewuser: this.addnewuser, active: this.model.active });
        this.model = new UserDetail();
        this.model.companydetails = this.userDetail.companydetails;

        this.clearTreeData();
        this.showuserpermissionset = false;
        if (!this.isclient) {
            this.resetCompanyArrayTragetList();
        }
        //manish
        this.isAccessAllDataDisabled = false;
        this.dataacessdropdowndisable = false;

        if (!this.isComponentINPopUp && this.isclient) {
            var p1 = this.loadCompanyDefaultAccessType();
            this.loader.emit(Promise.all([p1]).then(() => { this.loadPermissionSetNew(this.model.accesstypearray) }));
        }

        if (this.addnewuser) {
            this.model.active = true;

            if (this.isComponentINPopUp) {
                this.model.roleid = ClientRole.EndUser;
                //this.model.active = true;
                //this.addnewuser = true;

            }

        }
        else
            this.model.active = null;

    }

    resetCompanyArrayTragetList() {

        this.companyArrayTragetList = [];
        this.companyArraySourceList = this.companyArraySourceListCopy.slice();
        //if (this.companyArrayTragetList.length > 0) {
        //    this.companyArrayTragetList.forEach(item => {
        //        this.companyArraySourceList.push(item);
        //    });
        //    this.sortCompanyArrayPickList();
        //    this.companyArrayTragetList = [];
        //}
    }

    setUserRuleType(): Promise<any> {

        return this.userService.getClientUserRuleAsync().then(data => {
            if (data != null) {
                this.userruletype = data.toUpperCase();

            } else {
                // this will enable the Username text box, so that user can type any username
                this.userruletype = CompanyUserRule[CompanyUserRule.Others].toUpperCase();
            }
            this.model.userruletype = this.userruletype;
            this.emailControlRequired();
        });
    }

    showallcheckboxChange() {

        this.dataacessdropdowndisable = this.model.isallpermissionaccess;
        //this.model.permissionsetarray = [];
        this.model.permissionsetarrayNew = [];
        this.model.accesstypearray = [];
    }

    onuserRuleApply(d: any) {
        if (this.userruletype == CompanyUserRule[CompanyUserRule.Staffid].toUpperCase()) {
            this.model.username = this.model.staffid;
        }
        else if (this.userruletype == CompanyUserRule[CompanyUserRule.Email].toUpperCase()) {
            this.model.username = this.model.emailaddress;
        }
    }
    onstaffChange() {

        let userId = this.model.id > 0 ? this.model.id : 0;
        this.userService.checkStaffIDExists(userId, this.model.staffid).then(data => {

            if (!data.success) {
                this.staffidvalidated = false;
                this.staffvalidationmsg = data.message;
            }
            else
                this.staffidvalidated = true;
        });

    }
    onusernameChange() {
        this.loading = true;
        let userId = this.model.id > 0 ? this.model.id : 0;
        this.userService.checkUsernameExists(userId, this.model.username).then(data => {


            if (!data.success) {

                this.usernamevalidated = false;
                this.usernamevalidationmsg = data.message;
            }
            else
                this.usernamevalidated = true;

            this.loading = false;
        });

    }
    onemailChange() {

        this.loading = true;
        let userId = this.model.id > 0 ? this.model.id : 0;
        var email = this.model.emailaddress;
        if (this.model.emailaddress && this.model.emailaddress.length > 1 && this.isEmailRequired) {
            this.checkEmailAddressExists(userId, this.model.emailaddress);
        }

    }
    checkemaildomain() {

        if (this.model.emailaddress) {
            if (this.model.companydetails.companydescription.toLowerCase().toString() == "Onecom".toLowerCase().toString()) {
                return true;
            }

            var email = this.model.emailaddress.split("@");

            if (this.isclient && this.model.emailaddress && email.length > 1 && email[1].toString().toLowerCase() == "onecom.co.uk") {
                return false;
            }
        }
        return true;
    }

    checkEmailAddressExists(userId: number, emailaddress: string): Promise<any> {
        return this.userService.checkEmailAddressExists(userId, emailaddress).then(data => {
            if (!data.success) {

                this.emailvalidated = false;
                this.emailvalidationmsg = data.message;
            }
            else
                this.emailvalidated = true;

            this.loading = false;
        });
    }

    emailControlRequired() {
        if (this.isclient) {
            if (this.userruletype == CompanyUserRule[CompanyUserRule.Email].toUpperCase()) {
                this.isEmailRequired = true;
            }
            else {
                this.isEmailRequired = false;
            }
        }
        if (!this.isclient) {
            this.isEmailRequired = true;
        }

        if (this.isclient) {
            this.CheckIsEmailRequired();
        }

    }

    togglecontrol() {
        //if Admin login, then isclient must be set to false bcz we are hiding and showing the controls for admin and client
        let data = this.authenticationservice.currentUserValue;
        //LocalStorageProvider.getUserStorage() as UserDetail;
        this.isclient = data.isclient;
        this.userfilterheadermeta = [{ field: "name", header: 'Name' }];
        this.userfilterheadermeta.push({ field: 'staffid', header: 'StaffID' });
        this.userfilterheadermeta.push({ field: 'emailaddress', header: 'Email' });
        this.searchuserautocompletePlaceHolderText = "Search by Name, StaffID, UserName,Email";

        //if (this.isclient) {
        //    this.searchuserautocompletePlaceHolderText = "Search by name,staffid,username";
        //    this.userfilterheadermeta.push({ field: 'username', header: 'User Name' });


        //}
        //else {
        //    this.searchuserautocompletePlaceHolderText = "Search by name,email";
        //    this.searchuserautocompletePlaceHolderText = "Search by name,email";
        //    this.userfilterheadermeta.push({ field: 'emailaddress', header: 'Email' });
        //}
    }

    clearUser() {
        this.userArray = [];
        this.model.id = null;
    }

    clearRole() {
        this.roleArray = [];
        this.model.roleid = null;
    }

    //clearPermissionSet() {
    //    this.permissionSetArrayList = [];
    //    this.model.presmissionsetid = null;
    //}

    clearPermissionSetNew() {
        this.permissionSetArrayListNew = [];
    }

    clearAccessTypeSet() {
        this.accesstypeArrayList = [];
    }

    //on change of user drop down it will load data
    loadData() {
        if (this.model.id != undefined && this.model.id > 0) {
            if (this.isclient) {
                this.loadUserProfileByUserID();


                this.loader.emit(this.loadAccessTypeByUserIDNew().then(() => {
                    this.loader.emit(this.loadPermissionSetNew(this.model.accesstypearray).then(() => { this.loader.emit(this.loadDataAccessByUserIDNew()) }))
                }));

                //this.loader.emit(Promise.all([p1, p3, p4]));
            }
            else {
                var p1 = this.loadUserProfileByUserID();
                var p2 = this.setTargetCompanyUserRelByUserID();
                this.loader.emit(Promise.all([p1, p2]));
            }

        }
    }

    //loadDataAccessByUserID(): Promise<any> {
    //    return this.accessGroupService.GetPermissionSetUserRelAsync(this.model.id).then
    //        (data => {
    //            this.model.permissionsetarray = [];
    //            this.model.permissionsetarray = data;
    //        });
    //}

    loadDataAccessByUserIDNew(): Promise<any> {
        return this.accessGroupService.GetPermissionSetUserRelAsyncNew(this.model.id).then
            (data => {
                this.model.permissionsetarrayNew = [];
                this.model.permissionsetarrayNew = data;
            });
    }



    loadUserProfileByUserID(): Promise<any> {
        return this.userService.LoadUserProfile(this.model.id).then(data => {
            if (data) {
                this.model.name = data.name,
                    this.model.emailaddress = data.emailaddress;
                this.model.active = data.active;
                this.model.roleid = data.roleid;
                this.preRoleID = data.roleid;
                this.model.userguid = data.userguid;
                if (this.isclient) {
                    this.model.isallpermissionaccess = data.isallpermissionaccess;
                    this.dataacessdropdowndisable = data.isallpermissionaccess;
                    this.model.staffid = data.staffid;
                }
                this.model.username = data.username;
                this.model.companydetails = data.companydetails


                // for end user we are displaying feature tree data.
                if (this.model.roleid != ClientRole.EndUser && this.checkIfRoleIsNoAllAccess(this.model.roleid)) {
                    this.loadFeatureTreeDataByUserID();
                }
            }
            else {
                this.preRoleID = undefined;
            }
        })
    }

    setTargetCompanyUserRelByUserID(): Promise<any> {
        return this.userService.getCompanyUserRelAsync(this.model.id).then
            (data => {
                // to set the target pick list
                this.companyArrayTragetList = this.companyArraySourceListCopy.filter(item => {
                    return data.indexOf(item.companyid) !== -1;
                })
                // to set the available pick list
                this.companyArraySourceList = this.companyArraySourceListCopy.filter(item => {
                    return data.indexOf(item.companyid) === -1;
                })

            });
    }

    setSelectedCompany() {
        this.model.companyarray = [];
        this.companyArrayTragetList.forEach(item =>
            this.model.companyarray.push(item.companyid));
    }

    loadFeatureTreeDataByUserID(defaultFeature?: boolean): Promise<any> {
        this.treeNodedata = [];
        this.originalFeautredata = [];
        let userID = (defaultFeature == true) ? 0 : this.model.id;
        return this.userService.LoadFeatureTreeViewByUserRole(this.model.roleid, UtilityMethod.IfNull(userID, 0)).then((data) => {
            if (data && data.length > 0) {
                this.showuserpermissionset = true;
                this.treeNodedata = data;
                setTimeout(x => {
                    this.originalFeautredata = JSON.parse(JSON.stringify(data));
                }, 0)
            }
            else {
                this.showuserpermissionset = false;
            }
        });

    }

    checkIfRoleIsNoAllAccess(roleID: number): boolean {
        return this.roleList.filter(x => x.id == roleID && x.isallaccess).length == 0;
    }

    onChangeRole() {

        // for end user we are not displaying feature tree data.
        this.clearTreeData();
        if (this.model.roleid > 0 && this.model.roleid != ClientRole.EndUser && this.checkIfRoleIsNoAllAccess(this.model.roleid)) {
            this.showuserpermissionset = true;
            let defaultFeature: boolean = (this.model.roleid != this.preRoleID);
            var p1 = this.loadFeatureTreeDataByUserID(defaultFeature);
            this.loader.emit(Promise.all([p1]));
        }
        else {
            this.showuserpermissionset = false;
            //this.model.permissionsetarray = [];
            //this.model.accesstypearray = [];
            // this.model.permissionsetarrayNew = [];
        }

        if (this.model.roleid > 0 && this.model.roleid != ClientRole.EndUser && this.addnewuser) {
            // this.model.permissionsetarray = [];
            //this.model.accesstypearray = [];
            //this.model.permissionsetarrayNew = [];
            this.model.isallpermissionaccess = true;
            this.dataacessdropdowndisable = true;
        }
        else {
            //  this.model.permissionsetarray = [];
            //this.model.permissionsetarrayNew = [];
            this.model.isallpermissionaccess = false;
            this.dataacessdropdowndisable = false;
        }

        if (this.model.roleid === ClientRole.SuperUserClient) {
            this.model.isallpermissionaccess = true;
            this.isAccessAllDataDisabled = true;
            // this.model.permissionsetarray = [];
            //this.model.accesstypearray = [];
            //this.model.permissionsetarrayNew = [];
            this.dataacessdropdowndisable = true;
        }
        else if (this.model.roleid === ClientRole.SupportUserClient || this.model.roleid === ClientRole.CareUser || this.model.roleid === ClientRole.FinanceUser) {
            this.model.isallpermissionaccess = true;
            this.isAccessAllDataDisabled = false;
            ////this.model.permissionsetarray = [];
            //this.model.accesstypearray = [];
            //this.model.permissionsetarrayNew = [];
            this.dataacessdropdowndisable = true;
        }
        else {
            this.model.isallpermissionaccess = false;
            this.isAccessAllDataDisabled = false;
            this.dataacessdropdowndisable = false;
        }

        if (this.dataacessdropdowndisable == false && this.model.accesstypearray.length == 0 && this.isclient) {

            var p1 = this.loadCompanyDefaultAccessType();
            this.loader.emit(Promise.all([p1]).then(() => { this.loadPermissionSetNew(this.model.accesstypearray) }));
        }
    }

    checkboxChangeisreadonly(checked: any, event: any) {

        event.data.isvisibleonly = event.data.iswriteonly = false;

        this.IsAnyCheckBoxisNotChecked(event, event.data.isreadonly);
        if (event.children.length) {
            this.syncChildtoParent(event);
        }

    }
    checkboxChangeiswriteonly(event: any) {

        event.data.isvisibleonly = event.data.isreadonly = false;
        this.IsAnyCheckBoxisNotChecked(event, event.data.iswriteonly);
        if (event.children.length) {
            this.syncChildtoParent(event);
        }

    }

    checkboxChangeisvisibleonly(event: any) {

        event.data.isreadonly = event.data.iswriteonly = false;
        this.IsAnyCheckBoxisNotChecked(event, event.data.isvisibleonly);
        if (event.children.length) {
            this.syncChildtoParent(event);
        }


    }

    syncChildtoParent(event: any) {
        // 
        let $this = this;
        event.children.forEach(function (element: any) {
            element.data.isvisibleonly = event.data.isvisibleonly;
            element.data.iswriteonly = event.data.iswriteonly;
            element.data.isreadonly = event.data.isreadonly;
            if (element.children != null && element.children.length) {
                $this.syncChildtoParent(element);
            }
        });
    }

    IsAnyCheckBoxisNotChecked(event: any, currentValue: boolean) {
        if (!currentValue) {
            event.data.isvisibleonly = true;
        }
    }

    getflatdataForFeatures() {
        let $this = this;
        this.featureList = [];
        this.treeNodedata.filter(function s(element: any, index: any) {

            let oldElement = $this.originalFeautredata[index];

            if ($this.compareOldandNewData(oldElement, element)) {

                $this.pushDataIntofeatureList(element);
            }
            if (element.children != null && element.children.length) {
                $this.getChangedDataForFeaturesChild(element.children, index);
            }
        });

    }

    getChangedDataForFeaturesChild(list: any, parentID: any, levelone?: any) {
        let $this = this;
        list.filter(function s(element: any, index: any) {
            let oldElement: any;
            if (levelone != null) {
                oldElement = $this.originalFeautredata[parentID].children[levelone].children[index];
            }
            else {
                oldElement = $this.originalFeautredata[parentID].children[index];
            }


            if ($this.compareOldandNewData(oldElement, element)) {
                $this.pushDataIntofeatureList(element);

            }
            if (element.children != null && element.children.length) {
                $this.getChangedDataForFeaturesChild(element.children, parentID, index);
            }

        });

    }
    pushDataIntofeatureList(element: any) {
        this.featureList.push({
            featureid: element.data.featureid,
            featuredescription: element.data.featuredescription,
            isreadonly: element.data.isreadonly,
            isvisibleonly: element.data.isvisibleonly,
            iswriteonly: element.data.iswriteonly
        });
    }

    compareOldandNewData(oldElement: any, element: any): boolean {
        if (oldElement.data.featureid == element.data.featureid &&
            (oldElement.data.isreadonly != element.data.isreadonly || oldElement.data.isvisibleonly != element.data.isvisibleonly
                || oldElement.data.iswriteonly != element.data.iswriteonly)) {

            return true;
        }

        return false;

    }

    clearTreeData() {
        this.treeNodedata = [];
        this.originalFeautredata = [];

    }
    landingPageCannotbeHidden(): Promise<string> {

        let validationmsg: string;
        let isValid = false;
        let defaultFeature: UserRole;
        var p = new Promise<string>((resolve) => {
            this.roleService.LoadRoleByRoleID(this.model.roleid).then(res => {
                defaultFeature = res;
                if (this.treeNodedata) {
                    this.treeNodedata.filter(function f(element: any) {
                        if (element.data.featureid === res.defaultfeatureid) {
                            if (element.data.isvisibleonly) {
                                isValid = true;
                                return element.data.isvisibleonly;
                            }


                        }
                        if (element.children != null && element.children.length) {
                            element.children.filter(f);
                        }
                    });
                }
                if (isValid) {
                    validationmsg = defaultFeature.deafultfeaturedescription + " is landing page & can't be hidden !! ";
                }

                resolve(validationmsg);

            });
        });

        return p;


    }

    save(form: NgForm) {

        var validationcheck = true;
        if ((this.isclient &&
            (!this.usernamevalidated || !this.staffidvalidated))
            || (this.isEmailRequired && !this.emailvalidated)) {
            validationcheck = false
        }
        if (validationcheck) {
            this.landingPageCannotbeHidden().then(result => {
                if (result) {
                    this.confirmationservice.confirm({
                        message: result,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {

                        }
                    });
                }
                else {
                    var messagetext = "We are unable to send a Welcome Email as no email address has been provided. Do you wish to continue?";
                    if (this.isclient && !this.model.emailaddress && (this.isEmailRequired || this.isEndUserWelcomeEmailActive)) {
                        this.confirmationservice.confirm({
                            message: messagetext,
                            key: (this.isComponentINPopUp ? 'modal-confirmation' : undefined),
                            accept: () => {
                                this.formSubmit(form);
                            },
                            reject: () => {

                                this.elementRef.nativeElement.focus();

                            }
                        });
                    }
                    else {
                        this.formSubmit(form);
                    }
                }
            });



        }
    }

    formSubmit(form: NgForm) {

        if (this.isclient && !this.checkemaildomain()) {
            this.confirmationservice.confirm({
                message: "It is not possible to create Onecom Users from this page",
                key: this.isComponentINPopUp ? 'modal-confirmation-dialog' : 'dialog',
                rejectVisible: false,
                accept: () => {
                    this.elementRef.nativeElement.focus();
                }
            });
            return;
        }
        if (this.model.roleid != ClientRole.EndUser && this.checkIfRoleIsNoAllAccess(this.model.roleid)) {
            this.getflatdataForFeatures();
            this.model.featureList = this.featureList;
        }
        this.model.isemailrequired = this.isEmailRequired;

        setTimeout(t => {
            if (!this.isclient) {
                this.model.username = this.model.emailaddress;
                this.setSelectedCompany();
            }

            let popupHeaderMessage = '';
            let popupFirstOptionMessage = '';
            let popupSecondOptionMessage = '';

            if (this.oldMobileNumber) {
                //if (this.model.selectedmobilemployeename != this.model.employeename && this.oldmodel.ctndetailguid != this.model.ctndetailguid) {
                popupHeaderMessage = 'This asset has a Mobile number ' + this.oldMobileNumber + ' assigned to it. ';
                popupFirstOptionMessage = 'Would you like to assign the asset and the mobile number ' + this.oldMobileNumber + ' to ' + this.model.name;
                popupSecondOptionMessage = 'Would you like to assign the asset to ' + this.model.name + ' and keep the Mobile number ' + this.oldMobileNumber + ' assigned to the existing user ' + this.oldEmployeename;
                // }

            }
            else if (this.oldEmployeename) {
                popupHeaderMessage = 'This asset is currently assigned to ' + this.oldEmployeename + '. Would you like to assign asset to ' + this.model.name
            }

            let controls: ConfirmationDialogControl = {
                multiselect: false, rvalidation: true, controls: [
                    { value: true, text: popupFirstOptionMessage },
                    { value: false, text: popupSecondOptionMessage }
                ]
            };

            if (popupFirstOptionMessage == '' && popupSecondOptionMessage == '') {
                controls = null;
            }

            if (!(popupFirstOptionMessage == '' && popupSecondOptionMessage == '' && popupHeaderMessage == '')) {
                this.confirmationservice.confirm({
                    message: popupHeaderMessage,
                    key: 'modal-confirmation',
                    control: controls,
                    rejectVisible: false,
                    accept: (params: any) => {
                        if (this.isUpdateAssignPopUp && !this.addnewuser) {

                            var object = {
                                staffid: this.model.staffid,
                                name: this.model.name,
                                userguid: this.model.userguid,
                                emailaddress: this.model.emailaddress,
                                optionselection: params
                            };

                            form.resetForm();
                            this.model = new UserDetail();
                            form.resetForm();
                            this.activeModal.close(object);
                        }
                        else {
                            this.saveUser(form, params);
                        }
                    }
                });
            }
            else {
                //Update Asset and Assign Mobile User To Asset 
                this.saveUser(form);
            }
        }, 100);

    }

    saveUser(form: NgForm, optionselection?: any) {
        this.loader.emit(this.userService.saveUser(this.model).subscribe((result: any) => {
            if (result) {

                if (this.isUpdateAssignPopUp) {
                    if (result.success) {
                        form.resetForm();
                        this.model = new UserDetail();
                        this.model.companydetails = this.userDetail.companydetails;
                        if (this.isComponentINPopUp) {
                            result.object.optionselection = optionselection;
                            this.activeModal.close(result.object);
                        }
                    }
                }
                else {
                    this.confirmationservice.confirm({
                        message: result.message,
                        key: this.isComponentINPopUp ? 'modal-confirmation-dialog' : 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result.success) {
                                form.resetForm();
                                this.model = new UserDetail();
                                this.model.companydetails = this.userDetail.companydetails;
                                this.dataacessdropdowndisable = false;
                                this.loadPageCombobox();
                                if (!this.isclient) {
                                    this.companyArrayTragetList = [];
                                }
                                this.clearTreeData();
                                this.showuserpermissionset = false;

                                //==============For Add User Page, Open in PopUP
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

    SwitchUser() {
        this.authenticationservice.refreshToken(this.model.username).then(x => {
            // this.globalEvent.reloadMenu.emit(false);
            this.authenticationservice.navigateToMainPage();
        });
    }

    CheckIsEmailRequired(): Promise<any> {
        return this.userService.CheckIsEmailRequired().then((data) => {
            this.isEmailRequired = data;
        });
    }

    IsEndUserWelcomeEmailActive(): Promise<any> {
        return this.userService.IsEndUserWelcomeEmailActive().then((data) => {
            this.isEndUserWelcomeEmailActive = data;
        });


    }

    onAccessTypeChange(event: any) {
        this.model.permissionsetarrayNew = this.model.permissionsetarrayNew.filter(item => event.value.indexOf(item.typeid) != -1);
        this.loader.emit(this.loadPermissionSetNew(this.model.accesstypearray));
    }


    loadAccessTypeByUserIDNew(): Promise<any> {
        return this.accessGroupService.GetPermissionGroupForUserAsync(this.model.id).then
            (data => {
                this.model.accesstypearray = [];
                this.model.accesstypearray = data;
            });
    }

    loadCompanyDefaultAccessType(): Promise<any> {
        return this.accessGroupService.GetPermissionGroupForCompanyAsync().then
            (data => {
                this.model.accesstypearray = [];
                this.model.accesstypearray = data;
            });
    }

}

