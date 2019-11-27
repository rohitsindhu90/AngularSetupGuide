import { Component, EventEmitter, Input } from '@angular/core';
import { GlobalEventsManager } from '../../../_common/global-event.manager';
import { Column } from 'src/app/_models/primeng-datatable';
import { CareViewModel } from 'src/app/_models/care/care';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { CareService } from 'src/app/_services/care.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';

@Component({
    selector: 'care-detail-report',
    templateUrl: './care-report-detail.component.html',
    styles: ['.wrodWrap { word-wrap: break-word;}']
})
export class CareReportDetailComponent {
    private loader: EventEmitter<any>;
    @Input() CareEnquiryID: number;
    model: CareViewModel;
    datacolumns: Column[] = [];
    constructor(private globalEvent: GlobalEventsManager,
        private invoicereportservice: InvoiceReportService,
        private careservice: CareService) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            res.forEach(x => x.description = x.description + 'description');
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        this.loader.emit(this.careservice.GetCareEnquiryByID(this.CareEnquiryID).then(data => {
            this.model = data;
        }));
    }
}