import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { ConfirmationService } from 'primengdevng8/api';
import { CustomReuseStrategy } from '../_common/custom-route-reuse-strategy';
import { ModalPopupService } from '../_common/modelpopup.service';
import { PinComponent } from '../_modalpopup/pin.component';



@Component({
  //moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, OnDestroy {
  model: any = {};
  loading = false;
  error = '';
  sub: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private confirmationservice: ConfirmationService,
    private modalpopupservice: ModalPopupService,
  ) {

  }

  ngOnInit() {

    this.sub = this.route.queryParams.subscribe(params => {
      let verifyGuid = params['verify'] || "";
      if (verifyGuid) {
        // check if link is valid
        this.authenticationService.verifyEmail(verifyGuid).then((res: any) => {
          this.authenticationService.logout();
          if (res) {
            let msg = '';
            if (res.item2 != '') {
              msg = res.item2;
            }
            else {
              msg = 'Your email has been successfully verified';
            }
            this.confirmationservice.confirm({
              message: msg,
              key: 'publicdialog',
              rejectVisible: false
            });
          }
        });
      }
      else if (this.authenticationService.currentUserValue) {
        this.navigateToMainPage();
      }
      else {
        // reset login status
        this.authenticationService.logout();
      }
    });
  }


  login() {
    //clear if already exist
    this.authenticationService.clearLocalStorage();
    this.error = "";
    this.loading = true;
    if (this.model.username) {
      this.model.username = this.model.username.trim();
    }
    this.authenticationService.login(this.model.username, this.model.password)
      .then((result: any) => {
        if (result == 1) {
          this.navigateToMainPage();                      // sucessfull
        }
        //admin user can not login to client portal
        else if (result == 2) {
          this.error = "As a Onecom User you must access the Client Portal via the Admin Comms Manager Portal.";

        }
        else if (result.resolveStatus == 3) {
          // different IP, ask for OTP
          let params: any = { username: this.model.username, userdetail: result.userDetail };
          this.authenticationService.sendOTP(this.model.username).then((res) => {
            this.modalpopupservice.displayViewInPopup('Verify PIN', <any>PinComponent, params);
          });
        }
        else if (result == 4) {
          // email not verified
          this.authenticationService.sendVerificationMail(this.model.username).then(res => {
            if (res) {
              this.error = "Your email is not verified. Please click on the link sent to you to verify your email.";
            }
            else {
              this.error = "Email doesn’t exist.";
            }
          })
        }
        else if (result == 5) {

          this.error = "Unfortunately, the Client Agreement has not been Accepted by your Company, Access cannot be provided until this has been Completed.";
        }

        else if (result == 6) {
          this.error = this.authenticationService.ipValidationErrorMsg;
        }

        else {                                              // UserName Or Password Not Matched
          this.error = 'Username or password is incorrect';
        }


        this.loading = false;
      });
  }

  navigateToMainPage() {

    //after sucessfully logged in, get the default landing page from localstorage and redirect to it.
    CustomReuseStrategy.clearCompSnapshot();
    this.authenticationService.navigateToMainPage();
    // this.router.navigate(["/home"]);
    // this.checkAutoLoadSite();
  }

  redirectToReset() {
    this.router.navigate(['./reset-password']);
    return false;
  }

  //checkAutoLoadSite() {
  //    if (!this.authenticationService.compareJsVerions()) {
  //        //let w: any = window;
  //        location.reload();
  //    }
  //}

  // checkAutoLoadSite() {
  //     let userDetail: UserDetail = LocalStorageProvider.getUserStorage();
  //     let bodyElement = document.getElementsByTagName('body');
  //     if (bodyElement.length > 0) {
  //         let jsVersionNumberInBrowser = bodyElement[0].getAttribute('app-js-version');
  //         let jsVersionNumberLatest = userDetail.jsversionnumber;
  //         if (jsVersionNumberInBrowser != null && jsVersionNumberInBrowser != "" && jsVersionNumberInBrowser != undefined) {
  //             if (jsVersionNumberInBrowser != jsVersionNumberLatest) {
  //                 location.reload();
  //             }
  //         }
  //     }
  // }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }


  }
}
