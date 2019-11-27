import { Component, OnInit, EventEmitter } from '@angular/core'
import { NgForm } from '@angular/forms';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { ClientControlService } from '../_services/clientcontrol.service';
import { InvoiceReportService } from '../_services/invoice-report.service';
import { NetworkService } from '../_services/network.service';
import { FeatureService } from '../_services/feature.service';
import { Client } from '../_models/client';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { NetworkBillingPlatformRel } from '../_models/networkbillingplatformrel';
import { ClientControl } from '../_models/clientcontrol';
import { ClientEnum, DesignCategoryEnum, ClientControlEnum } from '../_services/enumtype';
import { RegexExpression } from '../_common/regex-expression';
import { UtilityMethod } from '../_common/utility-method';
@Component({
    templateUrl: './client.component.html',
    styles: [' .form-control .ng-valid { border-color: green !important; }']
})
export class ClientComponent implements OnInit {
    private loader: EventEmitter<any>;
    decimalregx: RegExp = RegexExpression.decimal;
    model: ClientModel = new ClientModel();


    clientEnum = ClientEnum;
    designCategory = DesignCategoryEnum;
    clientControlEnum = ClientControlEnum;

    costadjustmentarray: SelectItem[] = [{ value: false, label: "None" }, { value: true, label: "All" }];
    usernamearray: SelectItem[] = [{ value: 'StaffId', label: "StaffId" }, { value: 'UserName', label: "UserName" }, { value: 'Email', label: "Email" }];

    bulkmanualcredit: ClientControl;
    showobservation: ClientControl;

    mobileOnlyValue: string = 'false';
    networkBillingPlatformArray: NetworkBillingPlatformRel[] = [];

    fieldsChildValue = {};

    mobileOnlyDisplay: boolean = false;
    bulkmanualcreditDisplay: boolean = false;
    passwordarray: SelectItem[] = [{ value: 1, label: "Min 8 Char, 1 uppercase and 1 Number" }, { value: 2, label: "Min 14 Char, 1 uppercase, 1 Number and 1 symbol" }];
    selectedPassword: number = 1;
    constructor(
        private clientControlService: ClientControlService,
        private globalEventsManager: GlobalEventsManager,
        private invoicereportservice: InvoiceReportService,
        private featureService: FeatureService,
        private confirmationservice: ConfirmationService,
        private networkservice: NetworkService
    ) {
        this.loader = globalEventsManager.busySpinner;


    }
    ngOnInit() {
        var p1 = this.loadClientDetail();
        var p2 = this.loadClientControls();
        var p3 = this.loadReportingGroupList();
        var p4 = this.loadFeatureTreeData();
        var p5 = this.loadNetworkBillingPlatform();
        this.loader.emit(Promise.all([p1, p2, p3, p4, p5]));

    }

    loadClientDetail(): Promise<any> {
        return this.clientControlService.GetClientDetail().then(res => {
            this.model.clientinfo = res;

            if (this.model.clientinfo[this.clientEnum.passwordmessge - 1].value) {
                this.selectedPassword = 2
            }

        });
    }

    loadClientControls(): Promise<any> {
        return this.clientControlService.GetClientControls().then(res => {
            this.model.clientcontrolinfo = res;

            let mobileControlIndex = this.model.clientcontrolinfo.findIndex((v, i) => { return v['description'] == 'Mobile Only' });
            if (mobileControlIndex > 0) {
                this.mobileOnlyValue = this.model.clientcontrolinfo[mobileControlIndex].active ? 'true' : 'false';
                this.mobileOnlyDisplay = true;
            }


            this.bulkmanualcredit = this.model.clientcontrolinfo.filter((v, i) => { return v['description'] == 'Bulk Manual Credit' })[0];
            if (this.bulkmanualcredit != undefined) {
                this.bulkmanualcreditDisplay = true;
            }
            this.showobservation = this.model.clientcontrolinfo.filter((v, i) => { return v['description'] == 'Show Observations' })[0];

            res.forEach(val => {
                if (val.designcategory == this.designCategory.Fields) {
                    this.fieldsChildValue[val.id] = val.childcontrolvalue == 'true';
                }

            })
        });
    }

    loadReportingGroupList(): Promise<any> {
        return this.invoicereportservice.getReportingGroupDetails().then(res => {
            this.model.reportinggroupviewmodel = res;
        });
    }

    loadFeatureTreeData(): Promise<any> {
        return this.featureService.LoadFeatureTree().then((data) => {
            if (data && data.length > 0) {
                this.model.featuretree = data;
            }
        });
    }

