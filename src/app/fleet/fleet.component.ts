import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, QueryList, OnChanges, ElementRef, ComponentRef, Injectable, Injector, ViewChildren, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem, } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { GlobalEventsManager } from "../_common/global-event.manager";
import { FleetManageComponent } from "../fleet/fleet.manage.component";
import { FleetLinkSourceComponent } from "../fleet/fleet.linksource.component";
//import { Globalize } from '../_common/globalizejs'
import { LinkType } from '../_services/enumtype';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { Column } from '../_models/primeng-datatable';
import { UserService } from '../_services/user.service';
//import { LocalStorageProvider } from '../_common/localstorageprovider';
import { UserDetail } from '../_models/user-detail';
import { FeatureType } from '../_services/enumtype';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureRoleRelHierarchicalViewModel, FeatureRoleRelTreeViewModel } from '../_models/features';
import { String } from '../_common/utility-method';
import { BENDetailService } from '../_services/bendetail.service';



@Component({
    selector: 'fleet',
    templateUrl: './fleet.component.html',
    entryComponents: [FleetManageComponent, FleetLinkSourceComponent]
})

export class FleetComponent implements OnInit, OnDestroy {
    // creating four view child container for dynamic loading
    @ViewChild('managefleetcontainer', { read: ViewContainerRef, static: false }) managefleetcontainer: ViewContainerRef;
    @ViewChildren('managefleetdynamiccontainer', { read: ViewContainerRef }) managefleetdynamiccontainer: QueryList<ViewContainerRef>;


    // creating the refrence for component

    componentRef: ComponentRef<Component>;
    tabs: FeatureRoleRelHierarchicalViewModel[];
    activeTab: FeatureRoleRelTreeViewModel;

    /* property to handle the logic */
    iscomponentload: boolean = false;
    activetableid: any;
    subscription: any;
    reportinggroup: ReportingGroupViewModel[];
    linksourceguid: string;
    isbenexist: boolean;
    /* declare variable for graph related */
    titleName: string = "Fleet";
    islinksourcetabclickEnable: boolean = false;


    activemobile: boolean = true;
    cancelledmobile: boolean = false;

    error: string;

    /* drill down category from other tabs */
    selectedcategory: string = '';

    /* for disabling checkboxes so at least one is always selected */
    activedisabled: boolean = true;
    cancelleddisabled: boolean = null;
    refreshFleetSubscribe: any;
    private loader: EventEmitter<any>;
    sub: any;
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param InvoiceService: InvoiceService to inject
     * @param GlobalEventsManager: GlobalEventsManager to inject
     */
    constructor(private authenticationService: AuthenticationService, private globalEvent: GlobalEventsManager
        , private componentFactoryResolver: ComponentFactoryResolver
        , private userservice: UserService
        , private router: Router
        , public el: ElementRef
        , private route: ActivatedRoute
        , private viewContainerRef: ViewContainerRef
        , private bendetailService: BENDetailService
        , private authService: AuthenticationService) {

        this.loader = globalEvent.busySpinner;

        let user: UserDetail = this.authService.currentUserValue;
        //LocalStorageProvider.getUserStorage();

        this.userservice.LoadFeatureTreeViewByUserRole(user.roleid, user.id, this.router.url, FeatureType.Feature).then(res => {

            this.tabs = res;
            setTimeout(() => {
                this.bindEvent()
            }, 1000);

        });
        this.refreshFleetSubscribe = this.globalEvent.refreshFleet.subscribe((data: any) => {
            if (data.selectedcategory) {
                this.selectedcategory = " - " + data.selectedcategory;
            }
            if (data.refreshFleet) {
                this.islinksourcetabclickEnable = true;
            }
        });
    }


    ngOnInit() {

        this.route.params.subscribe(params => {
            this.sub = this.route.queryParams.subscribe(params => {
            });
        });
        this.bendetailService.IsBenExistForCompanyAsnyc().then(res => {
            this.isbenexist = res;
            this.refreshData();
        });

    }

    /* this method refresh the child tab grid data and graph according to selection of tab. i.e. link source.
       link source is active tab.
       */

    refreshData(tabevent: boolean = true) {

        if (this.iscomponentload && !this.islinksourcetabclickEnable) {
            this.LoadDataByLinkSource();
        }
        else {
            this.LoadDataByFleet();
        }

    }
    LoadDataByLinkSource() {
        this.loadManageFleetByLinkSource();
    }

    LoadDataByFleet() {

        this.loadManageFleet();
        this.globalEvent.refreshFleet.emit({ refreshFleet: true });
    }


