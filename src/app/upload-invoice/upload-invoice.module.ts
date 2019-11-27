import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button'
import { BlockUIModule} from 'primengdevng8/blockui'
import { MessagesModule} from 'primengdevng8/messages'
import { PanelModule} from 'primengdevng8/panel'
import { ProgressBarModule} from 'primengdevng8/progressbar'
import { UploadInvoiceRoutingModule } from './upload-invoice.route';
import { UploadInvoiceComponent } from './upload-invoice-component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { DialogModule } from 'primengdevng8/dialog';
import { DataTableModule } from 'primengdevng8/datatable';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            UploadInvoiceComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            FormsModule,
            DropdownModule,
            BlockUIModule,
            ProgressBarModule,
            MessagesModule,
            PanelModule,
            UploadInvoiceRoutingModule,
            ButtonModule,
            DialogModule,
            
        ]
    }
)
export class UploadInvoiceModule {}