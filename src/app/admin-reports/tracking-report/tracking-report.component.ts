import { NgForm, Validators, FormBuilder } from '@angular/forms'
import { Component, OnInit, EventEmitter } from '@angular/core';
import { CalendarModule } from 'primengdevng8/calendar';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { CompanyAccessHistory } from '../../_models/report/company-access-history';
import { TrackingHistoryService } from '../../_services/trackinghistory.service';
import { Router } from '@angular/router';
import { InvoiceDateService } from '../../_services/invoicedate.service';

@Component({
    selector: 'login-history-report',
    templateUrl: 'tracking-report.component.html'
})

export class TrackingReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    model: CompanyAccessHistory[];
    fromdate?: Date;
    todate?: Date;
    error: string;
    csvfilename: string;
    todaydate: Date;
    constructor(private globalEvent: GlobalEventsManager, private trackingHistoryService: TrackingHistoryService, private router: Router, private invoiceDateService: InvoiceDateService) {

        this.loader = globalEvent.busySpinner;

    }

    ngOnInit() {
        
        
        var date = new Date();
        date.setDate(date.getDate() - 30);


        this.todate = new Date();        
        this.fromdate = date;
        this.todaydate = this.todate;
        if (this.fromdate && this.todate) {
            this.refreshData();
        }
    }

    

    handleRowSelect(event: any) {
        
        let companyaccesshistoryviewmodel: CompanyAccessHistory = event.data;
        this.router.navigate(['login-history-detail-report', this.fromdate.toDateString(), this.todate.toDateString(), companyaccesshistoryviewmodel.companyguid], { queryParams: { cd: companyaccesshistoryviewmodel.companydescription } });
    }

    refreshData() {
        if (this.fromdate === undefined) {
            this.error = "Please select the from date";
            return;
        }
        else if (this.todate === undefined) {
            this.error = "Please select the to date";
            return;
        }
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            this.loader.emit(this.loadTrackingReportReport());
        }

    }

    /**
  Bind Grid
*/
    loadTrackingReportReport(): Promise<any> {
        
        this.csvfilename = "Login History Report" + this.fromdate.toDateString() + "_" + this.todate.toDateString();
        return this.trackingHistoryService.getCompanyAccessReportListAsync(this.fromdate.toDateString(), this.todate.toDateString()).then(data => {
            this.model = data;
        });
    }


}