import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ResetPassword } from '../_models/resetpassword';
import { UserService } from '../_services/user.service';
import { ClientControlService } from '../_services/clientcontrol.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { RegexExpression } from '../_common/regex-expression';
import { UtilityMethod } from '../_common/utility-method';


@Component({
    selector: 'set-password',
    templateUrl: './set-password.component.html'
})
export class SetPasswordComponent implements OnInit {
    private loader: EventEmitter<any>;
    public myForm: FormGroup;

    // used to enable/disable submit button based on if guid/requset is valid
    public validRequest: boolean = true;

    // the message the api returns which we show to user
    setPasswordMessage: string = '';

    //if the password is set then this will be true
    successStatus: boolean = false;

    //username will be set if we find the user by param Guid
    userName: string = '';

    // used to disable button if there is a pending request
    loading: boolean = false;

    // query string parameter
    resetGuidParam: string;

    // resetPassword model
    resetPassword: ResetPassword;
    passwordRegex = RegexExpression.password8CharRegex;
    passwordMessage: string = UtilityMethod.password8CharMsg;
    constructor(private formBuilder: FormBuilder,
        private activateRoute: ActivatedRoute,
        private userService: UserService,
        private globalEvent: GlobalEventsManager,
        private router: Router,
        private clientcontrolservice: ClientControlService) {
        this.loader = globalEvent.busySpinner;

    }
    createForm() {
        // create the dynamic form with control
        this.myForm = new FormGroup({
            resetGuid: new FormControl(),
            //requestType: new FormControl(),
            // password group, because we apply the validation on both of them
            passwords: this.formBuilder.group({
                password: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100), this.passwordValid])),
                confirmPassword: new FormControl('', Validators.compose([<any>Validators.required]))
            }, { validator: this.areEqual('password', 'confirmPassword') })
        });
    }
    passwordRegexPattern() {
        this.clientcontrolservice.passwordRegexPattern().then((data) => {
            if (data && data.passwordregex && data.passwordmessage) {
                this.passwordRegex = new RegExp(data.passwordregex);
                this.passwordMessage = data.passwordmessage;;
            }

        });
    }

    ngOnInit() {
        this.createForm();
        this.loader.emit(this.passwordRegexPattern());
        // validates the guid
        this.activateRoute.params.subscribe((data) => {
            if (data != null) {
                this.resetGuidParam = data['d'];
                if (this.resetGuidParam != undefined) {
                    this.myForm.controls['resetGuid'].setValue(this.resetGuidParam);
                    this.setPasswordMessage = 'Please wait...';
                    // if local validation if successful, validate from API
                    this.userService.validateSetPassword(this.resetGuidParam).subscribe((dataValidatedRequest: any) => {
                        if (dataValidatedRequest) {
                            if (!dataValidatedRequest.status) {// if the status is false then the validation is failed and we have to disable the control
                                this.setPasswordMessage = dataValidatedRequest.msg;
                                this.userName = ''; //No user found so make the username blank
                                this.validRequest = false;
                                this.successStatus = false;
                                (this.myForm.controls['passwords'] as FormGroup).controls['password'].disable();
                                (this.myForm.controls['passwords'] as FormGroup).controls['confirmPassword'].disable();
                            }
                            else {// if the guid is valid user guid then controls are enabled and say hello to the user
                                this.setPasswordMessage = '';
                                this.userName = 'Hello! ' + dataValidatedRequest.msg;
                                this.validRequest = true;
                                (this.myForm.controls['passwords'] as FormGroup).controls['password'].enable();
                                (this.myForm.controls['passwords'] as FormGroup).controls['confirmPassword'].enable();
                            }
                        }


                    });
                }
                else {
                    this.router.navigate(['login']);
                    return false;
                }
            }
            else {
                this.router.navigate(['login']);
                return false;
            }
        })
    }

    // validates as per our regex
    passwordValid(c: FormControl) {
        let EMAIL_REGEXP = this.passwordRegex;

        return EMAIL_REGEXP.test(c.value) ? null : {
            passwordValid: {
                valid: false
            }
        };
    }

    // validates if password and confirm password are same
    areEqual(passwordKey: string, confirmPasswordKey: string) {
        return (group: FormGroup): { [key: string]: any } => {
            let password = group.controls[passwordKey];
            let confirmPassword = group.controls[confirmPasswordKey];
            if (password.value !== confirmPassword.value) {
                return {
                    mismatchedPasswords: true
                };
            }
        }
    }

    // sets the password
    setPassword() {
        if (!this.validRequest)
            return false;

        this.setPasswordMessage = 'Please wait...';
        this.loading = true;
        this.resetPassword = this.createResetPasswordModel();
        this.userService.setPassword(this.resetPassword).subscribe((result: any) => {
            if (result) {
                this.successStatus = result.status;
                this.setPasswordMessage = result.msg;
                this.loading = false;
                if (result.status) {
                    this.validRequest = false;

                    (this.myForm.controls['passwords'] as FormGroup).controls['password'].disable();
                    (this.myForm.controls['passwords'] as FormGroup).controls['confirmPassword'].disable();
                }
            }
        });
    }

    // create the reset password model
    createResetPasswordModel() {
        var resetPassword: ResetPassword = new ResetPassword();
        resetPassword.resetguid = this.myForm.controls['resetGuid'].value;
        //resetPassword.requesttype = this.myForm.controls['requestType'].value || 0;
        resetPassword.password = (this.myForm.controls['passwords'] as FormGroup).controls['password'].value;
        resetPassword.confirmpassword = (this.myForm.controls['passwords'] as FormGroup).controls['confirmPassword'].value;
        return resetPassword;
    }

    // redirect to login page
    redirectToLogin() {
        this.router.navigate(['login']);
        return false;
    }
}
