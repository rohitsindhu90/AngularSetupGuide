import { Component, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ChangePassword } from '../_models/change-password';
import { UserService } from '../_services/user.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { ClientControlService } from '../_services/clientcontrol.service';
import { RegexExpression } from '../_common/regex-expression';
import { UtilityMethod } from '../_common/utility-method';
import { AuthenticationService } from '../_services/authentication.service';


@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit {
    private loader: EventEmitter<any>;

    public myForm: FormGroup;

    // used to enable/disable submit button based on if guid/requset is valid
    private validRequest: boolean = true;

    // the message the api returns which we show to user
    setPasswordMessage: string = '';

    //if the password is set then this will be true
    successStatus: boolean = false;

    // used to disable button if there is a pending request
    loading: boolean = false;

    // to set the model
    model: ChangePassword = new ChangePassword();

    errormsg: string = '';
    passwordRegex = RegexExpression.password8CharRegex;
    passwordMessage: string = UtilityMethod.password8CharMsg;
    constructor(private formBuilder: FormBuilder, private userService: UserService,
        private globalEvent: GlobalEventsManager,
        private clientcontrolservice: ClientControlService,
        private authService: AuthenticationService) {
        this.loader = globalEvent.busySpinner;
        // create the dynamic form with control
        //this.createForm();

    }
    createForm() {

        this.myForm = new FormGroup({
            passwords: this.formBuilder.group({
                currentpassword: new FormControl('', Validators.compose([<any>Validators.required])),
                newpassword: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(50), this.passwordValid.bind(this)])),
                confirmpassword: new FormControl('', Validators.compose([<any>Validators.required]))
            }, { validator: this.areEqual('newpassword', 'confirmpassword') })
        });

    }
    // ngAfterViewInit() {
    //     this.createForm();
    // }
    ngOnInit() {
        //this.passwordRegexPattern();

        this.loader.emit(this.passwordRegexPattern());
    }
    passwordRegexPattern() {
        let userDetail = this.authService.currentUserValue;
        if (userDetail.adminuser) {
            this.createForm();
        }
        else {
            this.clientcontrolservice.passwordRegexPattern().then((data) => {
                if (data && data.passwordregex && data.passwordmessage) {
                    this.passwordRegex = new RegExp(data.passwordregex);
                    this.passwordMessage = data.passwordmessage;;
                }
                this.createForm();
            });
        }
    }

    // validates as per our regex
    passwordValid(c: FormControl) {
        //let EMAIL_REGEXP = /^(?=.*[A-Z])(?=.*?[0-9]).{8,}/;
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
                }

            };
        }
    }


    // sets the password
    changepassword() {
        this.loading = true;
        this.model.currentpassword = (this.myForm.controls['passwords'] as FormGroup).controls['currentpassword'].value;
        this.model.newpassword = (this.myForm.controls['passwords'] as FormGroup).controls['newpassword'].value;
        this.model.confirmpassword = (this.myForm.controls['passwords'] as FormGroup).controls['confirmpassword'].value;
        this.loader.emit(
            this.userService.changePassword(this.model).subscribe(result => {
                if (result) {
                    this.loading = false;
                    if (result.status) {
                        this.setPasswordMessage = result.msg;
                        this.errormsg = "";
                        setTimeout(() => {
                            this.myForm.reset();
                        }, 1000);
                    }
                    else {
                        this.errormsg = result.msg;
                        this.setPasswordMessage = "";
                    }
                }
            }));
    }
}

