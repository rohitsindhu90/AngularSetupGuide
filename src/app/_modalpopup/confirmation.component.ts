import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'confirmation-modal-content',
    templateUrl: "./confirmation.component.html"
})
export class ConfirmationContent {

    @Input() modaltitle: string;
    @Input() modalbody: string;

    constructor(public activeModal: NgbActiveModal) {
    }

    // create new user or edit new user
    onSubmit(id: string) {
        if (id == "btnYes") {
            this.activeModal.close(true);
        }
        else {
            this.activeModal.close(false);
        }
    }
}
