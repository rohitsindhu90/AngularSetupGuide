import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button';
import { DtCommonModule } from '../../modules/dt-common.module';
import { UpdateMobileRoutingModule } from './update-mobile.route';
import { UpdateMobileComponent } from './update-mobile.component';
import { FormsModule } from '@angular/forms';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { DropdownModule } from 'primengdevng8/dropdown';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { RemoteValidatorModule } from 'src/app/modules/remote-validator.module';
import { UnallocateComponent } from './unallocate.component';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { CalendarModule } from 'primengdevng8/calendar';

@NgModule(
    {
        declarations: [
            UpdateMobileComponent,
            //UnallocateComponent,
        ],
        imports: [
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            UpdateMobileRoutingModule,
            FormsModule,
            AutoCompleteExtendedModule,
            ButtonModule,
            DropdownModule,
            KeyFilterModule,
            RemoteValidatorModule,
            CheckboxModule,
            CalendarModule
        ],
        entryComponents: [
            // UnallocateComponent
        ]
    }
)
export class UpdateMobileModule { }