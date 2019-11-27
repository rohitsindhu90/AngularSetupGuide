import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { RoamedReportByCountryComponent } from './roamed-report-by-country.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { RoamedReportByCountryRoutingModule } from './roamed-report-by-country.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            RoamedReportByCountryComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            RoamedReportByCountryRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class RoamedReportByCountryModule {}