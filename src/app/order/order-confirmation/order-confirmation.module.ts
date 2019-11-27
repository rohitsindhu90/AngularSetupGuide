import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
//import { ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { CalendarModule } from 'primengdevng8/calendar';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { SpinnerModule } from 'primengdevng8/spinner';
import { OrderConfirmationRoutingModule } from './order-confirmation.route';
import { OrderConfirmationComponent } from './order-confirmation.component';
import { PipeModule } from '../../modules/pipe.module';
import { NgControlOptionsDirective, RemoteValidator } from 'src/app/validator/remote-validator-directive';
import { RemoteValidatorModule } from 'src/app/modules/remote-validator.module';


//import {MaterialModule} from '@angular/material/api';
@NgModule(
    {
        declarations: [
            OrderConfirmationComponent,
            // NgControlOptionsDirective,
            // RemoteValidator,
            // RequiredAsterisk,
        ],
        imports: [
            CommonModule,
            OrderConfirmationRoutingModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            PipeModule,
            KeyFilterModule,
            RemoteValidatorModule,
            //CalendarModule,
            //AutoCompleteExtendedModule,
            //SpinnerModule,
            // UserSharedModule,

        ],
        entryComponents: [
            //UserMaintenaceComponent
        ]
    }
)
export class OrderConfirmationModule { }