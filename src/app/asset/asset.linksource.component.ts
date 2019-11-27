import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, OnChanges, ComponentRef, Injectable, Injector, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { AssetLinkSourceViewModel } from "../_models/asset/asset-linksource";
import { LinkType } from '../_services/enumtype';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { AssetFleetComponent } from "../asset/asset.fleet.component"
import { AssetService } from '../_services/asset.service';
import { GenericService } from '../_services/generic.service';
import { Router } from '@angular/router';

@Component({
    selector: 'asset-linksource',
    templateUrl: './asset.linksource.component.html',
    entryComponents: [AssetFleetComponent]

})

export class AssetLinkSourceComponent implements AfterViewInit {


    @ViewChild('linkassetfleetcontainer', { read: ViewContainerRef, static: false }) linkassetfleetcontainer: ViewContainerRef;

    componentRef: ComponentRef<Component>;

    @Input() tabHeader: string;
    @Input() IsCompanyOwned: boolean;
    @Input() IsEmployeeOwned: boolean;
    @Input() IsArchivedAsset: boolean;
    @Input() linktype: string
    @Input() linksourceguid: string;
    @Input() rtypeguid: string;



    model: AssetLinkSourceViewModel[];

    private loader: EventEmitter<any>;
    csvfilename: string;


    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private genericService: GenericService,
        private router: Router) {

        this.loader = globalEvent.busySpinner;

    }

    ngAfterViewInit() {
        this.csvfilename = this.csvfilename = this.tabHeader + "_Asset_Summary";;

        this.loader.emit([this.loadCTNInvoiceLoadGroupByLinkSource()]);
    }


    handleRowSelect(event: any) {
        this.model = null;
        if (this.componentRef) {
            this.componentRef.destroy();
        }

        const factory = this.componentFactoryResolver.resolveComponentFactory(AssetFleetComponent);
        this.componentRef = <any>this.linkassetfleetcontainer.createComponent(factory);
        this.componentRef.instance["IsCompanyOwned"] = this.IsCompanyOwned;
        this.componentRef.instance["IsEmployeeOwned"] = this.IsEmployeeOwned;
        this.componentRef.instance["IsArchivedAsset"] = this.IsArchivedAsset;
        this.componentRef.instance["linktype"] = this.linktype;
        this.componentRef.instance["linksourceguid"] = event.data.guid;
        this.componentRef.instance["rtypeguid"] = this.rtypeguid;
        this.componentRef.changeDetectorRef.detectChanges();

        this.globalEvent.refreshAssetFleetLinkSource.emit({ linksourceguid: event.data.linksourceguid, description: event.data.description });
    }

    loadCTNInvoiceLoadGroupByLinkSource(): Promise<any> {
        return this.assetService.GetAssetFleetGroupBy(this.IsCompanyOwned, this.IsEmployeeOwned, this.IsArchivedAsset, this.linktype, this.linksourceguid, this.rtypeguid).then(q => {
            this.model = q;
        });
    }

}