    loadNetworkBillingPlatform(): Promise<any> {
        return this.networkservice.getnetworkplatformrel().then((data) => {
            if (data && data.length > 0) {
                this.networkBillingPlatformArray = data;

            }
        });
    }

    onChangeIncudeChkbox(event: any) {
        if (event.children.length) {
            this.syncChildtoParent(event);
        }

    }


    syncChildtoParent(event: any) {
        let $this = this;
        event.children.forEach(function (element: any) {
            element.data.active = event.data.active;
            if (element.children != null && element.children.length) {
                $this.syncChildtoParent(element);
            }
        });
    }

    onChangeBulkCredit(event: any) {

        if (!this.bulkmanualcredit.childcontrolvalue) {
            this.model.clientinfo[this.clientEnum.creditenddate - 1].value = '';
        }
    }

    convertTreeIntoFeaturesList(): any {
        let featureList: any = [];
        this.model.featuretree.forEach(function s(element: any, index: any) {
            featureList.push({
                featureid: element.data.featureid,
                featurename: element.data.featurename,
                active: element.data.active,

            });
            if (element.children != null && element.children.length) {
                element.children.forEach(s);
            }
        });

        return featureList;

    }

    save(form: NgForm) {

        this.setPasswordValues();
        //=========Format Selected Credit End Date=============
        let creditEndDate = this.model.clientinfo[this.clientEnum.creditenddate - 1];
        // this.model.clientinfo[this.clientEnum.creditenddate - 1].value = this.convertDate(new Date(creditEndDate.value));
        // only do this, if coming from date model changes, so if the date is a function, only then
        if (typeof creditEndDate.value == 'object') {
            this.model.clientinfo[this.clientEnum.creditenddate - 1].value = this.convertDate(new Date(creditEndDate.value));
        }
        //===========Set MobileOnly Radio Button Value back into Array==========//
        // this.model.clientcontrolinfo[this.clientControlEnum.MobileOnly - 1].active = (this.mobileOnlyValue == 'true');
        let mobileControlIndex = this.model.clientcontrolinfo.findIndex((v, i) => { return v['description'] == 'Mobile Only' });
        if (mobileControlIndex > 0) {
            this.model.clientcontrolinfo[mobileControlIndex].active = (this.mobileOnlyValue == 'true');
        }


        //===========Set Fields ChildControl Value back into Array==========//
        this.model.clientcontrolinfo.forEach(value => {

            let res = this.fieldsChildValue[value.id];
            if (res !== undefined) {
                value.childcontrolvalue = res;
            }

        });


        this.loader.emit(this.clientControlService.SaveClientConfig(this.model.clientinfo, this.model.clientcontrolinfo, this.model.reportinggroupviewmodel,
            this.convertTreeIntoFeaturesList()).subscribe((result: any) => {
                if (result) {
                    this.confirmationservice.confirm({
                        message: result.message,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result.success) {
                                this.ngOnInit();
                                //form.resetForm();
                            }
                        }
                    });
                }
            }));
    }

    setPasswordValues() {
        if (this.selectedPassword === 1) {
            this.model.clientinfo[this.clientEnum.passwordmessge - 1].value = '';
            this.model.clientinfo[this.clientEnum.passwordregexp - 1].value = '';
        }
        else {
            this.model.clientinfo[this.clientEnum.passwordmessge - 1].value = UtilityMethod.password14CharMsg;
            this.model.clientinfo[this.clientEnum.passwordregexp - 1].value = RegexExpression.password14CharRegex.source;
        }
    }

    convertDate(dt: Date): string {
        let today = dt;
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!
        let yyyy = today.getFullYear();

        let day: string = dd.toString();
        if (dd < 10) {
            day = '0' + dd;
        }

        let month: string = mm.toString();
        if (mm < 10) {
            month = '0' + mm;
        }
        return (day + '/' + month + '/' + yyyy);

    }

    onClickStatusChange(networkBillingPlatform: NetworkBillingPlatformRel, $event: any) {


        this.loader.emit(this.networkservice.updatenetworkbillingpaltformstatus(networkBillingPlatform.networkid, networkBillingPlatform.status,
            networkBillingPlatform.billingplatformid).subscribe((result: any) => {
                if (result) {
                    this.confirmationservice.confirm({
                        message: result.message,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result.success) {
                                this.loadNetworkBillingPlatform();
                                //form.resetForm();
                            }
                        }
                    });
                }
            }));

    };


}

export class ClientModel {
    public clientinfo: Client[];
    public clientcontrolinfo: ClientControl[];
    public reportinggroupviewmodel: ReportingGroupViewModel[];
    public featuretree: any;

}