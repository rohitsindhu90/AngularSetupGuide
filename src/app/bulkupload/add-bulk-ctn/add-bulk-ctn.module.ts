import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBulkCtnComponent } from './add-bulk-ctn.component';
import { AddBulkCtnRoutingModule } from './add-bulk-ctn.route';
import { ProgressBarModule } from 'primengdevng8/progressbar';
import { MessagesModule } from 'primengdevng8/messages';
import { ButtonModule } from 'primengdevng8/button';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { TabViewModule } from 'primengdevng8/tabview';

@NgModule(
    {
        declarations:[
            AddBulkCtnComponent
        ],
        imports:[
            CommonModule,
            AddBulkCtnRoutingModule,
            ProgressBarModule,
            MessagesModule,
            ButtonModule,
            DtCommonModule,
            TabViewModule
        ]
    }
)
export class AddBulkCtnModule {}