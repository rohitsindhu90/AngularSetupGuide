import { Component, Input, EventEmitter } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from 'src/app/_common/global-event.manager';
import { CTNDetailService } from 'src/app/_services/ctndetail.service';
import { ConfirmationService } from 'primengdevng8/api';


@Component({
    selector: 'edit-sparenumber',
    templateUrl: 'edit-sparenumber-report.component.html'
})

export class EditSapreNumberReportComponent {


    private loader: EventEmitter<any>;
    @Input() item: any;
    @Input() componentname: string;
    orderreferencenumber: string;
    labelText: string;
    error: string;


    constructor(private globalEvent: GlobalEventsManager, private cTNDetailService: CTNDetailService,
        private confirmationservice: ConfirmationService,
        private activeModal: NgbActiveModal) {
        this.loader = globalEvent.busySpinner;
    }


    ngOnInit() {

        this.labelText = this.componentname;
        this.orderreferencenumber = this.item.orderreferencenumber;
    }


    save(item: any) {

        this.loader.emit(this.cTNDetailService.updateSpareNumberOrderRefNumber(this.orderreferencenumber, this.item.mobilenumber).subscribe(result => {

            if (result) {
                this.confirmationservice.confirm({
                    message: "Updated Successfully !!",
                    key: 'modal-confirmation-dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result) {
                            this.activeModal.close(true);
                        }
                    }
                });
            }
            else {
                this.error = "Update Failed";
            }
        }));
    }

}