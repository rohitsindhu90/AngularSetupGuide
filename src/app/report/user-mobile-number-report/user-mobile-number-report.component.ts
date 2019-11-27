import { Component, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { UserCTNViewModel } from 'src/app/_models/report/user-ctn-model';
import { SelectItem } from 'primengdevng8/api';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { ActivatedRoute } from '@angular/router';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { Column } from 'src/app/_models/primeng-datatable';

@Component({
    //selector: 'top-usage-report',
    templateUrl: './user-mobile-number-report.component.html'
})
export class UserMobileNumberReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    userGuid: string;
    model: UserCTNViewModel;
    datacolumns: Column[] = [];
    statusFilterset: SelectItem[];

    statusFilter:any;
    constructor(private invoicereportservice: InvoiceReportService,
        private globalEvent: GlobalEventsManager,
        private ctndetailservice: CTNDetailService,
        private route: ActivatedRoute,
        private location: Location,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        this.route.params.subscribe(params => {
            this.userGuid = params["uid"];
            this.loadData();
        });
    }

    loadData() {
        this.loader.emit(this.ctndetailservice.GetUserCTNDetails(this.userGuid).then(r => {
            this.model = r;
            this.clearGridFilter();

            if (r != null && r.ctndetails.length > 0) {
                //Getting  network  list from grid data
                r.ctndetails.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                    return { 'value': q.status, 'label': q.status };
                }).sort((a, b) => {
                    return parseInt(a.value) - parseInt(b.value);
                }).forEach(q => {
                    if (q.value) {
                        this.statusFilterset.push(q);
                    }
                });
            }

        }));
    }



    clearGridFilter() {
        this.statusFilterset = [{ value: null, label: "" }];
    }
    goback() {
        this.location.back();
    }
}