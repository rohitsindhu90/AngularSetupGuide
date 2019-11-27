import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import  {ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { EmailConfigRoutingModule } from './emailconfig.route';
import { EmailConfigComponent } from './emailconfig.component';
import { PipeModule } from '../modules/pipe.module';
import { KeyFilterModule } from 'primengdevng8/keyfilter';

@NgModule(
    {
        declarations:[
            EmailConfigComponent,
        ],
        imports:[
            CommonModule,
            EmailConfigRoutingModule,
            ButtonModule,
            FormsModule,
            PipeModule,
            KeyFilterModule
        ]
    }
)
export class EmailConfigModule {}