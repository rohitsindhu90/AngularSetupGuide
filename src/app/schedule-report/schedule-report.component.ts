import { Component, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { Features } from '../_models/features';
import { RegexExpression } from '../_common/regex-expression';
import { UserDetail } from '../_models/user-detail';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { ScheduleReportViewModel, ScheduleReportEmailViewModel, ScheduleReportRelViewModel } from '../_models/schedulereportviewmodel';
import { FeatureService } from '../_services/feature.service';
import { UserService } from '../_services/user.service';
import { ScheduleReportService } from '../_services/schedulereport.service';
import { String } from '../_common/utility-method';
@Component({
    templateUrl: './schedule-report.component.html',
    styles: ['.marginZeroLeft{ margin-left: 0px;  }',
        'small{ margin-left: 15px; }']
})
/** ScheduleReport component*/
export class ScheduleReportComponent {
    private loader: EventEmitter<any>;
    sourceFeatures: Features[];
    targetFeatures: Features[];
    multipleEmailAddressregx: RegExp = RegexExpression.multipleEmailAddress;
    sourceUserDetails: UserDetail[];
    targetUserDetails: UserDetail[];
    frequencyArray: SelectItem[];
    model: ScheduleReportViewModel;
    reportGuid: string;
    /** ScheduleReport ctor */
    constructor(private globalEvent: GlobalEventsManager,
        private confirmationservice: ConfirmationService,
        private featureservice: FeatureService,
        private userservice: UserService,
        private scheduleReportService: ScheduleReportService,
        private route: ActivatedRoute,
        private router: Router,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.model = new ScheduleReportViewModel();

        this.route.params.subscribe(params => {
            this.route.queryParams.subscribe(params => {
                this.reportGuid = params['reportguid'] || "";

            });

        });

        //this.reportGuid = 'E5B13380-8AF0-4EEF-A595-68274C200491';
        this.loadfrequencyArray();
        let p1 = this.loadFeaturesForScheduleReport();
        let p2 = this.loadUsersForScheduleReport();
        this.loader.emit(Promise.all([p1, p2]).then(() => {
            this.loadScheduleReportByGUID();

        }
        ));
    }

    ngAfterViewChecked() {

    }

    loadFeaturesForScheduleReport(): Promise<any> {
        this.clearFeatureSet();

        return this.featureservice.getFeaturesForScheduleReport().then((data) => {
            if (data && data.length > 0) {
                this.sourceFeatures = data;
            }
        });
    }

    clearFeatureSet() {
        this.sourceFeatures = [];
        this.targetFeatures = [];
    }

    loadfrequencyArray() {

        this.frequencyArray = [];

        this.frequencyArray.push({
            label: "Invoice Load", value: 1
        });
        this.frequencyArray.push({
            label: "Manual", value: 2
        })
        this.frequencyArray.push({
            label: "Send Now", value: 3
        })
    }

    loadUsersForScheduleReport(): Promise<any> {
        this.clearUserSet();
        return this.userservice.getUsersForScheduleReport().then((data) => {
            if (data && data.length > 0) {
                this.sourceUserDetails = data;
            }
        });
    }

    clearUserSet() {
        this.sourceUserDetails = [];
        this.targetUserDetails = [];
    }

    save(form: NgForm) {


        //=====Push ScheduleReportEmailViewModel in Model
        this.model.schedulereportemails = [];
        this.targetUserDetails.forEach((value, index) => {
            let emails = new ScheduleReportEmailViewModel();
            emails.userid = value.id;
            this.model.schedulereportemails.push(emails);
        });

        //=====Push ScheduleReportRelViewModel in Model
        this.model.schedulereportrels = [];
        this.targetFeatures.forEach((value, index) => {
            let emails = new ScheduleReportRelViewModel();
            emails.featureid = value.featureid;
            this.model.schedulereportrels.push(emails);
        });

        //=====Push OtherEmails in Model   
        if (this.model.otherEmails != null && !String.isNullOrWhiteSpace(this.model.otherEmails)) {

            this.model.otherEmails.split(';').forEach((value, index) => {
                if (!String.isNullOrWhiteSpace(value)) {
                    let emails = new ScheduleReportEmailViewModel();
                    emails.email = value;
                    this.model.schedulereportemails.push(emails);
                }

            });
        }
        this.loader.emit(this.scheduleReportService.saveScheduleReport(this.model).subscribe((result: any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            this.router.navigate(['saved-report'], {});
                        }
                    }
                });
            }
        }));
    }

    loadScheduleReportByGUID() {
        if (this.reportGuid) {

            //setTimeout(
            this.scheduleReportService.loadScheduleReportByGUID(this.reportGuid).then((data) => {
                this.model = data;

                //====Set targetUserDetails from Updated Model..
                this.targetFeatures = [];
                this.model.schedulereportrels.forEach((value, index) => {
                    let feature = this.sourceFeatures.filter((sValue) => sValue.featureid == value.featureid)[0];
                    if (feature) {
                        let index = this.sourceFeatures.indexOf(feature);
                        this.sourceFeatures.splice(index, 1);
                        this.targetFeatures.push(feature);
                    }

                });

                //====Set targetUserDetails from Updated Model..
                this.targetUserDetails = [];
                this.model.otherEmails = "";
                this.model.schedulereportemails.forEach((schedulereportemail, index) => {

                    if (schedulereportemail.userid) {
                        let userDetail = this.sourceUserDetails.filter((sValue) => sValue.id == schedulereportemail.userid)[0];
                        if (userDetail) {
                            let index = this.sourceUserDetails.indexOf(userDetail);
                            this.sourceUserDetails.splice(index, 1);
                            this.targetUserDetails.push(userDetail);
                        }
                    }
                    else {
                        this.model.otherEmails = this.model.otherEmails + schedulereportemail.email + ';';
                    }

                });

            })
            // , 3000);
        }

    }

}