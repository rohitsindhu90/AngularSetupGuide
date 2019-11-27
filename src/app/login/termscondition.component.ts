import { Component, OnInit, EventEmitter } from '@angular/core';
import { TermsConditionService } from '../_services/termscondition.service';
import { UserDetail } from '../_models/user-detail';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({

    selector: 'terms-condition',
    templateUrl: './termscondition.component.html'
    //encapsulation: ViewEncapsulation.None,

})

export class TermsConditionComponent implements OnInit {

    pageTitle: string = "Terms & Conditions"
    display: boolean;
    user: UserDetail;

    private loader: EventEmitter<any>;
    content: string = "";

    constructor(private termsConditionService: TermsConditionService,
        private authenticationService: AuthenticationService,
        private router: Router,
        private globalevent:GlobalEventsManager
    ) {
        this.loader=this.globalevent.busySpinner;

    }


    ngOnInit(): void {
        
        this.user = this.authenticationService.currentUserValue;
        if (this.user && this.user.isclient && !this.user.termconditionflag) {
            this.termsConditionService.GetTermsCondition()
                .then((result) => {
                    this.content = result;
                    this.toggleDialog(true);

                });
        }
        //else {
        //    this.navigateToMainPage();
        //}
    }


    handledialog(accept: boolean) {
        this.toggleDialog(false);
        if (accept) {            
            this.loader.emit(this.save().then((data) => { this.navigateToMainPage() }));            
        }
    }
    navigateToMainPage() {
        //after sucessfully logged in, get the default landing page from localstorage and redirect to it.

        this.authenticationService.navigateToMainPage();
    }

    toggleDialog(show: boolean) {
        this.display = show;
    }

    setTermConditionFlag() {
        this.user.termconditionflag = true;
        this.authenticationService.setUserDetail(this.user);
    }
    logout() {
        this.authenticationService.logout();
        this.router.navigateByUrl('/login');
    }

    /**
     * /
     * Save method
     */
    save():Promise<boolean> {
        return this.termsConditionService.AcceptTermsCondition();
    }
}
