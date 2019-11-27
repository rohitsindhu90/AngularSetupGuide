import { Input, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDetail } from '../_models/user-detail';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    templateUrl: './access-denied.component.html'
})
export class AccessDeniedComponent implements OnInit {

    @Input() ispopup: boolean = false;

    userDetail: UserDetail;

    constructor(private activeModal: NgbActiveModal, public authservice: AuthenticationService) {

    }



    ngOnInit() {
        this.userDetail = this.authservice.currentUserValue;
    }

    closePopup() {
        this.activeModal.close();
    }

    backToAdmin() {
        var ele = document.getElementById("backToAdmin");
        if (ele) {
            ele.click();
        }

    }

}