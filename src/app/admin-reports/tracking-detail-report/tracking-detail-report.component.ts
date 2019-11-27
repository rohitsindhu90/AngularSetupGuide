import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { Title } from '@angular/platform-browser';
//import { DataTable, SelectItem } from 'primeng-dev-ng4/primeng';
import { CompanyAccessHistory } from '../../_models/report/company-access-history';
import { AuthenticationService } from '../../_services/authentication.service';
import { TrackingHistoryService } from '../../_services/trackinghistory.service';
import { GlobalEventsManager } from '../../_common/global-event.manager'
import { Router, ActivatedRoute, Data } from '@angular/router';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { ModalPopupService } from "../../_common/modelpopup.service";
import { TrackingDetailPopupReportComponent } from '../tracking-detail-popup-report.component';
// import { TrackingDetailPopupReportComponent } from './tracking-detail-popup-report.component';

@Component({
    selector: 'login-history-detail-report',
    templateUrl: './tracking-detail-report.component.html'
})
export class TrackingDetailReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    model: CompanyAccessHistory[];
    companyguid: string;
    fromdate: Date;
    todate: Date;
    invalidDates: Array<Date>
    sub: any;
    error: string;
    csvfilename: string;
    companyname: string;
    usertypefilterset: any[] = [{ value: null, label: "" }];
    todaydate: Date;
    /**
     * Constructor: used to inject services
   
     */
    constructor(

        private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private router: Router,
        private route: ActivatedRoute,
        private trackingHistoryService: TrackingHistoryService,
        private invoiceDateService: InvoiceDateService,
        private modalService: ModalPopupService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.companyguid = params["cg"];
            this.fromdate = new Date(params["fd"]);
            this.todate = new Date(params["td"]);
            this.sub = this.route.queryParams.subscribe(params => {
                this.companyname = params['cd'] || "";
            });

            this.refreshData();
            this.todaydate = new Date();
        });

    }

    refreshData() {
        if (this.fromdate === undefined) {
            this.error = "Please select from date";
            return;
        }
        else if (this.todate === undefined) {
            this.error = "Please select to date";
            return;
        }
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error.length == 0) {
            this.loader.emit(this.GetCompanyAcessListByCompany());
        }

    }



    GetCompanyAcessListByCompany(): Promise<any> {
        this.csvfilename = this.companyname + " Company Login Report" + this.fromdate.toDateString() + "_" + this.todate.toDateString();
        return this.trackingHistoryService.getCompanyAccessReportListByCompany(this.companyguid, this.fromdate.toDateString(), this.todate.toDateString()).then(q => {
            this.model = q;
            this.clearGridFilter();
            //Getting  user type  list from grid data
            q.filter((obj, index, self) => self.findIndex((t) => { return t.usertype === obj.usertype }) === index).map(q => {
                return { 'value': q.usertype, 'label': q.usertype };
            }).forEach(q => { this.usertypefilterset.push(q); });
        });
    }

    handleRowSelect(event: any) {

        this.modalService.displayViewInPopup("User Login Report", <any>TrackingDetailPopupReportComponent, {
            companyguid: this.companyguid,
            userguid: event.data["userguid"],
            username: event.data["username"],
            companyname: this.companyname,
            fromdate: this.fromdate.toDateString(),
            todate: this.todate.toDateString(),
        }, "md");
    }
    clearGridFilter() {
        this.usertypefilterset = [{ value: null, label: "" }];


    }
    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}