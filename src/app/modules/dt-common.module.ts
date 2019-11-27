import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';

 @NgModule({
    imports: [
         DataTableModule
    ],
    
    exports:[ 
        DataTableModule
    ]
  })
  export class DtCommonModule { }