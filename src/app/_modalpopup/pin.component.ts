import { Component, Input, ViewChild, ComponentFactoryResolver, Compiler, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { Router, Route, } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccessRightService } from '../_services/access-right.service';
import { AuthenticationService } from '../_services/authentication.service';
import { UserDetail } from '../_models/user-detail';
import { LocalStorageProvider } from '../_common/localstorageprovider';
import { CustomReuseStrategy } from '../_common/custom-route-reuse-strategy';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: "./pin.component.html"
})
export class PinComponent {
    @ViewChild('container', { read: ViewContainerRef, static: false }) target: ViewContainerRef;
    cmpRef: ComponentRef<Component>;
    private isViewInitialized: boolean = false;


    @Input() modaltitle: string;
    @Input() modalbody: string;
    @Input() type: Type<Component>;
    @Input() username: string;
    PIN: string;
    errormsg: string;
    @Input() userdetail: UserDetail;
    disable: boolean = false;
    guardedroute: Route[];
    message: string;

    constructor(public activeModal: NgbActiveModal, private router: Router,
        private accessrightservice: AccessRightService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private authenticationService: AuthenticationService,
        private compiler: Compiler,
    ) {
        this.errormsg = null;
        this.disableLink(true);
    }

    onCancel() {

        this.activeModal.close();
    }

    onSubmit() {

        this.errormsg = null;
        this.authenticationService.verifyOTP(this.username, this.PIN).then(res => {
            if (res) {
                this.activeModal.close();
                //LocalStorageProvider.setUserStorage(this.userdetail);
                // this.store.dispatch({ type: USER_LOGGED_IN });
                this.authenticationService.setUserDetail(this.userdetail);
                CustomReuseStrategy.clearCompSnapshot();
                this.authenticationService.navigateToMainPage();
            }
            else {
                this.errormsg = "Invalid PIN. Please try again.";
            }
        });
    }

    resendVerificationCode() {
        this.disableLink(true);
        return this.authenticationService.sendOTP(this.username);
    }

    disableLink(flag: boolean) {
        var mySubscription = this.startClock();
        this.disable = flag;

        setTimeout(function () {
            this.disable = !flag;
            mySubscription.unsubscribe();
            this.message = '';
        }.bind(this), 60000);
    }

    startClock() {
        return Observable.interval(1000)
            .map((t) => t + 1)
            .subscribe((t) => {
                this.message = (60 - t).toString();
            });
    }

}
