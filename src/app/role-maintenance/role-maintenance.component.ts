import { NgForm } from '@angular/forms';
import { Component, OnInit, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

// import { GlobalEventsManager } from '../_common/gobal-events-manager';
import { RoleService } from '../_services/role.service';
import { UserRole, FeratureRoleList } from '../_models/user-roles';
import { FeatureService } from '../_services/feature.service';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({
    selector: 'role-maintenance',
    templateUrl: './role-maintenance.component.html',
    styles: [`.form-group.required label:after { 
               content:"*";
               color:red; }

                a:focus, a:hover{
                    color: !important #0275d8;
                    text-decoration: !important none;
                }
               `]
})
export class RoleMaintenanceComponent implements OnInit {
    private loader: EventEmitter<any>;

    roleArray: SelectItem[];
    statusarray: SelectItem[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "Inactive" }];
    landingPagearray: SelectItem[];
    model: UserRole;
    addNewRole: boolean;
    isclient: boolean;
    featureTree: any;
    originalFeatureTree: any;
    featureList: FeratureRoleList[] = [];

    constructor(private globalEvent: GlobalEventsManager,
        private roleService: RoleService,
        private route: ActivatedRoute,
        private router: Router,
        private confirmationservice: ConfirmationService,
        private featureservice: FeatureService,
        private authenticationService: AuthenticationService,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.CheckIsClientOrNot();
        this.setModelValues();
        var p1 = this.loadRoleSetDropdown();
        var p2 = this.loadRoleWiseTreeData();
        var p3 = this.loadlandingPagearray();
        this.loader.emit(Promise.all([p1, p2, p3]));
    }

    ngAfterViewChecked() {

    }

    setModelValues() {
        this.model = new UserRole();
        this.addNewRole = false;
    }

    loadRoleSetDropdown() {
        this.clearRoleSet();
        this.roleArray.push({ label: 'Select', value: null });

        this.roleService.getRoleList().then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.roleArray.push({
                    label: item.roledescription, value: item.id
                }));
            }
        });
    }

    CheckIsClientOrNot() {

        //if Admin login, then isclient must be set to false bcz we are hiding and showing the controls for admin and client
        //let data = LocalStorageProvider.getUserStorage() as UserDetail;
        let data = this.authenticationService.currentUserValue;
        this.isclient = data.isclient;


    }

    clearRoleSet() {
        this.roleArray = [];

    }


    checkboxChange(form: NgForm) {

        if (this.addNewRole) {
            this.model.active = true;

        }
        else {
            this.model.active = null;

        }

        this.model.id = null;

        var p1 = this.loadlandingPagearray();
        var p2 = this.loadRoleWiseTreeData();

        this.loader.emit(Promise.all([p1, p2]));

    }


    onChangeRole() {

        var p1 = this.loadRolebyRoleID();
        var p2 = this.loadRoleWiseTreeData();
        var p3 = this.loadlandingPagearray();
        this.loader.emit(Promise.all([p1, p2, p3]));

    }

    loadRolebyRoleID() {
        if (this.model != null && this.model.id != null) {
            let roleID = this.model.id

            this.roleService.LoadRoleByRoleID(roleID).then((data) => {
                this.model.active = data.active;
                this.model.defaultfeatureid = data.defaultfeatureid;
            });
        }
        else {

            this.model.active = null;
        }
    }

    loadRoleWiseTreeData() {

        this.originalFeatureTree = [];
        let roleID: number = null;
        if (this.model != null) {
            roleID = this.model.id

            //
            this.roleService.LoadFeatureRoleTreeViewByRoleID(roleID).then((data) => {
                if (data && data.length > 0) {
                    this.featureTree = data;

                    //this.featureTree = data;
                    this.originalFeatureTree = JSON.parse(JSON.stringify(data));
                }


            });
        }
    }

    loadlandingPagearray() {


        this.featureservice.getDefaultFeatureList().then((data) => {
            this.landingPagearray = [];
            this.landingPagearray.push({ label: 'Select', value: null });
            if (data && data.length > 0) {
                data.forEach(item => {
                    this.landingPagearray.push({
                        label: item.featurename, value: item.featureid
                    });
                    //if (item.featurename.toLowerCase() === 'Dashboard'.toLowerCase()) {
                    //    this.model.defaultfeatureid = item.featureid;
                    //}
                });


            }
        });
    }



    dignose() {
        return JSON.stringify(this.featureTree);
    }


    checkboxChangeisreadonly(event: any) {

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

    save(form: NgForm) {

        let result = this.landingPageCannotbeHidden();

        if (result) {
            this.confirmationservice.confirm({
                message: "Landing page feature can't be hidden !!",
                key: 'dialog',
                rejectVisible: false,
                accept: () => {

                }
            });
        }


        else {

            //if (this.model.id) {
            //    //Get Only Changed Feature by USer, When we edit role.
            //    this.getChangedDataForFeatures();
            //}
            //else {
            //===For New Role We have insert all feature ;
            this.convertTreeIntoFeaturesList();

            //}

            this.loader.emit(
                this.roleService.SaveRole(this.model, this.featureList).subscribe((result: any) => {
                    if (result) {
                        this.confirmationservice.confirm({
                            message: result.message,
                            key: 'dialog',
                            rejectVisible: false,
                            accept: () => {
                                if (result.success) {
                                    this.ngOnInit();
                                    form.resetForm();
                                }
                            }
                        });
                    }
                })
            );
        }
    }



    //getChangedDataForFeatures() {
    //    let $this = this;

    //    this.featureList = [];
    //    this.featureTree.filter(function s(element: any, index: any) {
    //        let oldElement = $this.originalFeatureTree[index];


    //        if ($this.compareOldandNewData(oldElement, element)) {
    //            $this.pushDataIntofeatureList(element);

    //        }

    //        if (element.children != null && element.children.length) {
    //            $this.getChangedDataForFeaturesChild(element.children, index);
    //        }
    //    });



    //}


    //getChangedDataForFeaturesChild(list: any, parentID: any, levelone?: any) {
    //    let $this = this;
    //    list.filter(function s(element: any, index: any) {
    //        let oldElement: any;
    //        if (levelone != null) {
    //            oldElement = $this.originalFeatureTree[parentID].children[levelone].children[index];
    //        }
    //        else {
    //            oldElement = $this.originalFeatureTree[parentID].children[index];
    //        }



    //        if ($this.compareOldandNewData(oldElement, element)) {
    //            $this.pushDataIntofeatureList(element);

    //        }
    //        if (element.children != null && element.children.length) {
    //            $this.getChangedDataForFeaturesChild(element.children, parentID, index);
    //        }


    //    });

    //}

    pushDataIntofeatureList(element: any) {
        this.featureList.push({
            featureid: element.data.featureid,
            featuredescription: element.data.featuredescription,
            isreadonly: element.data.isreadonly,
            isvisibleonly: element.data.isvisibleonly,
            iswriteonly: element.data.iswriteonly
        });
    }

    //compareOldandNewData(oldElement: any, element: any): boolean {
    //    if (oldElement.data.featureid == element.data.featureid &&
    //        (oldElement.data.isreadonly != element.data.isreadonly || oldElement.data.isvisibleonly != element.data.isvisibleonly
    //            || oldElement.data.iswriteonly != element.data.iswriteonly)) {

    //        return true;
    //    }

    //    return false;

    //}

    landingPageCannotbeHidden() {
        let id = this.model.defaultfeatureid;
        let isValid = false;

        this.featureTree.filter(function f(element: any) {
            if (element.data.featureid === id) {
                if (element.data.isvisibleonly) {
                    isValid = true;
                    return element.data.isvisibleonly;
                }

            }
            if (element.children != null && element.children.length) {
                element.children.filter(f);
            }
        })
        return isValid;
    }

    convertTreeIntoFeaturesList() {

        let $this = this;
        this.featureList = [];
        this.featureTree.forEach(function s(element: any, index: any) {

            $this.pushDataIntofeatureList(element);
            if (element.children != null && element.children.length) {
                //$this.getChangedDataForFeaturesChild(element.children, index);

                element.children.forEach(s);
            }

        });

    }

}

