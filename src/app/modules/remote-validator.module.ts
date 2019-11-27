import { NgModule } from '@angular/core';
import { NgControlOptionsDirective, RemoteValidator } from '../validator/remote-validator-directive';
import { RequiredAsteriskModule } from './requiredasterisk.module';

@NgModule({
    declarations: [
        NgControlOptionsDirective,
        RemoteValidator,
    ],
    imports: [
    ],
    exports: [
        NgControlOptionsDirective,
        RemoteValidator,
        RequiredAsteriskModule
    ]
})
export class RemoteValidatorModule { }