import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { TariffMaintenanceComponent } from './tariff-maintenance.component';
import { DtCommonModule } from '../modules/dt-common.module';
import { TariffMaintenanceRoutingModule } from './tariff-maintenance.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { PipeModule } from '../modules/pipe.module';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';
import { TooltipModule } from 'primengdevng8/tooltip';

@NgModule(
    {
        declarations:[
            TariffMaintenanceComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            TariffMaintenanceRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            KeyFilterModule,
            PipeModule,
            RequiredAsteriskModule,
            TooltipModule
        ]
    }
)
export class TariffMaintenanceModule {}