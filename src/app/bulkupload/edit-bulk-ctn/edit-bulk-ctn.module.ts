import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primengdevng8/button';
import { EditBulkCTNComponent } from './edit-bulk-ctn.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { FormsModule } from '@angular/forms';
import { EditBulkCTNRoutingModule } from './edit-bulk-ctn.route';
import { ProgressBarModule } from 'primengdevng8/progressbar';
import { MessagesModule } from 'primengdevng8/messages';
import { TabViewModule } from 'primengdevng8/tabview';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { PanelModule } from 'primengdevng8/panel';

@NgModule(
    {
        declarations: [
            EditBulkCTNComponent
        ],
        imports: [
            CommonModule,
            DtCommonModule,
            FormsModule,
            CheckboxModule,
            TabViewModule,
            ProgressBarModule,
            PanelModule,
            MessagesModule,
            ButtonModule,
            EditBulkCTNRoutingModule
        ],
    }
)
export class EditBulkCTNModule { }