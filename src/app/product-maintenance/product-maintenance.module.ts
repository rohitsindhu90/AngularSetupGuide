import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { ProductMaintenanceComponent } from './product-maintenance.component';
import { DtCommonModule } from '../modules/dt-common.module';
import { ProductMaintenanceRoutingModule } from './product-maintenance.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { PipeModule } from '../modules/pipe.module';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            ProductMaintenanceComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ProductMaintenanceRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            KeyFilterModule,
            PipeModule,
            RequiredAsteriskModule
        ]
    }
)
export class ProductMaintenanceModule {}