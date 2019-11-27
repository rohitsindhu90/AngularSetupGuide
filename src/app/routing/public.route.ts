import { Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { ErrorComponent } from '../error/error.component';
import { PageNotfoundComponent } from '../error/page404.component';
import { SetPasswordComponent } from '../user/set-password.component';

export const PUBLIC_ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full', data: { shouldDetach: false } },    
    { path: 'login', component: LoginComponent, data: { title: '', shouldDetach: false } },
    { path: 'set-password/:d', component: SetPasswordComponent, data: { title: 'Change Password', shouldDetach: false } },
     { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Request for password reset', shouldDetach: false } },
     { path: 'error', component: ErrorComponent, data: { title: 'error', shouldDetach: false } },
     { path: 'page404', component: PageNotfoundComponent, data: { title: 'Page Not Found', shouldDetach: false } }    
];
