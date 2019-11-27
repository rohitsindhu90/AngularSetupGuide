import { Routes } from '@angular/router';
import { AgreementSignComponent } from './client-agreement/agreement-sign.component';


export const Default_ROUTES: Routes = [
    { path: 'agreement-sign/:d', component: AgreementSignComponent, data: { title: 'CommsManager Agreement', shouldDetach: false } },
];