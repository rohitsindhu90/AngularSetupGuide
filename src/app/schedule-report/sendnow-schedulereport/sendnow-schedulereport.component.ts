import { Component, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ViewReportViewModel, SendNowViewModel } from 'src/app/_models/schedulereportviewmodel';
import { ScheduleReportService } from 'src/app/_services/schedulereport.service';


@Component({
    selector: 'app-sendnow-schedulereport',
    templateUrl: './sendnow-schedulereport.component.html'
})
/** Sendnow-Schedulereport component*/
export class SendnowScheduleReportComponent {
    private loader: EventEmitter<any>;
    model: ViewReportViewModel[];
    @Input() reportguid: string;
    modelSendNow: SendNowViewModel;
    constructor(private globalEvent: GlobalEventsManager,
        private scheduleReportService: ScheduleReportService,
        public activeModal: NgbActiveModal
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        let p1 = this.getViewRepotsByGuidID(this.reportguid);
        let p2 = this.getEmailToByGuidId(this.reportguid);
        this.loader.emit(Promise.all([p1, p2]));
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

    getEmailToByGuidId(guid: string): Promise<any> {
        this.modelSendNow = new SendNowViewModel();
        return this.scheduleReportService.getEmailToByGuidId(guid).then((data) => {
            if (data) {
                this.modelSendNow = data;
            }
        });
    }

    onClick() {
        //this.router.navigate([data.url]);

        this.activeModal.close();
    }

    sendNow() {
        this.loader.emit(this.scheduleReportService.sendNowByGuid(this.reportguid).subscribe((data) => {
            if (data) {
                this.activeModal.close();
            }
        }));
    }
}