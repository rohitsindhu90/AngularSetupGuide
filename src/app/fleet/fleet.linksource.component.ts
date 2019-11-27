import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, OnChanges, ComponentRef, Injectable, Injector, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceService } from '../_services/invoice.service'
import { BENDetailService } from '../_services/bendetail.service';
import { LinkType } from '../_services/enumtype';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { FleetManageComponent } from "../fleet/fleet.manage.component";
import { CTNDetailService } from '../_services/ctndetail.service';
import { ManageFleetLinkSourceViewModel } from "../_models/managefleetlinksource";


@Component({
    selector: 'fleet-linksource',
    templateUrl: './fleet.linksource.component.html',
    entryComponents: [FleetManageComponent]

})

export class FleetLinkSourceComponent implements AfterViewInit {


    @ViewChild('managelinkfleetcontainer', { read: ViewContainerRef, static: false }) managelinkfleetcontainer: ViewContainerRef;

    componentRef: ComponentRef<Component>;
    @Input() tabHeader: string;
    @Input() linktype: string;
    @Input() linksourceguid: string
    @Input() rtypeguid: string;
    @Input() activemobile: boolean;
    @Input() cancelledmobile: boolean;
    @Input() currenttabname: string;
    @Input() isbenexist: boolean;
    model: ManageFleetLinkSourceViewModel[];
    private loader: EventEmitter<any>;
    csvfilename: string;
    localactivetabname: string;
    selectedcategory: string;
    
    /* Constructor: used to inject services
       */
    constructor(private authenticationService: AuthenticationService, private globalEvent: GlobalEventsManager,
        private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef, private bendetailService: BENDetailService,
        private cTNDetailService: CTNDetailService
    ) {
        this.loader = globalEvent.busySpinner;
    }

    ngAfterViewInit() {
        this.csvfilename = this.tabHeader + "_managefleet";
        this.loader.emit([this.loadCTNFleetLoadGroupByLinkSource()]);
    }

    handleRowSelect(event: any) {
        this.model = null;
        if (this.componentRef) {
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(FleetManageComponent);
        this.componentRef = <any>this.managelinkfleetcontainer.createComponent(factory);
        this.componentRef.instance["linktype"] = this.linktype;
        this.componentRef.instance["linksourceguid"] = this.linksourceguid = event.data.itemguid;
        this.componentRef.instance["rtypeguid"] = this.rtypeguid;
        this.componentRef.instance["activemobile"] = this.activemobile;
        this.componentRef.instance["cancelledmobile"] = this.cancelledmobile;
        this.componentRef.instance["currenttabname"] = this.currenttabname;
        this.componentRef.instance["isbenexist"] = this.isbenexist;

        this.componentRef.changeDetectorRef.detectChanges();
        let description = event.data.description;
        this.globalEvent.refreshFleet.emit({ refreshFleet: true, selectedcategory: description });
    }

    loadCTNFleetLoadGroupByLinkSource(): Promise<any> {
        this.localactivetabname = this.currenttabname;
        return this.cTNDetailService.getFleetDetailsByGroup(this.activemobile, this.cancelledmobile, this.linktype, this.linksourceguid, this.rtypeguid).then((data) => {
            this.model = data;
        });
    }

}

