import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { CalendarModule } from 'primengdevng8/calendar';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { SpinnerModule } from 'primengdevng8/spinner';
import { TooltipModule } from 'primengdevng8/tooltip';
//import { UserSharedModule } from '../../modules/user-shared.module';
import { UserMaintenaceComponent } from 'src/app/user/user-maintenance.component';
import { HardwareOrdersRoutingModule } from './hardware.orders.route';
import { HardwareOrdersComponent } from './hardware.orders.component';
import { ButtonModule } from 'primengdevng8/button';
import { RemoteValidatorModule } from 'src/app/modules/remote-validator.module';

//import {MaterialModule} from '@angular/material/api';
@NgModule(
    {
        declarations: [
            HardwareOrdersComponent
        ],
        imports: [
            CommonModule,
            HardwareOrdersRoutingModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            KeyFilterModule,
            CalendarModule,
            AutoCompleteExtendedModule,
            SpinnerModule,
            TooltipModule,
            ButtonModule,
            RemoteValidatorModule
            // UserSharedModule,

        ],
        entryComponents: [
            //UserMaintenaceComponent
        ]
    }
)
export class HardwareOrdersModule { }