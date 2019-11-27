import { Component } from '@angular/core';
import { GlobalEventsManager } from '../_common/global-event.manager';

@Component({
    selector: 'busy-spinner',
    template: `<div [ngBusy]="{busy:busy,minDuration:2000}"></div>`
})
export class BusySpinnerComponent {
    busy: any;
    constructor(private globalEventsManager: GlobalEventsManager) {
        this.globalEventsManager.busySpinner.subscribe((busy: any) => {
            this.busy = busy;
        });
    }


}