import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
//import { ButtonModule} from 'primengdevng8/button'
import { NewConnectionComponent } from './new-connection.component';
import { NewConnectionRoutingModule } from './new-connection.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { CalendarModule } from 'primengdevng8/calendar';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import {SpinnerModule} from 'primengdevng8/spinner';
//import { UserSharedModule } from '../../modules/user-shared.module';
import { UserMaintenaceComponent } from 'src/app/user/user-maintenance.component';
import { RemoteValidatorModule } from 'src/app/modules/remote-validator.module';


//import {MaterialModule} from '@angular/material/api';
@NgModule(
    {
        declarations: [
            NewConnectionComponent
        ],
        imports: [
            CommonModule,
            NewConnectionRoutingModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            KeyFilterModule,
            CalendarModule,
            AutoCompleteExtendedModule,
            SpinnerModule,
            RemoteValidatorModule,


        ],
        entryComponents :[
            
        ]
    }
)
export class NewConnectionModule { }