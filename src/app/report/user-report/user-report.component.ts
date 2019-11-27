import { Component, OnInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common'
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { UserDetail } from 'src/app/_models/user-detail';
import { SelectItem } from 'primengdevng8/api';
import { UserService } from 'src/app/_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { String } from '../../_common/utility-method';

@Component({
    //selector: 'top-usage-report',
    templateUrl: './user-report.component.html'
})
export class UserReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    roleGuid: string;
    roleDescription: string;
    model: UserDetail[];
    statusFilterset: SelectItem[];
    statusFilter:any;
    constructor(
        private globalEvent: GlobalEventsManager,
        private userservice: UserService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.roleGuid = params["rid"];
            this.roleDescription = params["rdesc"];
            let data = this.route.data;
            let title = data['_value']['title'];
            //if (data && this.roleGuid) {
            //    //data['_value']['title'] = String.Format(title, ["Role Detail "]);
            //}
            //else {
            data['_value']['title'] = String.Format(title, [""]);
            //}

            this.loader.emit(this.loadGrid());
        });
    }
    loadGrid(): Promise<any> {
        return this.userservice.GetUserListWithCTNCount(this.roleGuid).then(r => {
            this.model = r;

            this.clearGridFilter();
            //Getting  network  list from grid data
            r.filter((obj, index, self) => self.findIndex((t) => { return t.status === obj.status }) === index).map(q => {
                return { 'value': q.status, 'label': q.status };
            }).sort((a, b) => {
                return parseInt(a.value) - parseInt(b.value);
            }).forEach(q => {
                if (q.value) {
                    this.statusFilterset.push(q);
                }
            });
        })
    }

    clearGridFilter() {
        this.statusFilterset = [{ value: null, label: "" }];
    }
    onRowSelect(event: any) {
        let user: UserDetail = event.data;
        this.router.navigate(['user-mobilenumber-report', user.userguid]);

    }

    goback() {
        this.location.back();
    }
}