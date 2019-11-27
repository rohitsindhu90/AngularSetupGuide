import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { DtCommonModule } from '../../modules/dt-common.module';
import { UpdateAssetDetailsComponent } from './updateasset-details.component';
import { UpdateAssetDetailsRoutingModule } from './updateasset-details.route';
import { FormsModule } from '@angular/forms';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CalendarModule } from 'primengdevng8/calendar';
import { RequiredAsteriskModule } from 'src/app/modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            UpdateAssetDetailsComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            UpdateAssetDetailsRoutingModule,
            ButtonModule,
            FormsModule,
            AutoCompleteExtendedModule,
            DropdownModule,
            CalendarModule,
            RequiredAsteriskModule
        ]
    }
)
export class UpdateAssetDetailsModule {}