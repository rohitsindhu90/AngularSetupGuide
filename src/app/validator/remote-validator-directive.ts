
import { Directive, Input, forwardRef, OnInit, Renderer2, ElementRef, } from '@angular/core';
import { NG_ASYNC_VALIDATORS, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators, AsyncValidator, AsyncValidatorFn, AbstractControl, } from '@angular/forms';
import { isPresent } from '../_common/utility-method';
import { HttpClient } from '@angular/common/http';
//import { fromEvent, } from "rxjs";
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators'
import { ResponseModel } from '../_models/response';
import { AppSettingService } from '../_common/appsetting.service';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';


const REMOTE_URL_VALIDATOR: any = {
    provide: NG_ASYNC_VALIDATORS,
    useExisting: forwardRef(() => RemoteValidator),
    multi: true
};

@Directive({
    selector: '[ng2-remote-validator][formControlName],[ng2-remote-validator][formControl],[ng2-remote-validator][ngModel]',
    providers: [REMOTE_URL_VALIDATOR]
})
export class RemoteValidator implements AsyncValidator, OnInit {
    @Input() triggerflag: boolean = true;
    @Input() url: string;
    private validator: AsyncValidatorFn;
    private onChange: () => void;

    constructor(private http: HttpClient, private appSetting: AppSettingService) {

    }
    ngOnInit() {
        this.setValidator();
    }

    setValidator() {
        this.validator = remoteurlvalidation(this.url, this.http, this.appSetting);
    }


    validate(c: AbstractControl): any {
        if (this.triggerflag) {
            return this.validator(c);
        }
        else {
            return Promise.resolve(null);
        }
    }

    //ngOnChanges() {
    //    this.setValidator();
    //}

}

export const remoteurlvalidation = (url: string, http: HttpClient, appSetting: AppSettingService): AsyncValidatorFn => {
    return (control: AbstractControl) => {

        //let validated = false;
        // clearTimeout(this.TimeOut);
        return new Promise((resolve, reject) => {
            //
            if (url && !url.length) resolve(null);;
            if (!isPresent(remoteurlvalidation)) resolve(null);;
            if (isPresent(Validators.required(control))) resolve(null);
            if (!control.value) {
                resolve(undefined);
            }
            else {
                //this.TimeOut = setTimeout(() => {
                return http.get<ResponseModel>(`${appSetting.apiurl}` + url + control.value)
                    .toPromise()
                    .then(response => {
                        let res = response;
                        if (res && res.message) {
                            resolve({ remoteurlvalidation: res.message });
                        }
                        else {
                            resolve(null);
                        }
                    }).catch(r => {
                        resolve({ remoteurlvalidation: "error" });
                    });

            }
        });
    };
}




// On Blur Validation Directive 
//HOw to Use 
//[ngControlOptions]="{ updateOn: 'blur', debounce: '300' }"
export const DEFAULT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgControlOptionsDirective),
    multi: true
};

@Directive({
    selector: 'input[type=text][formControlName][ngControlOptions],input[type=text][formControl][ngControlOptions],input[type=text][ngModel][ngControlOptions]',
    providers: [DEFAULT_VALUE_ACCESSOR]
})
export class NgControlOptionsDirective implements ControlValueAccessor {
    onChange: any;
    onTouched: any;


    private _controlOptions: any = {
        //_controlOptions.updatedOn is Obsolete
        updateOn: 'input',
        debounce: 300
    };

    private events: any;
    @Input() set ngControlOptions(val: any) {
        this._controlOptions = val;
    }


    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    constructor(private renderer: Renderer2, private element: ElementRef) {
    }

    ngOnInit() {
        let _debounceTime: number = (((this._controlOptions != null && this._controlOptions != undefined) ? this._controlOptions.debounce : null) || 300);

        //const eventStream = Observable.fromEvent(this.element.nativeElement, this._controlOptions.updateOn)
        //Solved double  click on submit button issue due to remote validation 
        //default event will be keyup now onward 
        const eventStream$ = fromEvent(this.element.nativeElement, "keyup").pipe(map((i: any) => ({
            type: i.type,
            value: i.currentTarget.value
        })), debounceTime(_debounceTime), distinctUntilChanged());

        this.events = eventStream$.subscribe((input: any) => this.onChange(input.value));

    }

    writeValue(value: any): void {
        const normalizedValue = value == null ? '' : value;
        this.renderer.setProperty(this.element.nativeElement, 'value', normalizedValue);
    }

    setDisabledState(isDisabled: boolean): void {
        this.renderer.setProperty(this.element.nativeElement, 'disabled', isDisabled);
    }

    ngOnDestroy() {
        if (this.events) {
            this.events.unsubscribe();;
        }
    }
}

