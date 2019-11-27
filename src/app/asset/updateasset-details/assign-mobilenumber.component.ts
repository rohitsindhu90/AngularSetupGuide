import { NgForm, } from '@angular/forms';
import { Component, Input, OnInit, EventEmitter, } from '@angular/core';
import { ConfirmationDialogControl, AutoCompleteHeaderColumnMeta, ConfirmationService } from 'primengdevng8/api';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { AssetService } from '../../_services/asset.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { MobileFilter } from "../../_models/mobile-filter";
import { UpdateAssetViewModel } from '../../_models/asset/addasset';
import { ReportingGroupType, AssetOwnership } from '../../_services/enumtype';


@Component({
    selector: 'assign-mobilenumber',
    templateUrl: './assign-mobilenumber.component.html'
})



export class AssignMobilenumberComponent implements OnInit {
    private loader: EventEmitter<any>;
    mobileFilterList: MobileFilter[];
    labelClass: string = "col-sm-2";
    mobileFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [{ field: "mobilenumber", header: 'Mobile Number' },
    { field: 'staffname', header: 'Staff Name' },
    { field: 'status', header: 'Status' }
    ];
    mobileFilter: MobileFilter;

    model: UpdateAssetViewModel;
    @Input() oldmodel: UpdateAssetViewModel;

    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;

    constructor(
        private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private invoicereportservice: InvoiceReportService,
        private ctnDetailService: CTNDetailService,
        private confirmationservice: ConfirmationService,
        private activeModal: NgbActiveModal,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        var process1 = this.loadReportingGroupList();

        this.loader.emit(process1);
        this.model = Object.assign({}, this.oldmodel);

    }

    loadReportingGroupList(): Promise<any> {

        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                this.reportinggroup1Active = reportinggroup1.active;
                this.reportinggroup1DisplayName = reportinggroup1.displayname;
            }
            var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {
                this.reportinggroup2Active = reportinggroup2.active;
                this.reportinggroup2DisplayName = reportinggroup2.displayname;
            }

            var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                this.reportinggroup3Active = reportinggroup3.active;
                this.reportinggroup3DisplayName = reportinggroup3.displayname;
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname;
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname;
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname;

            }

        });

    }


    completeMethodMobile(event: any) {
        return this.ctnDetailService.getMobileByFilter(event.query, true, true).then(data => {

            let indexOfCTN = data.findIndex((a: MobileFilter) => a.mobilenumber == this.oldmodel.mobilenumber);
            if (indexOfCTN != -1) {
                data.splice(indexOfCTN, 1);

            }

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

    loadCTNDetails(ctnGuid: string): Promise<any> {

        return this.ctnDetailService.getCTNDetailByGuid(ctnGuid).then((data) => {
            if (data != null) {
                //


                this.model.ctndetailguid = ctnGuid;
                this.model.simnumber = data.simnumber;
                this.model.reportinggroup1guid = data.reportinggroup1guid;
                this.model.reportinggroup2guid = data.reportinggroup2guid;
                this.model.reportinggroup3guid = data.reportinggroup3guid;
                this.model.reportinggroup4guid = data.reportinggroup4guid;
                this.model.reportinggroup5guid = data.reportinggroup5guid;
                this.model.reportinggroup6guid = data.reportinggroup6guid;

                this.model.reportinggroup1description = data.reportinggroup1;
                this.model.reportinggroup2description = data.reportinggroup2;
                this.model.reportinggroup3description = data.reportinggroup3;
                this.model.reportinggroup4description = data.reportinggroup4;
                this.model.reportinggroup5description = data.reportinggroup5;
                this.model.reportinggroup6description = data.reportinggroup6;

                this.model.employeeemail = data.email;
                this.model.employeestaffid = data.staffid;
                this.model.userguid = data.userguid;
                this.model.employeename = data.name;
                this.model.mobilenumber = data.mobilenumber;
                this.model.selectedmobilemployeename = this.model.employeename;



            }
        });
    }

    clearModelMobile(event: any) {

        this.mobileFilter = null;
    }



    save(form: NgForm) {

        let popupHeaderMessage = '';
        let popupFirstOptionMessage = '';
        let popupSecondOptionMessage = '';

        if (this.model != null && this.model.assetguid != null) {  // If Asset don't have any Mobile Number & we are assigning New Mobile Number

            if (this.oldmodel.ctndetailguid != this.model.ctndetailguid) {

                if (this.oldmodel.assetownershipid == AssetOwnership.Company) {
                    popupHeaderMessage = 'The Mobile Number ' + this.model.mobilenumber + ' is currently allocated to ' + this.model.employeename + ' this action will reallocate the asset ' + this.model.device + ' to ' + this.model.employeename;
                }
                else if (this.oldmodel.assetownershipid == AssetOwnership.Employee) {
                    //let employeename =  ? this.oldmodel.employeename : 
                    if (this.oldmodel.employeename) {
                        popupHeaderMessage = 'The Mobile Number ' + this.model.mobilenumber + ' is currently allocated to ' + this.model.employeename + ' this action will reallocate the mobile number ' + this.model.mobilenumber + ' to ' + this.oldmodel.employeename;
                    }
                    else {
                        popupHeaderMessage = 'The Mobile Number ' + this.model.mobilenumber + ' is currently allocated to ' + this.model.employeename + ' this action will reallocate the asset ' + this.model.device + ' to ' + this.model.employeename;
                    }

                }
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

                        this.model.optionselection = (params != undefined ? params[0] : undefined);

                        //Update Asset and Assign Mobile User To Asset 
                        this.saveAsset();
                    }
                });
            }
            else {
                //Update Asset and Assign Mobile User To Asset 
                this.saveAsset();
            }

        }
    }

    saveAsset() {

        this.loader.emit(this.assetService.updateAsset(this.model).subscribe((result: any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'modal-confirmation-dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {

                            this.activeModal.close(result.success);

                        }
                    }
                });
            }
        }));
    }
}