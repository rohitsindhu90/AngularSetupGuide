import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { AddBulkUserComponent } from './add-bulk-user.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { AddBulkUserRoutingModule } from './add-bulk-user.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ProgressBarModule } from 'primengdevng8/progressbar';
import { MessagesModule } from 'primengdevng8/messages';
import { TabViewModule } from 'primengdevng8/tabview';
import { PanelModule } from 'primengdevng8/panel';

@NgModule(
    {
        declarations:[
            AddBulkUserComponent
        ],
        imports:[
            CommonModule,
            DtCommonModule,
            AddBulkUserRoutingModule,
            ProgressBarModule,
            ButtonModule,
            MessagesModule,
            DtCommonModule,
            TabViewModule,
            //PanelModule
        ]
    }
)
export class AddBulkUserModule {}