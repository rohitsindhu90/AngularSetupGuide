import { Component, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ViewReportViewModel } from 'src/app/_models/schedulereportviewmodel';
import { ScheduleReportService } from 'src/app/_services/schedulereport.service';
@Component({
    selector: 'app-view-report',
    templateUrl: './view-report.component.html'
})
/** view-report component*/
export class ViewReportComponent {
    private loader: EventEmitter<any>;
    model: ViewReportViewModel[];
    @Input() reportguid: string;
    csvfilename: string = "ViewReport";
    constructor(private globalEvent: GlobalEventsManager,
        private scheduleReportService: ScheduleReportService,
        private router: Router,
        public activeModal: NgbActiveModal
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        let p1 = this.getViewRepotsByGuidID(this.reportguid);
        this.loader.emit(Promise.all([p1]));
    }

    ngAfterViewChecked() {

    }

    getViewRepotsByGuidID(guid: string): Promise<any> {

        return this.scheduleReportService.getViewRepotsByGuidID(guid).then((data) => {
            if (data && data.length > 0) {
                this.model = data;
            }
        });
    }

    onClick(data: ViewReportViewModel) {
        this.router.navigate([data.url]);

        this.activeModal.close();
    }
}