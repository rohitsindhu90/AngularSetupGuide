import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { CompanyAccessHistory } from '../_models/report/company-access-history';
import { TrackingHistoryService } from '../_services/trackinghistory.service';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({
    selector: 'tracking-detail-popup-report',
    templateUrl: './tracking-detail-popup-report.component.html'
})
export class TrackingDetailPopupReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    model: CompanyAccessHistory[];
    @Input() companyguid: string;
    @Input() userguid: string;
    @Input() fromdate: string;
    @Input() todate: string;
    @Input() username: string;
    @Input() companyname: string;
    sub: any;
    error: string;
    csvfilename: string;

    /**
     * Constructor: used to inject services
   
     */
    constructor(
        private globalEvent: GlobalEventsManager,
        private trackingHistoryService: TrackingHistoryService,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.refreshData();
    }

    refreshData() {
        this.loader.emit(this.GetTrackingDetailDrillReportList());
    }

    GetTrackingDetailDrillReportList(): Promise<any> {
        this.csvfilename = this.username + " User Login Report " + this.fromdate + "_" + this.todate;
        return this.trackingHistoryService.getCompanyAccessDetailDrillReportListAsync(this.companyguid, this.userguid, this.fromdate, this.todate).then(q => {
            this.model = q;
        });
    }





}