    // to load the fleet componenet dynamically
    loadManageFleet() {
        let localLinkTypeGuid = null;
        if (this.componentRef) {
            localLinkTypeGuid = this.componentRef.instance["linksourceguid"];
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(FleetManageComponent);
        if (this.iscomponentload) {
            this.componentRef = <any>this.managefleetdynamiccontainer.filter(d => d.element.nativeElement.dataset.key == this.activeTab.featuredescription)[0].createComponent(factory);

        }
        else {
            this.componentRef = <any>this.managefleetcontainer.createComponent(factory);
        }
        this.setComponentRef(false, null, localLinkTypeGuid);
        this.componentRef.changeDetectorRef.detectChanges();

    }

    // to set the input property on the child componenet for fleet and link source
    setComponentRef(linksource: boolean, activetabname?: string, linksourceguid?: string) {
        this.componentRef.instance["activemobile"] = this.activemobile;
        this.componentRef.instance["cancelledmobile"] = this.cancelledmobile;
        this.componentRef.instance["linktype"] = this.getLinkSource();
        this.componentRef.instance["rtypeguid"] = this.getReportingGroupTypeGuid();
        this.componentRef.instance["isbenexist"] = this.isbenexist;
        this.componentRef.instance["tabHeader"] = this.getTabHeaderName();

        if (linksource) {
            this.componentRef.instance["currenttabname"] = activetabname;
        }
        if (linksourceguid) {
            this.componentRef.instance["linksourceguid"] = linksourceguid;
        }
    }
    /* 
    Load the Link Source Component by selecting the tab i.e. Link Source (Department, ConsCentre, Netwok)
    */
    loadManageFleetByLinkSource() {
        if (this.activeTab) {
            if (this.componentRef && this.iscomponentload) {
                this.componentRef.destroy()
            }
            const factory = this.componentFactoryResolver.resolveComponentFactory(FleetLinkSourceComponent);
            this.componentRef = <any>this.managefleetdynamiccontainer.filter(d => d.element.nativeElement.dataset.key == this.activeTab.featuredescription)[0].createComponent(factory);
            this.setComponentRef(true, this.activeTab.featuredescription);
            this.componentRef.changeDetectorRef.detectChanges();
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

    getTabHeaderName(): string {
        let tabHeader = "";
        if (this.activeTab) {
            tabHeader = this.activeTab.featuredescription;
        }
        return tabHeader;
    }
    getLinkSource(): string {

        let linkSoruce = "";
        if (this.activeTab) {
            linkSoruce = this.activeTab.featurekey;
        }
        return linkSoruce;
    }

    /*
    This is a tab change event to load the grid data and graph according to link source
    */

    onTabChange(e: any) {
        this.selectedcategory = '';
        this.islinksourcetabclickEnable = false;
        this.activetableid = e.originalEvent.currentTarget.innerText.trim();
        this.titleName = this.activetableid + this.selectedcategory;
        this.activeTab = this.getTabDetails(this.activetableid);
        if (e.index > 0) {
            this.loadTabByLinkSource();
        }
        else {
            this.loadTabByFleet();
        }

    }

    getTabDetails(tabID: any): FeatureRoleRelTreeViewModel {
        let tab = this.tabs.filter(t => t.data.featuredescription == this.activetableid)[0];
        if (tab) {
            return tab.data;
        }
        return null;
    }

    // to reload link source by link type when you already drill down the link source row.
    reloadLinkSourceClick(event: any) {
        if (this.islinksourcetabclickEnable && event.target) {
            var activetabid = event.target.textContent.trim();
            this.activeTab = this.getTabDetails(activetabid);
            this.selectedcategory = '';
            this.setReloadLinkSourceTitle(activetabid);
            if (this.activeTab) {

                this.loadTabByLinkSource();
            }
            else {
                this.loadTabByFleet();
            }
        }
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

    /**
     * to destroy the emit subscription on ngOnDestroy otherwise it keeps into the memory for root
   */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        if (this.refreshFleetSubscribe) {
            this.refreshFleetSubscribe.unsubscribe();
            this.refreshFleetSubscribe = null;
        }
        if (this.sub) {
            this.sub.unsubscribe();
        }

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

    checkboxChange($data: any) {
        if (!this.activemobile) {
            this.activedisabled = null;
            this.cancelleddisabled = true;
        }
        else if (!this.cancelledmobile) {
            this.activedisabled = true;
            this.cancelleddisabled = null;
        }
        else {
            this.activedisabled = null;
            this.cancelleddisabled = null;
        }
        this.refreshData(false);
    }

    GetVisibleTabs(): FeatureRoleRelHierarchicalViewModel[] {
        let visibletabs: FeatureRoleRelHierarchicalViewModel[];
        if (this.tabs) {
            visibletabs = this.tabs.filter(x => !x.data.isvisibleonly);
        }
        return visibletabs;
    }

}
