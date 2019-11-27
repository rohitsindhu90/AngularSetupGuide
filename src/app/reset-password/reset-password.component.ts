import { Component } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'my-reset-password',
  templateUrl: './reset-password.component.html'
})

export class ResetPasswordComponent {
  model: any = {};

  // disable loading button on request sent
  loading: boolean = false;
  sendRequestButtonText: string = 'Request Reset';
  sendMailMessage: string = '';

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService) {
  }

  sendResetPasswordRequest() {
    this.sendMailMessage = 'Please wait...';
    this.loading = true;
    this.authenticationService.ipValidationForResetPassword().then(result => {
      if (result == 0) {
        this.userService.sendResetPasswordRequest(this.model.username).subscribe(result => {
          this.sendMailMessage = result;
          this.loading = false;
        });
      }
      else {
        this.sendMailMessage = this.authenticationService.ipValidationErrorMsg;
        this.loading = false;
      }
    });
  }
}
