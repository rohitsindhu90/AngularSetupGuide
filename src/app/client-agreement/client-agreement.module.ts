import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { DtCommonModule } from '../modules/dt-common.module';
import { ClientUserAgreementComponent } from './client-agreement.component';
import { ClientUserAgreementRoutingModule } from './client-agreement.route';
import { FormsModule } from '@angular/forms';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';

@NgModule(
    {
        declarations:[
            ClientUserAgreementComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ClientUserAgreementRoutingModule,
            ButtonModule,
            FormsModule,
            AutoCompleteExtendedModule
        ]
    }
)
export class ClientUserAgreementModule {}