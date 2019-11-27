import { Component, Input, EventEmitter, OnInit } from '@angular/core';
import { OrderViewModel } from '../../_models/order/orderreportviewmodel';
import { Column } from '../../_models/primeng-datatable';


@Component({
    selector: 'order-report-detail',
    templateUrl: './order-report-detail.component.html'
})
export class OrderReportDetailComponent implements OnInit {
    private loader: EventEmitter<any>;
    @Input() model: OrderViewModel;
    @Input() datacolumns: Column[];
    newconnectionmodel: any;
    constructor() {
    }

    ngOnInit() {

    }


}