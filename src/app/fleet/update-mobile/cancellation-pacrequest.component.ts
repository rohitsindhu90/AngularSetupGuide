import { Component, Input, OnInit, EventEmitter, } from '@angular/core';
import { CancellationPACRequestModel } from '../../_models/cancellation-pacrequest-popup-model';
import { CTNStatus, Transationtype, CTNEventMaster } from '../../_services/enumtype';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { ConfirmationService } from 'primengdevng8/api';
@Component({
    selector: 'cancellation-pacrequest',
    templateUrl: './cancellation-pacrequest.component.html'
})

export class CancellationPACRequestComponent implements OnInit {
    private loader: EventEmitter<any>;
    @Input() ctnguid: string;
    @Input() componentname: string;
    error: string;
    labelText: string;
    minDate: Date = new Date();

    model: CancellationPACRequestModel = new CancellationPACRequestModel();

    constructor(private ctndetailservice: CTNDetailService,
        private activeModal: NgbActiveModal,
        private confirmationservice: ConfirmationService,
        private globalevent: GlobalEventsManager) {
        this.loader = globalevent.busySpinner;

    }

    ngOnInit() {
        this.labelText = this.componentname;
        this.model.ctnstatusid = CTNStatus.PACRequested;
        this.model.transactiontype = Transationtype.PACRequest;
        this.model.eventtype = CTNEventMaster.PACRequest;
        if (this.componentname.toLowerCase() == "cancellation") {
            this.model.ctnstatusid = CTNStatus.PendingCancellation;
            this.model.transactiontype = Transationtype.Termination;
            this.model.eventtype = CTNEventMaster.Cancellation;
        }
        if (this.componentname != undefined && !this.componentname.toLowerCase().includes('request')) {
            this.labelText = this.labelText + ' Request';
        }

        this.model.ctndetailsguid = this.ctnguid;
        this.model.requestdate = new Date();

    }
    ngAfterViewChecked() {
    }

    save() {
        this.loader.emit(this.ctndetailservice.updateCTNDetailsCancellationPACRequest(this.model).then(res => {
            if (res.success) {

                //var message = this.model.transactiontype == 1 ? "Please note, the requested number will disconnect in 30 days (from next working day)"
                //                                                : "Please note, you will receive the PAC code for your requested number within 2 working days.";


                var message = "Update Successful";
                this.activeModal.close(res.success);

                this.confirmationservice.confirm({
                    message: message,
                    key: 'dialog',
                    rejectVisible: false,
                });


            }
            else {
                this.error = res.message;
            }
        }));
    }
}