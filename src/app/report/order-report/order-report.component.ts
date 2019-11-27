import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { OrderReportViewModel, OrderViewModel } from 'src/app/_models/order/orderreportviewmodel';
import { SelectItem } from 'primengdevng8/api';
import { OrderService } from 'src/app/_services/order/order.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { ModalPopupService } from 'src/app/_common/modelpopup.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { OrderReportDetailComponent } from '../order-detail/order-report-detail.component';
import { Column } from 'src/app/_models/primeng-datatable';
import { UtilityMethod } from 'src/app/_common/utility-method';
@Component({
    selector: 'order-report',
    templateUrl: './order-report.component.html',
    styles: ['.tr-minwidth{min-width:240px !important;}']
})
export class OrderReportComponent implements OnInit {
    loader: EventEmitter<any>;
    startDate: Date;
    endDate: Date;
    model: OrderReportViewModel;
    gridModel: any[] = [];
    datacolumns: Column[] = [];
    error: string;
    gridgrouping: boolean = false;
    networkfilterset: SelectItem[];
    benfilterset: SelectItem[];
    orderstatusfilterset: SelectItem[];

    qNetworkFilter:any;
    qBenFilter:any;
    qOrderStatusFilter:any;

    constructor(private orderservice: OrderService,
        private invoicedateservice: InvoiceDateService,
        private invoicereportservice: InvoiceReportService,
        private modalpopupservice: ModalPopupService,
        private globalEvent: GlobalEventsManager) {
        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        let todayDate = new Date();
        this.startDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
        this.endDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);

        this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            res.forEach(x => x.description = x.description + 'description');
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        this.loadReportData();
    }

    clearGridFilter() {
        this.gridModel = [];
        this.networkfilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
        this.orderstatusfilterset = [{ value: null, label: "" }];
    }

    loadReportData() {
        this.loader.emit(this.orderservice.GetOrderReportAsync('ALL', UtilityMethod.formatDateExtended(this.startDate), UtilityMethod.formatDateExtended(this.endDate)).then(data => {
            this.model = data;
            this.clearGridFilter();
            if (this.model != undefined && this.model.orderlist != undefined) {
                this.model.orderlist.forEach(d => {

                    if (d.orderdetails != undefined) {

                        d.orderdetails.forEach(o => {
                            let keys = Object.keys(d);
                            keys.forEach(k => {
                                if (k != "orderdetails") {
                                    o[k] = d[k];
                                }
                            });

                            this.gridModel.push(o);
                        });
                    }
                });
            }

            if (this.gridModel && this.gridModel.length > 0) {
                //Getting  network  list from grid data
                this.gridModel.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                    return { 'value': q.networkdescription, 'label': q.networkdescription };
                }).forEach(q => {
                    this.networkfilterset.push(q);
                });
                //Getting  ben  list from grid data
                this.gridModel.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                    return { 'value': q.bendescription, 'label': q.bendescription };
                }).forEach(q => {
                    this.benfilterset.push(q);
                });

                //Getting  ben  list from grid data
                this.gridModel.filter((obj, index, self) => self.findIndex((t) => { return t.orderstatusstring === obj.orderstatusstring }) === index).map(q => {
                    return { 'value': q.orderstatusstring, 'label': q.orderstatusstring };
                }).forEach(q => {
                    this.orderstatusfilterset.push(q);
                });
            }
        }));
    }

    onRowSelect(data: any) {
        let detailData: OrderViewModel = this.model.orderlist.filter(x => x.orderreferencenumber == data.orderreferencenumber)[0];
        let params: any = { model: detailData, datacolumns: this.datacolumns };
        this.openModalPopup(<any>OrderReportDetailComponent, 'Order Detail', params);
    }


    openModalPopup(comp: Component, title: string, params?: any) {
        this.modalpopupservice.displayViewInPopup(title, comp, params, "lg").result.then(res => {
        });
    }

    onSelect() {
        this.error = this.invoicedateservice.validateInvoiceDateRange(this.startDate, this.endDate);
    }

}