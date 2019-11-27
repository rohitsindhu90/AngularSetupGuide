import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefurbishedProductComponent } from './refurbished-product.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { RefurbishedProductRoutingModule } from './refurbished-product.route';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primengdevng8/button';


@NgModule(
    {
        declarations:[
            RefurbishedProductComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            RefurbishedProductRoutingModule,
            DropdownModule,
            FormsModule,
            ButtonModule
        ]
    }
)
export class RefurbishedProductModule {}