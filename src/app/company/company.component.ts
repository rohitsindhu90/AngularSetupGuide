import { Component, OnInit, EventEmitter } from '@angular/core';
import { Company } from '../_models/company';
import { CompanyService } from '../_services/company.service';
import { Router } from '@angular/router';
import { DynamicRouteConfig } from '../_guards/auth.guard'
import { AuthenticationService } from '../_services/authentication.service';
import { ConfirmationService } from 'primengdevng8/api';
import { UserDetail } from '../_models/user-detail';
import { UserService } from '../_services/user.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { ThemeProvider } from '../_services/theme-provider';


@Component({
    templateUrl: './company.component.html'
})

export class CompanyComponent implements OnInit {
    model: Company[];
    private loader: EventEmitter<any>;

    constructor(private companyservice: CompanyService,
        private route: Router,
        private authService: AuthenticationService,
        private confirmationService: ConfirmationService,
        private userService: UserService,
        private globaleventsmanager: GlobalEventsManager,
        private themeprovider: ThemeProvider,
    ) {
        this.loader = this.globaleventsmanager.busySpinner;
    }

    ngOnInit() {
        this.loader.emit(this.companyservice.getCompanyList().then(data => {
            this.model = data;
        }));


    }

    handleRowSelect(event: any) {
        let company: Company = event.data;
        this.confirm(company);
        //this can only talk to service
        //if a sysadmin logs into system first time there is no company in local storage
        // we need to set the local storage with new comapny details and create the claim again for webAPI


    }

    confirm(company: Company) {
        // this.confirmationService.confirm({
        //     message: 'Loading ' + company.companydescription + '?',
        //     accept: () => {
        //         debugger;
        let userProfile: UserDetail = this.authService.currentUserValue;
        userProfile.companydetails = company;
        // userProfile.forceload=true;
        this.authService.setUserDetail(userProfile, false);
        // console.log(this.authService.currentUserValue);
        this.getUserForCompany(userProfile);
        this.route.navigate(['/home']);

        //     }
        // });

        DynamicRouteConfig.IsActivated = false;
    }

    getUserForCompany(userDetail: UserDetail) {
        this.loader.emit(this.userService.saveAdminUserInClient(userDetail).then((data: UserDetail) => {
            let userProfile: UserDetail = data;
            //userProfile.usertheme = userDetail.usertheme;
            userProfile.companydetails = userDetail.companydetails;
            userProfile.ClientInfo = userDetail.ClientInfo;
            this.authService.setUserDetail(userProfile);
            // console.log(this.authService.currentUserValue);
        }));
    }

}