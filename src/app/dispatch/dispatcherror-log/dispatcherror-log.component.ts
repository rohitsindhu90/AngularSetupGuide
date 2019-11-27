import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { DispatchErrorLogModel } from '../../_models/Admin/dispatcherrorlog.model';
import { DispatchErrorLogService } from '../../_services/Admin/dispatcherrorlog.service';
import { OrderViewModel } from '../../_models/order/orderreportviewmodel';
import { OrderReportDetailComponent } from '../../report/order-detail/order-report-detail.component';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ReportingGroupDetailsProvider } from '../../_common/reporting-group-details-provider';
import { OrderService } from '../../_services/order/order.service';
import { Column } from '../../_models/primeng-datatable';
import { SessionStroageProvider } from '../../_helper/session.storage.provider';
import { GlobalEventsManager } from '../../_common/global-event.manager';

@Component({
    selector: 'dispatcherror-log',
    templateUrl: './dispatcherror-log.component.html'
})


export class DispatchErrorLogComponent implements OnInit {
    private loader: EventEmitter<any>;
    datacolumns: Column[] = [];
    model: DispatchErrorLogModel[];
    csvfilename: string = "DispatchLog_Report";
    constructor(private globalEvent: GlobalEventsManager,
        private dispatchErrorLogService: DispatchErrorLogService,
        private modalpopupservice: ModalPopupService,
        private invoicereportservice: InvoiceReportService,
        private orderservice: OrderService,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        var p1 = this.loadDispatchErrorLogList();
        this.loader.emit(Promise.all([p1]));
    }

    ngAfterViewChecked() {

    }

    getReportingGroupDetails(orderGuid: string) {
        this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            res.forEach(x => x.description = x.description + 'description');
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
            this.loadOrderDetailData(orderGuid);

        });
    }

    loadDispatchErrorLogList() {
        this.dispatchErrorLogService.getDispatchErrorLogList().then((data) => {
            if (data && data.length > 0) {
                this.model = data;
            }
        });
    }

    onRowSelect(data: DispatchErrorLogModel) {
        if (data.orderguid) {
            SessionStroageProvider.setDNSSessionStorage(data.dnsname);
            this.getReportingGroupDetails(data.orderguid);
        }

    }


    openModalPopup(comp: Component, title: string, params?: any) {
        this.modalpopupservice.displayViewInPopup(title, comp, params, "lg").result.then(res => {

        });
    }

    loadOrderDetailData(orderGuid: string) {
        this.loader.emit(
            this.orderservice.getOrderDetailByOrderGuid(orderGuid).then(data => {
                let detailData: OrderViewModel = data.orderlist[0];
                let params: any = { model: detailData, datacolumns: this.datacolumns };
                this.openModalPopup(<any>OrderReportDetailComponent, 'Order Detail', params);
            }));

    }

    ngOnDestroy() {
        SessionStroageProvider.clearSessionStorage();
    }
}

