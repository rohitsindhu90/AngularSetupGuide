import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyNumberComponent } from './my-number-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    component: MyNumberComponent,
    canActivate: [CompanyAuthGuard], 
    data: { title: 'My Number', shouldDetach: false } ,
  
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyNumberReportRoutingModule { }
