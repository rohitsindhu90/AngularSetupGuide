import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primengdevng8/api';
import { UserAgreement } from '../_models/useragreement';
import { UserService } from '../_services/user.service';
import { GenericService } from '../_services/generic.service';
import { CompanyService } from '../_services/company.service';
import { Roles } from '../_services/enumtype';
import { AgreementService } from '../_services/agreement.service';
import { CompanyUserAgreement } from '../_models/companyuseragreement';
import { UserDetail } from '../_models/user-detail';
import { UserFilter } from '../_models/user-filter';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({
    selector: 'client-agreement',
    templateUrl: './client-agreement.component.html'
})
export class ClientUserAgreementComponent implements OnInit {

    private loader: EventEmitter<any>;
    userfilterheadermeta: any[];
    userFilterList: UserFilter[];
    filteredname: string;
    companyUserAgreement: CompanyUserAgreement[];
    userArray: any[];
    userDetail: UserDetail[];
    model: UserAgreement = new UserAgreement();
    searchuserautocompletePlaceHolderText: string = "Search by name,staffid,username";


    constructor(private route: Router,
        private userService: UserService,
        private confirmationservice: ConfirmationService,
        private genericService: GenericService,
        private companyservice: CompanyService,
        private globaleventsmanager: GlobalEventsManager,
        private agreementService: AgreementService) {
        this.loader = this.globaleventsmanager.busySpinner;
    }

    ngOnInit() {

        this.userfilterheadermeta = [{ field: "name", header: 'Name' }];
        this.userfilterheadermeta.push({ field: 'username', header: 'User Name' });
        this.userfilterheadermeta.push({ field: 'emailaddress', header: 'Email' });


        var p2 = this.bindUserAgreementGrid();

        this.loader.emit(Promise.all([p2]));
    }

    /**
  * Load the company user aggrement list
  */
    bindUserAgreementGrid() {
        return this.loader.emit(this.agreementService.getUserAgreementList().then(data => {
            this.companyUserAgreement = data;
        }));
    }


    save(form: NgForm) {
        this.loader.emit(
            this.agreementService.CreateAgreement(this.model).subscribe(result => {
                if (result) {
                    this.confirmationservice.confirm({
                        message: result,
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (result == 'Customer agreement sent successfully') {
                                //form.resetForm();
                                this.bindUserAgreementGrid();
                            }
                        }
                    });
                }
            }));
    }


    sendLogin(selectedRow: any) {
        var useragreementguid = selectedRow["useragreementguid"];
        this.agreementService.resendCompanyAgreement(useragreementguid).subscribe(result => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result == 'Customer agreement sent successfully') {
                            this.bindUserAgreementGrid();
                        }
                    }
                });
            }
        });
        return false;
    }

    dignose() {
        return JSON.stringify(this.model);
    }

    userSearch(event: any) {
        setTimeout(() => {

            return this.userService.getUsersByFilter(event.query).then(data => {
                this.userFilterList = data;
            });
        }, 100);
    }


    handleSelectClick(event: any) {
        setTimeout(() => {

            if (event.id > 0) {
                this.model.emailaddress = event.emailaddress;
                this.model.userguid = event.userguid;
            }
        }, 100)

    }

    onClear(event: any) {
        this.model.emailaddress = '';
        this.model.userguid = null;
    }

}

