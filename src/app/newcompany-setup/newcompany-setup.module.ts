import { NgModule } from '@angular/core';
import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button'
import { NewcompanySetUpRoutingModule } from './newcompany-setup.route';
import { NewCompanySetupComponent } from './newcompany-setup.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { ProgressBarModule } from 'primengdevng8/progressbar';
import { MessagesModule } from 'primengdevng8/messages';
import { PanelModule } from 'primengdevng8/panel';
import {KeyFilterModule} from 'primengdevng8/keyfilter';
import { TabViewModule } from 'primengdevng8/tabview';
import { DtCommonModule } from '../modules/dt-common.module';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations: [
            NewCompanySetupComponent
        ],
        imports: [
            CommonModule,
           // DataTableModule,
            FormsModule,
            DropdownModule,
            CheckboxModule,
            ProgressBarModule,
            PanelModule,
            MessagesModule,
            KeyFilterModule,
            NewcompanySetUpRoutingModule,
            ButtonModule,
            TabViewModule,
            DtCommonModule,
            RequiredAsteriskModule
        ]
    }
)
export class NewcompanySetUpModule { }