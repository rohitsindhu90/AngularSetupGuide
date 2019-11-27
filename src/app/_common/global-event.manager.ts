import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
    providedIn:'root'
})
export class GlobalEventsManager {
    // these are the event emitter type of properties used for menu show,hide and show error msg on login page.
    //public showNavBar: EventEmitter<any> = new EventEmitter();
    public accessDenied: EventEmitter<any> = new EventEmitter();
    public busySpinner: EventEmitter<any> = new EventEmitter();
    public refreshFleet: EventEmitter<any> = new EventEmitter();
    public refreshAssetFleetLinkSource: EventEmitter<any> = new EventEmitter();
    public refreshAssetFleet: EventEmitter<any> = new EventEmitter();
    public refreshLinkSourceInvoiceGraph: EventEmitter<any> = new EventEmitter();
    public refreshInvoiceFleet: EventEmitter<any> = new EventEmitter();
    public refreshCallClassFleet: EventEmitter<any> = new EventEmitter();
    public refreshLinkSourceCallClassGraph: EventEmitter<any> = new EventEmitter();

    public refreshThemeCSSVar: EventEmitter<any> = new EventEmitter();
   
}