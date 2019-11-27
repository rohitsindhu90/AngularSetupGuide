import { Component, Injectable } from '@angular/core';
import { NgbModal, NgbModalOptions, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from "../_modalpopup/modal.component";
import { ConfirmationContent } from "../_modalpopup/confirmation.component";
var $ = require('jquery');

@Injectable({
    providedIn: 'root'
})
export class ModalPopupService {
    constructor(
        private modalService: NgbModal,
        private activeModal: NgbActiveModal) {

    }

    openPopup(modaltitle: string, modalbody: string): NgbModalRef {

        const modalRef = this.modalService.open(NgbdModalContent, this.setModalOptions());
        modalRef.componentInstance.modaltitle = modaltitle;
        modalRef.componentInstance.modalbody = modalbody;
        return modalRef;
    }

    displayViewInPopup(modaltitle: string, type: Component, param?: any, modalSize?: any, keyboard?: boolean): NgbModalRef {
        const modalRef = this.modalService.open(NgbdModalContent, this.setModalOptions(modalSize, keyboard));
        modalRef.componentInstance.modaltitle = modaltitle;
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.param = param;

        return modalRef;
    }

    setModalOptions(modalSize?: any, keyboard?: boolean): NgbModalOptions {
        let modalOptions: NgbModalOptions = { backdrop: "static", keyboard: keyboard != null ? keyboard : true };
        if (modalSize) {
            modalOptions.size = modalSize;
        }
        return modalOptions;
    }

    openConfirmationPopup(modaltitle: string, modalbody: string): NgbModalRef {

        const modalRef = this.modalService.open(ConfirmationContent, this.setModalOptions());
        modalRef.componentInstance.modaltitle = modaltitle;
        modalRef.componentInstance.modalbody = modalbody;
        return modalRef;
    }
    closePopUp() {
        this.activeModal.close();
        $('body ngb-modal-window').remove();
        $('body ngb-modal-backdrop').remove();
    }
}