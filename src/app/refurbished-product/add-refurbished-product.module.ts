import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRefurbishedProductComponent } from './add-refurbished-product.component';
import { AddRefurbishedProductRoutingModule } from './add-refurbished-product.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            AddRefurbishedProductComponent
        ],
        imports:[
            CommonModule,
            AddRefurbishedProductRoutingModule,
            FormsModule,
            DropdownModule,
            RequiredAsteriskModule
        ]
    }
)
export class AddRefurbishedProductModule {}