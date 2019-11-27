import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button'
import { DtCommonModule } from '../modules/dt-common.module';
import { ClientRoutingModule } from './client.route';
import { ClientComponent } from './client.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { TreeTableModule } from 'primengdevng8/treetable';
import { RadioButtonModule} from 'primengdevng8/radiobutton';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { CalendarModule } from 'primengdevng8/calendar';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';
import { TooltipModule } from 'primengdevng8/tooltip';

@NgModule(
    {
        declarations:[
            ClientComponent
        ],
        imports:[
            CommonModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            TreeTableModule,
            DtCommonModule,
            ClientRoutingModule,
            ButtonModule,
            RadioButtonModule,
            KeyFilterModule,
            CalendarModule,
            RequiredAsteriskModule,
            TooltipModule
        ]
    }
)
export class ClientModule {}