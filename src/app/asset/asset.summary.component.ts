import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, QueryList, OnChanges, ElementRef, ComponentRef, Injectable, Injector, ViewChildren, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { AssetSummaryViewModel } from '../_models/asset/asset-summary';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetService } from '../_services/asset.service';
import { GenericService } from '../_services/generic.service';
import { AssetFleetComponent } from "../asset/asset.fleet.component";
import { AssetLinkSourceComponent } from "../asset/asset.linksource.component";
import { FeatureRoleRelHierarchicalViewModel, FeatureRoleRelTreeViewModel } from '../_models/features';
import { String } from '../_common/utility-method';
import { UserDetail } from '../_models/user-detail';
import { FeatureType } from '../_services/enumtype';
import { UserService } from '../_services/user.service';


@Component({
    selector: 'asset-summary',
    templateUrl: './asset.summary.component.html',
    entryComponents: [AssetFleetComponent, AssetLinkSourceComponent],
})
export class AssetSummaryComponent implements OnInit {

    @ViewChild('assetfleetcontainer', { read: ViewContainerRef, static: false }) assetfleetcontainer: ViewContainerRef;
    @ViewChildren('dynamicContainer', { read: ViewContainerRef }) dynamicContainer: QueryList<ViewContainerRef>;

    componentRef: ComponentRef<Component>;

    IsCompanyOwned: boolean;
    IsEmployeeOwned: boolean;
    IsArchivedAsset: boolean;
    IsArchivedDisabled: boolean;
    iscomponentload: boolean = false;
    titleName: string = "Fleet";
    linksourceguid: string;
    subscription: any;

    activeTab: FeatureRoleRelTreeViewModel;
    tabs: FeatureRoleRelHierarchicalViewModel[];
    islinksourcetabclickEnable: boolean = false;
    activetableid: any;


    private loader: EventEmitter<any>;

    constructor(private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private assetService: AssetService,
        private genericService: GenericService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private userservice: UserService,
        public el: ElementRef,
        private router: Router,
        private authService: AuthenticationService) {


        this.loader = globalEvent.busySpinner;

        let user: UserDetail = this.authService.currentUserValue;

        this.userservice.LoadFeatureTreeViewByUserRole(user.roleid, user.id, this.router.url, FeatureType.Feature).then(res => {

            this.tabs = res;
            setTimeout(() => {
                this.bindEvent()
            }, 1000);

            // to subscribe the emit event when clik on the link source drill down for fleet
            this.subscription = this.globalEvent.refreshAssetFleetLinkSource.subscribe((data: any) => {
                if (data != null) {
                    this.linksourceguid = data.linksourceguid;
                    this.titleName = this.titleName + " - " + data.description;
                    this.islinksourcetabclickEnable = true;

                    this.loader.emit(
                        this.globalEvent.refreshAssetFleet.emit({ refreshFleet: true })
                    );
                }
                else {
                    this.islinksourcetabclickEnable = false;

                }

            });

        });

    }

    ngOnInit() {

        this.IsCompanyOwned = true;
        this.IsEmployeeOwned = false;
        this.IsArchivedAsset = false;
        this.IsArchivedDisabled = false;
        setTimeout(() => {
            this.refreshData();
        }, 500);

    }

    /**
   * to destroy the emit subscription on ngOnDestroy otherwise it keeps into the memory for root
 */
    bindEvent() {


        let elements = this.el.nativeElement.querySelectorAll('p-tabview ul li');

        for (let ele of elements) {
            ele.addEventListener('click', (event: any) => {
                if (this.islinksourcetabclickEnable) {
                    this.reloadLinkSourceClick(event);
                }
            })
        }

    }

    // to reload link source by link type when you already drill down the link source row.
    reloadLinkSourceClick(event: any) {

        if (this.islinksourcetabclickEnable && event.target) {
            var activetabid = event.target.textContent.trim();
            this.activeTab = this.getTabDetails(activetabid);
            this.setReloadLinkSourceTitle(activetabid);
            if (this.activeTab) {

                this.loadTabByLinkSource();
            }
            else {
                this.loadTabByFleet();
            }
        }
    }

    getTabDetails(tabID: any): FeatureRoleRelTreeViewModel {
        let tab = this.tabs.filter(t => t.data.featuredescription == this.activetableid)[0];
        if (tab) {
            return tab.data;
        }
        return null;
    }

    // to set the property islinksourcetabclickEnable to false and set the activetabid, titlename while reloading the linksource
    setReloadLinkSourceTitle(tabname: any) {
        this.islinksourcetabclickEnable = false;
        this.activetableid = tabname;
        this.titleName = this.activetableid;
    }

    // to set the property and call function for loading the Fleet tab.
    loadTabByFleet() {
        this.iscomponentload = false;
        this.activetableid = null;
        this.linksourceguid = null;
        this.LoadDataByFleet();
    }
    // to set the property and call function for loading the link source tab.
    loadTabByLinkSource() {

        this.linksourceguid = null;
        this.iscomponentload = true;
        this.LoadDataByLinkSource();
    }

