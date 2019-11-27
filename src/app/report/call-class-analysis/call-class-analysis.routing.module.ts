    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';
    import { CompanyAuthGuard } from '../../_guards/auth.guard';
    import { CallClassAnalysisComponent } from './call-class-analysis.component';


    const routes: Routes = [
    {
        path: '',
        component: CallClassAnalysisComponent,
        canActivate: [CompanyAuthGuard], 
        data: { title: 'Call Category - '} ,
    
    }
    ];

    @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
    })
    export class CallClassAnalysisReportRoutingModule { }