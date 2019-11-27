import { NgModule } from '@angular/core';
import { CompanyComponent } from '../company/company.component';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { CompanyRoutingModule } from './company.route';
import { DtCommonModule } from '../modules/dt-common.module';

@NgModule(
    {
        declarations:[
            CompanyComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            CompanyRoutingModule,
            ButtonModule
        ]
    }
)
export class CompanyModule {}