
import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primengdevng8/api';
import { AgreementService } from '../_services/agreement.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { AppSettingService } from '../_common/appsetting.service';
import { ThemeProvider } from '../_services/theme-provider';





@Component({
    selector: 'agreement-sign',
    templateUrl: './agreement-sign.component.html',
    styles:[
        `label{color: var(--theme-bgcolor);}`
    ]
})
export class AgreementSignComponent implements OnInit {

    chkConfirm: boolean;
    pdfSrc: string;
    page: number = 1;
    display: boolean;

    userAgreementGuid: string;
    agreementdescription: string;
    showButton: boolean = false;
    model: any = {};
    error: string;

    frameLoaded: boolean = false;;

    private loader: EventEmitter<any>;
    constructor(private route: Router,
        private activateRoute: ActivatedRoute,
        private globaleventsmanager: GlobalEventsManager,
        private confirmationservice: ConfirmationService,
        private appsettingservice: AppSettingService,
        private agreementService: AgreementService,
        private themeprovider: ThemeProvider) {
        this.loader = this.globaleventsmanager.busySpinner;

    }

    ngOnInit() {

        this.loader.emit(new Promise<boolean>((resolve) => {
            setInterval(() => {
                if (this.frameLoaded) {
                    resolve(true);
                }
            }, 1000);
        }));
        this.activateRoute.params.subscribe((data) => {
            if (data != null) {
                this.userAgreementGuid = data['d'];

                if (this.userAgreementGuid != undefined) {
                    this.model.userAgreementGuid = this.userAgreementGuid;
                    this.agreementService.CheckActiveAgreement(this.userAgreementGuid).then(res => {
                        if (res) {
                            this.loadAgreement();
                            this.checkCompanyAgreementAccepted();
                        }
                        else {
                            this.error = "Sorry the agreement link is incorrect or no longer valid !";
                        }
                    });

                }
            }
        });
    }
    /**
  * Load the agreement
  */
    loadAgreement() {
        
        this.setThemeControls();

        this.agreementService.getActiveAgreement().then(data => {
            if (data != null) {
                this.agreementdescription = data.description;
                this.pdfSrc = `${this.appsettingservice.apiurl}.pdfAgreementUrl` + data.filename
            }
        });
    }
    setThemeControls() {

        this.themeprovider.getCurrentTheme().then(theme => {
            
            //this.currentTheme = theme;

            if (theme.cssvar != null && theme.cssvar != undefined) {
               // this.dynamicCss = JSON.parse(this.currentTheme.cssvar);
               this.themeprovider.setCSSVar(theme.cssvar) ;

            }
            //this.controlsKeys = Object.keys(this.dynamicCss);
            //this.updateThemeAfterPageRender();
        });
    }

    onIFrameLoad() {
        this.frameLoaded = true;
    }
    checkCompanyAgreementAccepted() {

        if (this.userAgreementGuid != undefined) {
            this.loader.emit(this.agreementService.CheckAgreementAcceptedAsnyc(this.model.userAgreementGuid).then(data => {
                if (data) {
                    this.showButton = false;
                    this.route.navigateByUrl('/login');
                }
                else {
                    setTimeout(() => {
                        this.showButton = true
                    }, 6000);
                }
            }));
        }
    }

    save(form: NgForm) {

        this.loader.emit(
            this.agreementService.acceptAgreement(this.userAgreementGuid).subscribe(result => {
                if (result) {
                    form.resetForm();
                    this.userAgreementGuid = null;

                    this.confirmationservice.confirm({
                        message: "Thank You, an Email with a copy of the Agreement attached will be sent to you.",
                        key: 'dialog',
                        rejectVisible: false,
                        accept: () => {
                            this.route.navigateByUrl('/login');
                        },

                    });
                }
            }));


    }
}

