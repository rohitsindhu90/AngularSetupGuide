import { Component, Input, OnInit, OnChanges, EventEmitter, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { ClientTransactionSummaryGridModel, ClientTransactionDetailGridModel } from '../../_models/report/clienttransaction';
import { ClientTrnsactionService } from '../../_services/clienttransaction.service';

@Component({
    selector: 'client-transactions',
    templateUrl: './client-transaction-report.component.html'
})


export class ClientTransactionComponent implements OnInit {

    private loader: EventEmitter<any>;    
    fromdate?: Date;
    todate?: Date;
    error: string;
    csvfilename: string;
    todaydate: Date;
    summarymodel: ClientTransactionSummaryGridModel[];
    detailmodel: ClientTransactionDetailGridModel[];

    constructor(private globalEvent: GlobalEventsManager, private invoiceDateService: InvoiceDateService, private clientTrnsactionService:ClientTrnsactionService) {

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
            this.loader.emit(this.loadClientTransactionReport());
        }
    }

    loadClientTransactionReport(): Promise<any> {
           
        return this.clientTrnsactionService.getClientTransactionReport(this.fromdate.toDateString(), this.todate.toDateString()).then(data => {
            this.csvfilename = "Client Transactions Report" + this.fromdate.toDateString() + "_" + this.todate.toDateString();
            this.summarymodel = data.clienttrasacntionsummaryviewmodel;
            this.detailmodel = data.clienttrasacntiondetailviewmodel; 
        });
    }   
}