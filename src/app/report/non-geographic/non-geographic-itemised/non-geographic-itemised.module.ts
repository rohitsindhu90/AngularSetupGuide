import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { NonGeoraphyItemisedComponent } from './non-geographic-itemised.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { NonGeoraphyItemisedRoutingModule } from './non-geographic-itemised.route';

@NgModule(
    {
        declarations:[
            NonGeoraphyItemisedComponent
        ],
        imports:[
            CommonModule,
            DtCommonModule,
            NonGeoraphyItemisedRoutingModule,
            ButtonModule,
        ]
    }
)
export class NonGeoraphyItemisedModule {}