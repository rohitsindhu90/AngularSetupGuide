import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageAddressComponent } from './manage-address.component';
import { ManageAddressRoutingModule } from './manage-address.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            ManageAddressComponent
        ],
        imports:[
            CommonModule,
            ManageAddressRoutingModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            KeyFilterModule,
            RequiredAsteriskModule
        ]
    }
)
export class ManageAddressModule {}