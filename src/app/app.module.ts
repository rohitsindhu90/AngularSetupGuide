import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';


import { JwtInterceptor } from './_helper/jwt.interceptor';

//Component
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PublicAppComponent } from './layout/public.component';
import { ErrorInterceptor } from './_helper/error.interceptor';
import { SecureAppComponent } from './layout/secure.component';
import { HomeComponent } from './home/home.component';
import { TermsConditionComponent } from './login/termscondition.component';
import { AppSettingServiceProvider } from './_common/appsetting.service.provider';



//Packages primeng,bootstrap etc..
import { ConfirmationService } from 'primengdevng8/api';
import { DialogModule } from 'primengdevng8/dialog';
import { ConfirmDialogModule } from 'primengdevng8/confirmdialog';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { PickListModule } from 'primengdevng8/picklist';
import { MultiSelectModule } from 'primengdevng8/multiselect';
import { OverlayPanelModule} from 'primengdevng8/overlaypanel';
import { ColorPickerModule } from 'primengdevng8/colorpicker';


import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBusyModule } from 'ng-busy';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';


import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CompanyAuthGuard } from './_guards/auth.guard';
import { BusySpinnerComponent } from './sharedcomponent/loader.component';
import { DefaultAppComponent } from './layout/default.component';
import { AgreementSignComponent } from './client-agreement/agreement-sign.component';

//service

import { NgbdModalContent } from './_modalpopup/modal.component';
import { CancelOrderComponent } from './dispatch/cancel-order.component';
import { PipeModule } from './modules/pipe.module';
import { SetPasswordComponent } from './user/set-password.component';
import { ErrorComponent } from './error/error.component';
import { PageNotfoundComponent } from './error/page404.component';
import { AccessDeniedComponent } from './error/access-denied.component';
import { DataTableModule } from 'primengdevng8/datatable';
import { TrackingDetailPopupReportComponent } from './admin-reports/tracking-detail-popup-report.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


import { UserMaintenaceComponent } from './user/user-maintenance.component';
import { ConfirmationContent } from './_modalpopup/confirmation.component';
import { AssignAssetComponent } from './fleet/update-mobile/assign-asset.component';
import { CancellationPACRequestComponent } from './fleet/update-mobile/cancellation-pacrequest.component';
import { UpdateBarsComponent } from './fleet/update-mobile/update-bars.component';
import { UnallocateComponent } from './fleet/update-mobile/unallocate.component';
import { CalendarModule } from 'primengdevng8/calendar';
import { AddAssetComponent } from './asset/addasset/addasset.component';
import { RemoteValidatorModule } from './modules/remote-validator.module';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { AssignMobilenumberComponent } from './asset/updateasset-details/assign-mobilenumber.component';

import { RouteReuseStrategy } from '@angular/router';
import { CustomReuseStrategy } from './_common/custom-route-reuse-strategy';
import { CareReportDetailComponent } from './report/care-report/care-report-detail/care-report-detail.component';
import { ViewReportComponent } from './schedule-report/view-report/view-report.component';
import { SendnowScheduleReportComponent } from './schedule-report/sendnow-schedulereport/sendnow-schedulereport.component';
import { AddBulkCtnConfirmComponent } from './bulkupload/add-bulk-ctn-confirm/add-bulk-ctn-confirm.component';

import { OrderReportDetailComponent } from './report/order-detail/order-report-detail.component';

import { EditSapreNumberReportComponent } from './report/spare-number-report/edit-sparenumber-report/edit-sparenumber-report.component';
import { PinComponent } from './_modalpopup/pin.component';
import { AddNewMobileComponent } from './fleet/add-new-mobile/add-new-mobile.component';
import { ThemeBuilderComponent } from './theme-builder/theme-builder.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PublicAppComponent,
    SecureAppComponent,
    DefaultAppComponent,
    AgreementSignComponent,
    HomeComponent,
    TermsConditionComponent,
    //ClientUserAgreementComponent,
    SetPasswordComponent,
    ResetPasswordComponent,
    NgbdModalContent,
    OrderReportDetailComponent,
    CancelOrderComponent,
    BusySpinnerComponent,
    ErrorComponent,
    PageNotfoundComponent,
    AccessDeniedComponent,
    TrackingDetailPopupReportComponent,
    ChangePasswordComponent,
    UserMaintenaceComponent,
    ConfirmationContent,//Done
    AssignAssetComponent,
    CancellationPACRequestComponent,
    UpdateBarsComponent,
    UnallocateComponent,
    AddAssetComponent,
    AssignMobilenumberComponent,
    CareReportDetailComponent,
    ViewReportComponent,
    SendnowScheduleReportComponent,
    AddBulkCtnConfirmComponent,
    ThemeBuilderComponent,
    EditSapreNumberReportComponent,
    PinComponent,
    AddNewMobileComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ConfirmDialogModule,
    DialogModule,
    AutoCompleteExtendedModule,

    NgBusyModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    DropdownModule,
    CheckboxModule,

    DataTableModule,
    PipeModule,
    NgIdleKeepaliveModule.forRoot(),
    PickListModule,
    MultiSelectModule,
    CalendarModule,
    RemoteValidatorModule,
    KeyFilterModule,
    OverlayPanelModule,
    ColorPickerModule,


  ],
  providers: [ConfirmationService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'en-GB' },
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
    AppSettingServiceProvider,
    CompanyAuthGuard,
    NgbActiveModal,
    
  ],
  entryComponents: [
    NgbdModalContent,
    CancelOrderComponent,
    OrderReportDetailComponent,
    TrackingDetailPopupReportComponent,
    ChangePasswordComponent,
    UserMaintenaceComponent,
    ConfirmationContent,
    AssignAssetComponent,
    CancellationPACRequestComponent,
    UpdateBarsComponent,
    UnallocateComponent,
    AddAssetComponent,
    AssignMobilenumberComponent,
    CareReportDetailComponent,
    ViewReportComponent,
    SendnowScheduleReportComponent,
    AddBulkCtnConfirmComponent,
    EditSapreNumberReportComponent,
    PinComponent,
    AddNewMobileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


