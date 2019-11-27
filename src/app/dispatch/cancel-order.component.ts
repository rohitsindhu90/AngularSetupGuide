import { Component, EventEmitter, Input, OnDestroy, AfterViewChecked } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from '../_services/order/order.service';
import { SessionStroageProvider } from '../_helper/session.storage.provider';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({
    selector: 'cancel-order',
    templateUrl: './cancel-order.component.html'
})
/** view-report component*/
export class CancelOrderComponent implements AfterViewChecked, OnDestroy {
    private loader: EventEmitter<any>;
    @Input() orderGuid: string;
    @Input() company: string;
    @Input() orderRefNo: string;
    @Input() dnsName: string;
    cancellationreason: string;
    constructor(private globalEvent: GlobalEventsManager,
        public activeModal: NgbActiveModal,
        private orderService: OrderService,
        private authenticationService: AuthenticationService, 
    ) {
        this.loader = globalEvent.busySpinner;
    }


    ngAfterViewChecked() {

    }

    cancelOrder() {
        if (this.orderGuid) {
            SessionStroageProvider.setDNSSessionStorage(this.dnsName);
            let userDetail = this.authenticationService.currentUserValue;
            return  this.loader.emit(
                this.orderService.cancelOrderByGuid(this.orderGuid, this.cancellationreason, userDetail).subscribe(res => {
                this.activeModal.close({ deleteRow: true });
            }) );
        }
    }

    ngOnDestroy() {
        SessionStroageProvider.clearSessionStorage();
    }

}