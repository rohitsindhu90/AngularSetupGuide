
import { Component, OnInit,  EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import {  ConfirmationService, } from 'primengdevng8/api';

import { GlobalEventsManager } from "../_common/global-event.manager";
import { EmailTypeService } from '../_services/emailtype.service';
import { EmailConfigViewModel } from '../_models/emailconfig.model';
import { RegexExpression } from '../_common/regex-expression';


@Component({
    templateUrl: './emailconfig.component.html'
})
export class EmailConfigComponent implements OnInit {
    private loader: EventEmitter<any>;
    model: EmailConfigViewModel[];
    multipleEmailAddressregx: RegExp = RegexExpression.multipleEmailAddress;
    //  decimalregx: RegExp = RegexExpression.decimal;
    constructor(
        private emailTypeService: EmailTypeService,
        private globalEventsManager: GlobalEventsManager,
        private confirmationservice: ConfirmationService,

    ) {
        this.loader = globalEventsManager.busySpinner;


    }
    ngOnInit() {
        var p1 = this.getEmailTypeList();
        this.loader.emit(Promise.all([p1]));
    }


    getEmailTypeList(): Promise<any> {
        return this.emailTypeService.getEmailTypeList().then(res => {
            this.model = res;
        });
    }


    save(form: NgForm) {

        this.loader.emit(this.emailTypeService.SaveEmailTypes(this.model).subscribe((result:any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            this.ngOnInit();
                            form.resetForm();
                        }
                    }
                });
            }
        }));
    }
}