    onCompanyOwnedChanged() {
        this.setIncludeArchivedAsset()
        this.refreshData();
    }

    onEmployeeOwnedChanged() {
        this.setIncludeArchivedAsset()
        this.refreshData();
    }

    onArchivedAssetChanged() {
        if (this.IsCompanyOwned || this.IsEmployeeOwned) {
            this.refreshData();
        }
    }

    refreshData() {

        if (this.iscomponentload) {
            this.LoadDataByLinkSource();
        }
        else {
            this.LoadDataByFleet();
        }


    }

    setIncludeArchivedAsset() {
        if (!this.IsCompanyOwned && !this.IsEmployeeOwned) {
            this.IsArchivedAsset = false;
            this.IsArchivedDisabled = true;
        }
        else {
            this.IsArchivedDisabled = false;
        }
    }

    // to load the asset fleet componenet dynamically
    loadAssetFleet() {

        if (this.componentRef) {
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(AssetFleetComponent);

        this.componentRef = <any>this.assetfleetcontainer.createComponent(factory);

        this.setComponentRef(false);

        this.componentRef.changeDetectorRef.detectChanges();
    }

    getTabHeaderName(): string {
        let tabHeader = "";
        if (this.activeTab) {
            tabHeader = this.activeTab.featuredescription;
        }
        return tabHeader;
    }
    // to set the input property on the child componenet for fleet and link source
    setComponentRef(linksource: boolean) {

        this.componentRef.instance["IsCompanyOwned"] = this.IsCompanyOwned;
        this.componentRef.instance["IsEmployeeOwned"] = this.IsEmployeeOwned;
        this.componentRef.instance["IsArchivedAsset"] = this.IsArchivedAsset;
        this.componentRef.instance["tabHeader"] = this.getTabHeaderName();
        if (linksource) {
            this.componentRef.instance["linktype"] = this.getLinkSource();
            this.componentRef.instance["rtypeguid"] = this.getReportingGroupTypeGuid();
        }
    }

    //get the ReportingGroupType Guid from Active Tab
    getReportingGroupTypeGuid(): string {
        let rtypeGuid = "";
        if (this.activeTab) {
            rtypeGuid = String.getUrlParameter(this.activeTab.routeurl, 'rtypeguid');
        }
        return rtypeGuid;
    }

    getLinkSource(): string {

        let linkSoruce = "";
        if (this.activeTab) {
            linkSoruce = this.activeTab.featurekey;
        }
        return linkSoruce;
    }

    /* 
   Load the Link Source Component by selecting the tab i.e. Link Source (Department, ConsCentre, Netwok)
   */
    loadAssetFleeteByLinkSource() {
        if (this.activeTab) {
            if (this.componentRef && this.iscomponentload) {
                this.componentRef.destroy();
            }
            const factory = this.componentFactoryResolver.resolveComponentFactory(AssetLinkSourceComponent);
            this.componentRef = <any>this.dynamicContainer.filter(d => d.element.nativeElement.dataset.key == this.activeTab.featuredescription)[0].createComponent(factory);
            this.setComponentRef(true);
            this.componentRef.changeDetectorRef.detectChanges();
        }
    }


    LoadDataByLinkSource() {

        //const p3 = () => {
        //    const promise = new Promise((resolve, reject) => {
        //        setTimeout(() => {
        //            this.loadAssetFleeteByLinkSource();
        //        }, 0);
        //    });
        //};        
        this.loadAssetFleeteByLinkSource();
    }

    LoadDataByFleet() {

        //const p3 = () => {
        //    const promise = new Promise((resolve, reject) => {
        //        setTimeout(() => {
        //            this.loadAssetFleet();
        //            this.globalEvent.refreshAssetFleet.emit({ refreshFleet: true });
        //        }, 0);
        //    });
        //};

        //this.loader.emit(p3);
        this.loadAssetFleet();
        this.globalEvent.refreshAssetFleet.emit({ refreshFleet: true });
    }


    onTabChange(e: any) {
        // this gets the active tab name        
        this.islinksourcetabclickEnable = false;
        this.activetableid = e.originalEvent.currentTarget.innerText.trim();
        this.titleName = this.activetableid;
        this.activeTab = this.getTabDetails(this.activetableid);
        if (e.index > 0) {

            this.loadTabByLinkSource();
        }
        else {

            this.loadTabByFleet();
        }

    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    GetVisibleTabs(): FeatureRoleRelHierarchicalViewModel[] {
        let visibletabs: FeatureRoleRelHierarchicalViewModel[];
        if (this.tabs) {
            visibletabs = this.tabs.filter(x => !x.data.isvisibleonly);
        }
        return visibletabs;
    }

}