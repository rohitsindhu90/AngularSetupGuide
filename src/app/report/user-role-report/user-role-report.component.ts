
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit,EventEmitter } from '@angular/core';
import { UserRole } from 'src/app/_models/user-roles';
import { RoleService } from 'src/app/_services/role.service';

@Component({
    //selector: 'top-usage-report',
    templateUrl: './user-role-report.component.html'
})
export class UserRoleReportComponent implements OnInit {
    private loader: EventEmitter<any>;

    model: UserRole[];

    constructor(//private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private route: Router,
        private roleservice:RoleService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.loader.emit(this.roleservice.GetUserWithUserCount().then(r => {
            this.model = r;
        }));
    }

    onRowSelect(event: any) {
        let role: UserRole = event.data;
        this.route.navigate(['user-report'], {
            queryParams:
                {
                    rid: role.roleguid,
                    rdesc: role.roledescription
                }
        });

    }


}