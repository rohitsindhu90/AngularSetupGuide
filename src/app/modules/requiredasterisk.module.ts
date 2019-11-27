import { NgModule } from '@angular/core';
import { RequiredAsterisk } from '../validator/required-asterisk-directive';
@NgModule({
    declarations: [
        RequiredAsterisk,
    ],
    exports:[
        RequiredAsterisk,
    ]
})
export class RequiredAsteriskModule { }