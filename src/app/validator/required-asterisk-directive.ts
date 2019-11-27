import { Directive, forwardRef, Renderer2, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
var $ = require('jquery');

export const DEFAULT_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RequiredAsterisk),
    multi: true
};
@Directive({
    selector: 'label[for]',
    providers: [DEFAULT_ACCESSOR]
})
export class RequiredAsterisk {
    constructor(private elementref: ElementRef, private renderer2: Renderer2) {
    }


    ngAfterViewChecked() {

        let controlid = this.elementref.nativeElement.getAttribute('for');
        if (controlid) {
            let control: any = document.getElementsByName(controlid)[0];
            if (control === undefined || control == null || control.length === 0) {
                control = document.querySelector('[ng-reflect-name=' + controlid + ']');
            }
            if (control === undefined || control == null || control.length === 0) {
                control = document.getElementById(controlid);
            }

            //if (control === undefined || control === null || control.length === 0) {
            //    control = document.querySelector('p-autoComplete-extended[ng-reflect-name=' + controlid + ']');
            //}
            let required: boolean = false;

            if (control) {
                //check required attribute && element visiblity
                let visible = $(control).is(":visible");
                let disabled = control.hasAttribute('ng-reflect-disabled') ? JSON.parse(control.getAttribute('ng-reflect-disabled')) : false;

                required = control.hasAttribute('required') && visible && !disabled;
            }
            if (required) {
                this.renderer2.addClass(this.elementref.nativeElement, "required");

            }
            else {
                this.renderer2.removeClass(this.elementref.nativeElement, "required");
            }

        }
    }

}