import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-add-bulk-ctn-confirm',
    templateUrl: './add-bulk-ctn-confirm.component.html',

})
/** add-bulk-ctn-confirm component*/
export class AddBulkCtnConfirmComponent {
    /** add-bulk-ctn-confirm ctor */
    reason: string;
    constructor(private activeModal: NgbActiveModal) {

    }

    save() {
        this.activeModal.close(this.reason);
    }
}