import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { SessionStroageProvider } from '../../_helper/session.storage.provider';
import { DispatchErrorLogService } from '../../_services/Admin/dispatcherrorlog.service';
import { OrderViewModel } from '../../_models/order/orderreportviewmodel';
import { OrderReportDetailComponent } from '../../report/order-detail/order-report-detail.component';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ReportingGroupDetailsProvider } from '../../_common/reporting-group-details-provider';
import { OrderService } from '../../_services/order/order.service';
import { Column } from '../../_models/primeng-datatable';
import { OrderConfirmedLoadViewModel } from '../../_models/Admin/orderconfirmedload.model';
import { CancelOrderComponent } from '../cancel-order.component';
import { GlobalEventsManager } from '../../_common/global-event.manager';


@Component({
    selector: 'pending-dispatch',
    templateUrl: './pending-dispatch.component.html'
})


export class PendingDispatchComponent implements OnInit {
    private loader: EventEmitter<any>;
    datacolumns: Column[] = [];
    model: OrderConfirmedLoadViewModel[];
    csvfilename: string = "PendingDispatchOrders";
    constructor(private globalEvent: GlobalEventsManager,
        private dispatchErrorLogService: DispatchErrorLogService,
        private modalpopupservice: ModalPopupService,
        private invoicereportservice: InvoiceReportService,
        private orderservice: OrderService,
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        var p1 = this.getPendingDispatchOrders();
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

    getPendingDispatchOrders() {
        this.dispatchErrorLogService.getPendingDispatchOrders().then((data) => {
            if (data && data.length > 0) {
                this.model = data;
            }
        });
    }

    onRowSelect(data: OrderConfirmedLoadViewModel) {
        if (data.orderguid) {
            SessionStroageProvider.setDNSSessionStorage(data.dnsname);
            this.getReportingGroupDetails(data.orderguid);
        }
    }

    openModalPopup(comp: Component, title: string, params?: any): Promise<any> {
        return this.modalpopupservice.displayViewInPopup(title, comp, params, "lg").result.then((res) => {
            return res;
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

    onDelete(data: OrderConfirmedLoadViewModel) {
        let params: any = { company: data.company, orderGuid: data.orderguid, orderRefNo: data.orderreferencenumber, dnsName: data.dnsname };

        this.openModalPopup(<any>CancelOrderComponent, 'Cancel Order', params).then((res: any) => {

            if (res && res.deleteRow == true) {
                this.model = this.model.filter((val) => {
                    return val.orderguid != data.orderguid;
                });
            }

        });


    }

    onCopyGuid(data: OrderConfirmedLoadViewModel) {
        let el = document.createElement('textarea');
        el.value = data.orderguid;
        el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    ngOnDestroy() {
        SessionStroageProvider.clearSessionStorage();
    }
}
