import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PUBLIC_ROUTES } from './routing/public.route';
import { PublicAppComponent } from './layout/public.component';
import { SecureAppComponent } from './layout/secure.component';
import { SECURE_ROUTES } from './routing/secure.route';
import { DefaultAppComponent } from './layout/default.component';
import { Default_ROUTES } from './routing/default.route';

const routes: Routes = [
  { path: '', component: PublicAppComponent, children: PUBLIC_ROUTES, data: { shouldDetach: false } },
  { path: '', component: DefaultAppComponent, children: Default_ROUTES, data: { shouldDetach: false } },
  { path: '', component: SecureAppComponent, children: SECURE_ROUTES, data: { shouldDetach: false } },
  { path: '**', redirectTo: 'page404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
