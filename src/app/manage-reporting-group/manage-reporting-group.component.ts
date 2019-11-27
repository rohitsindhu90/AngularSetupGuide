import { NgForm } from '@angular/forms';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReportingGroupViewModel, ReportingGroupTypeViewModel } from '../_models/report/ReportingGroupViewModel';
import { GenericService } from '../_services/generic.service';
import { String } from '../_common/utility-method';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { ReportingGroupBaseViewModel } from '../_models/reporting-group-base';
import { TitleService } from '../_services/title.service';
import { ReportingGroupService } from '../_services/reporting-group.service';
import { promise } from 'selenium-webdriver';
import { ReportingGroupDetailsProvider } from '../_common/reporting-group-details-provider';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
@Component({
    selector: 'manage-reporting-group',
    templateUrl: './manage-reporting-group.component.html'
})
export class ManagerReportingGroupComponent implements OnInit {
    private loader: EventEmitter<any>;
    rGuid: string;
    error: string;
    reportingGroupList: ReportingGroupBaseViewModel[];
    reportingGroupDetail: ReportingGroupViewModel;
    reportingTypeArray: SelectItem[];

    addnewreportinggroup: boolean = false;
    reportingGroupArray: SelectItem[];
    statusarray: SelectItem[] = [{ value: null, label: "Select" }, { value: true, label: "Active" }, { value: false, label: "In-Active" }];
    model: ReportingGroupBaseViewModel;
    statusFilterSet: SelectItem[] = [];
    
    qStatusFilter:any;
    
    constructor(private globalEvent: GlobalEventsManager,
        private genericservice: GenericService,
        private router: ActivatedRoute,
        private reportinggroupservice: ReportingGroupService,
        private confirmationservice: ConfirmationService,
        private titleService: TitleService) {
        this.loader = globalEvent.busySpinner;


    }

    resetModel() {
        this.model = new ReportingGroupBaseViewModel();
        if (this.reportingGroupDetail && this.reportingGroupDetail.reportinggrouptypecollection && this.reportingGroupDetail.reportinggrouptypecollection.length > 0) {
            this.model.reportinggrouptypeid = this.reportingGroupDetail.reportinggrouptypecollection[0].id;
        }
    }

    setFormValues() {
        this.error = "";
        this.resetModel();
        this.addnewreportinggroup = false;
    }

    ngOnInit() {
        this.setFormValues();
        this.router.params.subscribe(params => {
            this.rGuid = params["rid"];
            if (this.rGuid) {
                this.loader.emit(this.genericservice.GetReportingGroupByGuid(this.rGuid, true).then(data => {
                    this.reportingGroupDetail = data;

                    //setting dynamic title
                    //this.titleService.setTitle(data.displayname+" Maintenance", true);
                    this.titleService.setTitle(data.displayname + " Maintenance");

                    this.loadReortingGroupList();

                    this.reportingTypeArray = [];

                    if (data.reportinggrouptypecollection.length > 0) {
                        data.reportinggrouptypecollection.forEach(d => {
                            this.reportingTypeArray.push({ label: d.typedescription, value: d.id });
                        });
                        this.model.reportinggrouptypeid = data.reportinggrouptypecollection[0].id;
                    }

                }));

            }
        });
    }

    ngAfterViewChecked() {

    }
    checkboxChange() {
        this.resetModel();
        if (this.addnewreportinggroup) {
            this.model.active = true;

        }
        else {
            this.model.active = null;

        }
    }

    onChangeReportingGroup() {
        this.loadReportingGroupDetail();
    }

    loadReortingGroupList() {
        this.reportinggroupservice.getReportingGroupListAsync(this.reportingGroupDetail.id).then(data => {
            this.reportingGroupArray = [];
            this.reportingGroupArray.push({ label: 'Select', value: null });
            if (data && data.length > 0) {

                this.reportingGroupList = data;

                data.forEach(x => {
                    this.reportingGroupArray.push({ label: x.description, value: x.id });
                });

                //Getting  Status  list from grid data
                this.statusFilterSet = [];
                this.statusFilterSet.push({ label: '', value: null });
                data.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                    return { 'value': q.status, 'label': q.status };
                }).forEach(q => {
                    if (q.value) {
                        this.statusFilterSet.push(q);
                    }
                });
            }

        });
    }

    loadReportingGroupDetail() {
        this.loader.emit(this.reportinggroupservice.GetReportingGroupDetailByID(this.reportingGroupDetail.id, this.model.id).then(data => {
            this.model = data;
        }));
    }
    CheckActiveCTNLinked(): Promise<boolean> {
        return this.reportinggroupservice.CheckActiveCTNLinked(this.reportingGroupDetail.description, this.model.id);
    }
    Save(form: NgForm) {
        this.model.reportnggroupmasterid = this.reportingGroupDetail.id;
        this.model.reportinggroupdisplayname = this.reportingGroupDetail.displayname;
        if (this.model.id > 0) {
            this.CheckActiveCTNLinked().then(x => {
                if (x && !this.model.active) {
                    let message = this.model.description + " is linked with the active Mobile Number. Are you sure you want to continue? ";
                    this.confirmationservice.confirm({
                        message: message,
                        rejectVisible: false,
                        accept: () => {
                            this.updateDB(form);
                        }
                    });
                }
                else {
                    this.updateDB(form);
                }

            });
        }
        else {
            this.updateDB(form);
        }

    }

    updateDB(form: NgForm) {
        this.loader.emit(this.reportinggroupservice.Save(this.model).then(r => {
            if (r.success) {
                this.confirmationservice.confirm({
                    message: r.message,
                    key: "dialog",
                    rejectVisible: false,
                    accept: () => {
                        this.setFormValues();
                        form.resetForm();
                        this.loadReortingGroupList();
                    }
                });
            } else {
                this.error = r.message;
            }


        }));
    }
}