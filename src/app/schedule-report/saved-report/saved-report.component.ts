import { Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SavedReportViewModel } from 'src/app/_models/schedulereportviewmodel';
import { ConfirmationService } from 'primengdevng8/api';
import { ScheduleReportService } from 'src/app/_services/schedulereport.service';
import { ModalPopupService } from 'src/app/_common/modelpopup.service';
import { ViewReportComponent } from '../view-report/view-report.component';
import { SendnowScheduleReportComponent } from '../sendnow-schedulereport/sendnow-schedulereport.component';

@Component({
    selector: 'app-saved-report',
    templateUrl: './saved-report.component.html'
})
/** SavedReport component*/
export class SavedReportComponent {
    private loader: EventEmitter<any>;
    model: SavedReportViewModel[];
    csvfilename: string = "SavedReport";
    frequencyfilter: any[] = [{ value: null, label: "" }];

    qFrequencyfilter: any;

    constructor(private globalEvent: GlobalEventsManager,
        private confirmationservice: ConfirmationService,
        private scheduleReportService: ScheduleReportService,
        private modalPopupService: ModalPopupService,
        private router: Router
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        let p1 = this.getSavedScheduleReports();
        this.loader.emit(Promise.all([p1]));
    }

    ngAfterViewChecked() {

    }

    getSavedScheduleReports(): Promise<any> {

        return this.scheduleReportService.getSavedScheduleReports().then((data) => {
            if (data && data.length > 0) {
                this.model = data;


                //Getting  Frequency  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.frequencydescription === obj.frequencydescription }) === index).map(q => {
                    return { 'value': q.frequencydescription, 'label': q.frequencydescription };
                }).forEach(q => {
                    if (this.frequencyfilter.filter(n => n.value == q.value).length == 0) {
                        this.frequencyfilter.push(q);
                    }
                });
            }
        });
    }

    onEdit(item: SavedReportViewModel) {
        let schedulereportguid = item.schedulereportguid;
        this.router.navigate(['schedule-report'], { queryParams: { reportguid: schedulereportguid } });

    }
    onViewReport(item: SavedReportViewModel) {
        if (item.viewreportcount > 1) {
            let params: any = { reportguid: item.schedulereportguid, componentname: "View Report" };
            this.modalPopupService.displayViewInPopup("View Report", <any>ViewReportComponent, params, "lg").result.then(res => {
                if (res) {


                };
            });
        }
        else {
            this.router.navigate([item.viewreporturl]);
        }
    }
    onDelete(item: SavedReportViewModel) {
        this.confirmationservice.confirm({
            message: "Are you sure want  to delete ?",
            key: 'dialog',
            rejectVisible: false,
            accept: () => {
                this.loader.emit(this.scheduleReportService.deleteScheduleReportByGuid(item.schedulereportguid).subscribe((result: any) => {
                    if (result) {
                        this.confirmationservice.confirm({
                            message: result.message,
                            key: 'dialog',
                            rejectVisible: false,
                            accept: () => {
                                if (result.success) {
                                    this.ngOnInit();
                                }
                            }
                        });
                    }
                }));
            }
        });

    }
    onSendNow(item: SavedReportViewModel) {

        let params: any = { reportguid: item.schedulereportguid, componentname: "Send Now Preview" };
        this.modalPopupService.displayViewInPopup("Send Now Preview", <any>SendnowScheduleReportComponent, params, "lg").result.then(res => {
            if (res) {


            };
        });

    }
}