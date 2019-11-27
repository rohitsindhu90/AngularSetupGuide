import { Component, Input, OnInit, EventEmitter, ApplicationRef, Output, AfterViewInit, OnChanges, ComponentRef, Injectable, Injector, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
//import {  SelectItem from 'primeng-dev-ng4/primeng';
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceService } from '../_services/invoice.service'
import { BENDetailService } from '../_services/bendetail.service';
import { Invoice } from "../_models/invoice";
import { LinkType } from '../_services/enumtype';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { InvoiceFleetComponent } from "../invoice/invoice.fleet.component"



@Component({
    selector: 'invoice-linksource',
    templateUrl: './invoice.linksource.component.html',
    entryComponents: [InvoiceFleetComponent]

})

export class InvoiceLinkSourceComponent implements AfterViewInit {


    @ViewChild('linkfleetcontainer', { read: ViewContainerRef, static: false }) fleetcontainer: ViewContainerRef;

    componentRef: ComponentRef<Component>;
    @Input() linktype: string;
    @Input() invoicedateguid: string;
    @Input() networkguid: string;
    @Input() billingplatformguid: string;
    @Input() benguid: string;
    @Input() linksourceguid: string
    @Input() ban: string;
    @Input() isbendisplay: boolean;
    @Input() isbandisplay: boolean;
    @Input() rtypeguid: string;
    model: Invoice[];
    private loader: EventEmitter<any>;
    csvfilename: string;
    @Input() invoicemonthname: string;
    @Input() isobservationdrilldown: boolean;
    @Input() r1: string;
    @Input() r2: string;
    @Input() r3: string;
    @Input() r4: string;
    @Input() r5: string;
    @Input() r6: string;


    /* Constructor: used to inject services
       */
    constructor(private authenticationService: AuthenticationService, private InvoiceService: InvoiceService,
         private globalEvent: GlobalEventsManager,
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private viewContainerRef: ViewContainerRef, private bendetailService: BENDetailService
    ) {
        this.loader = globalEvent.busySpinner;


    }

    ngAfterViewInit() {
        this.csvfilename = this.linktype + " " + this.invoicemonthname;
        this.loader.emit([this.loadCTNInvoiceLoadGroupByLinkSource()]);
    }

    handleRowSelect(event: any) {
        this.model = null;
        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
        }

        const factory = this.componentFactoryResolver.resolveComponentFactory(InvoiceFleetComponent);
        this.componentRef = <any>this.fleetcontainer.createComponent(factory);
        this.componentRef.instance["invoicedateguid"] = this.invoicedateguid;
        this.componentRef.instance["networkguid"] = this.networkguid;
        this.componentRef.instance["billingplatformguid"] = this.billingplatformguid;
        this.componentRef.instance["benguid"] = this.benguid;
        this.componentRef.instance["linktype"] = this.linktype;
        this.componentRef.instance["linksourceguid"] = event.data.linksourceguid;
        this.componentRef.instance["rtypeguid"] = this.rtypeguid;
        this.componentRef.instance["description"] = event.data.description;
        this.componentRef.instance["invoicemonthname"] = this.invoicemonthname;
        this.componentRef.instance["ban"] = this.ban;
        this.componentRef.instance["isbendisplay"] = this.isbendisplay;
        this.componentRef.instance["isbandisplay"] = this.isbandisplay;
        this.componentRef.instance["isobservationdrilldown"] = this.isobservationdrilldown;

        this.componentRef.instance["r1"] = this.r1;
        this.componentRef.instance["r2"] = this.r2;
        this.componentRef.instance["r3"] = this.r3;
        this.componentRef.instance["r4"] = this.r4;
        this.componentRef.instance["r5"] = this.r5;
        this.componentRef.instance["r6"] = this.r6;

        this.componentRef.changeDetectorRef.detectChanges();
        this.globalEvent.refreshLinkSourceInvoiceGraph.emit({ linksourceguid: event.data.linksourceguid, description: event.data.description });
    }

    loadCTNInvoiceLoadGroupByLinkSource(): Promise<any> {
        return this.InvoiceService.GetCTNInvoiceLoadGroupByLinkSource(this.linktype, this.rtypeguid, this.invoicedateguid, this.networkguid, this.billingplatformguid, this.benguid, this.ban, this.isobservationdrilldown).then(q => {
            this.model = q;
        });
    }

}

