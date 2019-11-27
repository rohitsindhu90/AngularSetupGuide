import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddBulkAssetComponent } from './add-bulk-asset.component';
import { AddBulkAssetRoutingModule } from './add-bulk-asset.route';
import { ProgressBarModule } from 'primengdevng8/progressbar';
import { ButtonModule } from 'primengdevng8/button';
import { MessagesModule } from 'primengdevng8/messages';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { TabViewModule } from 'primengdevng8/tabview';

@NgModule(
    {
        declarations:[
            AddBulkAssetComponent
        ],
        imports:[
            CommonModule,
            AddBulkAssetRoutingModule,
            ProgressBarModule,
            ButtonModule,
            MessagesModule,
            DtCommonModule,
            TabViewModule,
        ]
    }
)
export class AddBulkAssetModule {}