import { Component, Input, ApplicationRef, OnInit, EventEmitter, Output, AfterViewInit, QueryList, OnChanges, ElementRef, ComponentRef, Injectable, Injector, ViewChildren, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { NetworkService } from "../_services/network.service";
import { InvoiceDateService } from '../_services/invoicedate.service'
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceService } from '../_services/invoice.service'
import { BenDetail } from '../_models/ben-detail';
import { Invoice } from "../_models/invoice";
import { GlobalEventsManager } from "../_common/global-event.manager";
import { InvoiceFleetComponent } from "../invoice/invoice.fleet.component";
import { InvoiceLinkSourceComponent } from "../invoice/invoice.linksource.component";
//import { Globalize } from '../_common/globalizejs'
import { ChartHelper, ChartType } from '../_models/chart';
import { LinkType } from '../_services/enumtype';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { Column } from '../_models/primeng-datatable';
import { UserService } from '../_services/user.service';
import { LocalStorageProvider } from '../_common/localstorageprovider';
import { UserDetail } from '../_models/user-detail';
import { FeatureType } from '../_services/enumtype';
import { Router, ActivatedRoute } from '@angular/router';
import { FeatureRoleRelHierarchicalViewModel, FeatureRoleRelTreeViewModel } from '../_models/features';
import { String } from '../_common/utility-method';
var linq=require('linq');

@Component({
    selector: 'invoice-report',
    templateUrl: './invoice.component.html',
    entryComponents: [InvoiceFleetComponent, InvoiceLinkSourceComponent],

})

export class InvoiceComponent implements OnInit, OnDestroy {
    // creating four view child container for dynamic loading
    @ViewChild('fleetcontainer', { read: ViewContainerRef, static: false }) fleetcontainer: ViewContainerRef;
    @ViewChildren('dynamicContainer', { read: ViewContainerRef }) dynamicContainer: QueryList<ViewContainerRef>;

    dashboardSelectedMonthId: any;


    // creating the refrence for component
    componentRef: ComponentRef<Component>;
    tabs: FeatureRoleRelHierarchicalViewModel[];
    activeTab: FeatureRoleRelTreeViewModel;
    fromDate: Date = null;
    toDate: Date = null;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicedateguid: string;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;


    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string = null;

    /* Ben List */
    benArray: SelectItem[];
    benguid: string;
    banArray: SelectItem[];
    ban: string;
    /* property to handle the logic */
    iscomponentload: boolean = false;
    activeIndex: any;
    activetableid: any;
    subscription: any;
    reportinggroup: ReportingGroupViewModel[];
    linksourceguid: string;

    /* declare variable for graph related */
    piechartData: any;
    linksourcebarchartData: any;
    invoicesummarybarchartData: any;
    isshowpiechart: boolean = true;
    titleName: string = "Fleet";
    invoicemonthname: string;
    islinksourcetabclickEnable: boolean = false;

    isobservationdrilldown: boolean = false;

    dashboardNetworkguid: string;
    dashboardbillingplatformguid: string;
    dashboardbenguid: string;
    dashboardbanguid: string;


    r1: string;
    r2: string;
    r3: string;
    r4: string;
    r5: string;
    r6: string;

    private loader: EventEmitter<any>;
    sub: any;
    noInvoiceAvailable?: boolean;
    /**
     * Constructor: used to inject services
     * @param networkService: Network service to inject
     * @param authenticationService: AuthenticationService to inject
     * @param InvoiceService: InvoiceService to inject
     * @param GlobalEventsManager: GlobalEventsManager to inject
     */
    constructor(private authenticationService: AuthenticationService,
        private InvoiceDateService: InvoiceDateService,
        private networkService: NetworkService,
        private InvoiceService: InvoiceService,
        private globalEvent: GlobalEventsManager,
        private appRef: ApplicationRef
        , private componentFactoryResolver: ComponentFactoryResolver
        , private userservice: UserService
        , private router: Router
        , public el: ElementRef
        , private viewContainerRef: ViewContainerRef
        , private authService: AuthenticationService
        , private route: ActivatedRoute) {

        this.loader = globalEvent.busySpinner;




    }


    GetVisibleTabs(): FeatureRoleRelHierarchicalViewModel[] {
        let visibletabs: FeatureRoleRelHierarchicalViewModel[];
        if (this.tabs) {
            visibletabs = this.tabs.filter(x => !x.data.isvisibleonly);
        }
        return visibletabs;
    }


    ngOnInit() {

        this.route.params.subscribe(params => {
            this.sub = this.route.queryParams.subscribe(params => {
                this.dashboardSelectedMonthId = params['fd'] || "";
                this.isobservationdrilldown = (params['dd'] || "") != "" ? true : false;

                this.dashboardNetworkguid = params['nt'] || "";
                this.dashboardbillingplatformguid = params['bp'] || "";
                this.dashboardbenguid = params['ben'] || "";
                this.dashboardbanguid = params['ban'] || "";

                this.r1 = params['r1'] || "";
                this.r2 = params['r2'] || "";
                this.r3 = params['r3'] || "";
                this.r4 = params['r4'] || "";
                this.r5 = params['r5'] || "";
                this.r6 = params['r6'] || "";
            });
        });

        let user: UserDetail =this.authService.currentUserValue;

        this.userservice.LoadFeatureTreeViewByUserRole(user.roleid, user.id, String.getRootUrl(this.router.url), FeatureType.Feature).then(res => {
            //;
            this.tabs = res;
            var p = this.loadInvoiceMonths();
            setTimeout(() => {
                this.bindEvent()
            }, 1000);


            this.loader.emit(
                Promise.all([p]).then(x => {
                    if (!this.noInvoiceAvailable) {
                        // to subscribe the emit event when clik on the link source drill down for fleet
                        this.subscription = this.globalEvent.refreshLinkSourceInvoiceGraph.subscribe((data: any) => {
                            if (data != null) {
                                this.linksourceguid = data.linksourceguid;
                                this.titleName = this.titleName + " - " + data.description;
                                this.isshowpiechart = true;
                                this.islinksourcetabclickEnable = true;

                                var p1 = this.loadInvoiceSummaryGraph();
                                var p2 = this.LoadInvoiceUsagePieChart();
                                this.loader.emit(
                                    Promise.all([p1, p2]).then(x => {
                                        this.globalEvent.refreshInvoiceFleet.emit({ refreshFleet: true });

                                    })
                                );
                            }
                            else {
                                this.islinksourcetabclickEnable = false;
                            }

                        });
                    }

                })
            );


        });

        // to load the default data according to the invoice date

    }

    /* this method refresh the child tab grid data and graph according to selection of tab. i.e. link source.
       link source is active tab.
       */

    refreshData() {
        //;
        if (this.iscomponentload) {
            this.LoadDataByLinkSource();
        }
        else {
            //;
            this.LoadDataByFleet();
        }
    }
    LoadDataByLinkSource() {
        var p1 = this.loadInvoiceSummaryGraph();
        var p2 = this.loadInvoiceLinkSourceBarGraph();
        //var p3 = this.loadInvoiceByLinkSource();
        //this.loader.emit(Promise.all([p1, p2, p3]).then(x => {
        //    this.isshowpiechart = false;
        //}));
        const p3 = () => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.loadInvoiceByLinkSource();
                }, 0);
            });
        };
        this.loader.emit(Promise.all([p2]).then(p3).then(x => {
            this.isshowpiechart = false;
        }));
    }

    LoadDataByFleet() {
        //;
        var p1 = this.LoadInvoiceUsagePieChart();
        var p2 = this.loadInvoiceSummaryGraph();
        const p3 = () => {
            const promise = new Promise((resolve, reject) => {
                setTimeout(() => {
                    this.loadInvoiceFleet();
                    this.globalEvent.refreshInvoiceFleet.emit({ refreshFleet: true });
                }, 0);
            });
        };

        this.loader.emit(Promise.all([p1, p2]).then(p3));
    }

    /**
     * Load the avaialble  months for given company from invoie ctn, selected network and billingplatfrom
     */
    loadInvoiceMonths(): Promise<any> {
        this.clearInvoiceMonths();
        let p = new Promise((resolve, reject) => {
            this.InvoiceDateService.getInvoiceMonth().then((data) => {
                if (data && data.length > 0) {
                    data.forEach(item => this.invoicemonthArray.push({
                        label: item.invoicedatedescription,
                        value: item.invoicedateguid,
                    }));


                    let invoiceMonthDetails = data.filter(x => x.id == this.dashboardSelectedMonthId)[0];
                    if (invoiceMonthDetails) {
                        this.invoicedateguid = invoiceMonthDetails.invoicedateguid;
                        this.invoicemonthname = invoiceMonthDetails.invoicedatedescription;
                    }
                    else {
                        this.invoicedateguid = data[0].invoicedateguid;
                        this.invoicemonthname = data[0].invoicedatedescription;
                    }

                    let p1 = this.loadNetworkDropdown();
                    let p2 = this.loadBenDropDown();
                    let p3 = this.loadBanDropDown();

                    this.noInvoiceAvailable = false;
                    Promise.all([p1, p2, p3]).then(() => {
                        let p4 = this.LoadDataByFleet();
                        resolve();
                    });

                }
                else {
                    this.noInvoiceAvailable = true;
                    resolve();
                }
            });
        });
        return p;
    }

    // Change event of invoice month. for same date it will not refresh data.
    onInvoiceMonthChange(event: any) {
        //;
        this.invoicemonthname = event.originalEvent.currentTarget.innerText;
        this.loadNetworkDropdown();
        this.loadBenDropDown();
        this.loadBanDropDown();
        this.refreshData();
    }

    /**
     * Populates the network dropdown those aviable in invoce ctn for selected invoice month
     */
    loadNetworkDropdown(): Promise<any> {
        this.clearNetworks();
        this.networkArray.push({ label: 'ALL', value: null });
        return this.networkService.getNetworkList(null, null, this.invoicedateguid).then((data) => {
            if (data && data.length > 0) {
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid
                }));

                let networkDetails = data.filter(x => x.networkguid == this.dashboardNetworkguid)[0];
                if (networkDetails) {
                    this.networkguid = networkDetails.networkguid;
                }
            }
        });
    }


    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatforms() {
        return this.networkService.getBillingPlatforms(this.networkguid, false, null, null, this.invoicedateguid);
    }


    /**
     * If billing platforms exists for given network, load them.
     */
    loadBillingPlatformDropDown() {

        this.clearBillingPlatform();
        this.loadBillingPlatforms().then((data) => {
            if (data && data.length > 0) {
                this.billingPlatformArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.billingPlatformArray.push({
                    label: item.billingplatformdescription, value: item.billingplatformguid
                }));

                let billingplatformDetails = data.filter(x => x.billingplatformguid == this.dashboardbillingplatformguid)[0];
                if (billingplatformDetails) {
                    this.billingplatformguid = billingplatformDetails.billingplatformguid;
                }
            }
        });
        this.clearBens();
        this.clearBans();
        var p1 = this.loadBanDropDown();
        var p2 = this.loadBenDropDown();
        Promise.all([p1, p2]).then(() => { this.refreshData() })


    }

    // change event of Billing Platform to load the ben drop down and refresh data
    onChangeBillingPlatForm() {
        var p1 = this.loadBanDropDown();
        var p2 = this.loadBenDropDown();
        Promise.all([p1, p2]).then(() => { this.refreshData(); });

    }

    onChangeBenDetails() {
        this.refreshData();
    }


    /**
    * Load the billing platforms for the given company and selected network
    */
    getBenDetails() {
        return this.InvoiceService.getBenList(this.invoicedateguid, this.networkguid, this.billingplatformguid, this.fromDate, this.toDate);
    }
    /**
  * Load the Ban for the given company and selected network
  */
    getBanDetails() {
        return this.InvoiceService.getBanList(this.invoicedateguid, this.networkguid, this.billingplatformguid);
    }

    loadBenDropDown(): Promise<any> {
        this.clearBens();
        return this.getBenDetails().then((data) => {
            if (data && data.length > 0) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
                //this.toggleTab(LinkType[LinkType.BEN].toString(), true);

                let bendetails = data.filter(x => x.benguid == this.dashboardbenguid)[0];
                if (bendetails) {
                    this.benguid = bendetails.benguid;
                }
            }
            else {
                //this.toggleTab(LinkType[LinkType.BEN].toString(), false);
            }

        });

    }

    loadBanDropDown(): Promise<any> {
        this.clearBans();
        return this.getBanDetails().then((data) => {
            //;
            if (data && data.length > 0) {
                this.banArray.push({ label: 'ALL', value: "" });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
                this.toggleTab(LinkType[LinkType.BAN].toString(), true);

                let bandetails = data.filter(x => x.banguid == this.dashboardbanguid)[0];
                if (bandetails) {
                    this.ban = bandetails.banguid;
                }
            }
            else {
                this.toggleTab(LinkType[LinkType.BAN].toString(), false);
            }
        });

    }

    toggleTab(key: string, hide: boolean) {
        if (this.tabs && this.tabs.length > 0) {
            ;
            let index = this.tabs.findIndex(t => t.data.featurekey == key);
            if (this.tabs[index] && this.tabs[index].data.isvisibleonly != hide) {
                this.tabs[index].data.isvisibleonly = hide;
            };
            if (hide != true) {
                if (this.activeTab && this.activeTab.featurekey == key) {
                    this.activeIndex = 0;
                    this.activeTab = undefined;
                    this.iscomponentload = false;
                    this.refreshData();
                }
            }
        }
    }

    // to load the fleet componenet dynamically
    loadInvoiceFleet() {

        if (this.componentRef) {
            this.appRef.detachView(this.componentRef.hostView);
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(InvoiceFleetComponent);

        this.componentRef = <any>this.fleetcontainer.createComponent(factory);
        this.setComponentRef(false);
        this.componentRef.changeDetectorRef.detectChanges();
        // this.componentRef.onDestroy(() => { this.removeCompRef() });

        //console.log(this.globalEvent.refreshInvoiceFleet);
    }

    // to set the input property on the child componenet for fleet and link source
    setComponentRef(linksource: boolean) {

        this.componentRef.instance["invoicedateguid"] = this.invoicedateguid;
        this.componentRef.instance["networkguid"] = this.networkguid;
        this.componentRef.instance["billingplatformguid"] = this.billingplatformguid;
        this.componentRef.instance["benguid"] = this.benguid;
        this.componentRef.instance["ban"] = this.ban;
        this.componentRef.instance["isbendisplay"] = this.benArray != undefined ? this.benArray.length > 1 ? true : false : false;
        this.componentRef.instance["isbandisplay"] = this.banArray != undefined ? this.banArray.length > 1 ? true : false : false;
        this.componentRef.instance["invoicemonthname"] = this.invoicemonthname;
        if (linksource) {
            this.componentRef.instance["linktype"] = this.getLinkSource();
            this.componentRef.instance["rtypeguid"] = this.getReportingGroupTypeGuid();
        }
        this.componentRef.instance["isobservationdrilldown"] = this.isobservationdrilldown;


        this.componentRef.instance["r1"] = this.r1;
        this.componentRef.instance["r2"] = this.r2;
        this.componentRef.instance["r3"] = this.r3;
        this.componentRef.instance["r4"] = this.r4;
        this.componentRef.instance["r5"] = this.r5;
        this.componentRef.instance["r6"] = this.r6;
    }

    /* 
    Load the Link Source Component by selecting the tab i.e. Link Source (Department, ConsCentre, Netwok)
    */
    loadInvoiceByLinkSource() {
        if (this.activeTab) {
            if (this.componentRef && this.iscomponentload) {
                this.componentRef.destroy();
            }
            const factory = this.componentFactoryResolver.resolveComponentFactory(InvoiceLinkSourceComponent);
            this.componentRef = <any>this.dynamicContainer.filter(d => d.element.nativeElement.dataset.key == this.activeTab.featuredescription)[0].createComponent(factory);
            this.setComponentRef(true);
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

    getLinkSource(): string {

        let linkSoruce = "";
        if (this.activeTab) {
            linkSoruce = this.activeTab.featurekey;
        }
        return linkSoruce;
    }
    /*
     This loads the Invoice summary graph with InvoiceCost, ServiceCharge and UsageCharge
     */
    loadInvoiceSummaryGraph() {


        return this.InvoiceService.GetCTNInvoiceSummaryGraph(this.getLinkSource(), this.invoicedateguid, this.networkguid, this.linksourceguid, this.getReportingGroupTypeGuid(), this.billingplatformguid, this.benguid, this.ban, this.isobservationdrilldown).then(data => {
            if (data && data.length > 0) {
                var graphdata: any[] = linq.from(data)
                    .groupBy("$.networkdescription", null,
                        function (key: any, g: any) {
                            return {
                                "Network": key,
                                "Invoice Cost": g.sum("$.totalcost").toFixed(2),
                                "Service Charge": g.sum("$.totallinerental").toFixed(2),
                                "Usage Charge": g.sum("$.usagecharge").toFixed(2),
                                "Other Charge": g.sum("$.othercharge").toFixed(2)
                            }
                        })
                    .toArray();
                let labels: string[] = Object.keys(graphdata[0]).filter(x => x != "Network");
                let networkarray: any[] = [];
                graphdata.forEach((x, index) => {
                    networkarray.push({
                        label: x["Network"],
                        backgroundColor: ChartHelper.graphColor[index],
                        borderColor: ChartHelper.graphColor[index],
                        data: labels.map(l => x[l])
                    })
                })
                this.invoicesummarybarchartData = {
                    labels: labels,
                    datasets: networkarray
                };
            }
            else {
                this.invoicesummarybarchartData = null;
            }
        });

    }

    /*
     Create Invoice Usage PieChart from piechartData model
     This loads the Invoice Usage PieChart only for fleet.
     */

    LoadInvoiceUsagePieChart(): Promise<any> {

        return this.InvoiceService.GetCTNInvoiceUsageGraph(this.getLinkSource(), this.invoicedateguid, this.networkguid, this.linksourceguid, this.getReportingGroupTypeGuid(), this.billingplatformguid, this.benguid, this.ban, this.isobservationdrilldown).then(data => {
            let piechartcolor = ChartHelper.graphColor.slice(ChartHelper.graphColor.length - (data.length), ChartHelper.graphColor.length);
            this.piechartData = {
                labels: data.map(q => q.calltype.toUpperCase()),
                datasets: [
                    {
                        backgroundColor: piechartcolor,
                        borderColor: piechartcolor,
                        data: data.map(q => {
                            return q.usagecharge;
                        })
                    }
                ]

            };

        });

    }


    //Create Invoice link source bar graph from linksourcebarchartData model
    loadInvoiceLinkSourceBarGraph(): Promise<any> {

        return this.InvoiceService.GetTopInvoiceCTNUsageGraphByLinkSource(this.getLinkSource(), this.getReportingGroupTypeGuid(), this.invoicedateguid, this.networkguid, this.billingplatformguid, this.benguid, this.ban).then(data => {
            let barchartcolor = ChartHelper.graphColor.slice(ChartHelper.graphColor.length - data.length, ChartHelper.graphColor.length)
            this.linksourcebarchartData = {
                labels: data.map(q => q.description.toUpperCase()),
                datasets: [
                    {
                        // label: ['Top ' + this.activetableid + ' Usage'],
                        backgroundColor: barchartcolor,
                        data: data.map(q => {
                            return q.usagecharge;
                        })
                    }
                ]
            };

        });

    }

    chartOptions() {
        return ChartHelper.getInvoiceSummaryCustomToolTipwithFormulaChartOptions(ChartType.bar, true, true, true, true);
    }

    LinkSourceChartOptions() {
        return ChartHelper.getChartOptions(ChartType.bar, false);
    }

    pieChartOptions() {
        return ChartHelper.getChartOptions(ChartType.pie, true, true, true);
    }

    /*
    This is a tab change event to load the grid data and graph according to link source
    */

    onTabChange(e: any) {
        // this gets the active tab name
        if (this.invoicedateguid) {
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
        this.isshowpiechart = true;
        this.iscomponentload = false;
        this.activetableid = null;
        this.invoicesummarybarchartData = null;
        this.linksourcebarchartData = null;
        this.linksourceguid = null;
        this.piechartData = null;
        //;
        this.LoadDataByFleet();
    }
    // to set the property and call function for loading the link source tab.
    loadTabByLinkSource() {

        this.invoicesummarybarchartData = null;
        this.linksourcebarchartData = null;
        this.piechartData = null;
        this.isshowpiechart = false;
        this.linksourceguid = null;
        this.iscomponentload = true;
        this.LoadDataByLinkSource();
    }
    /**
     * Clears the invoice months and selection
     */
    clearInvoiceMonths() {
        this.invoicemonthArray = [];
        this.invoicedateguid = "";
    }

    /**
     * Clears the networks dropdown and selecttion
     */
    clearNetworks() {
        this.networkArray = [];
        this.networkguid = null;
    }

    /**
     * Clears the billing platform and selection
     */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        this.billingplatformguid = null;
    }
    /**
     * Clears the ben dropdown and selecttion
     */
    clearBens() {
        this.benArray = [];
        this.benguid = null;
    }

    /**
 * Clears the ban dropdown and selecttion
 */
    clearBans() {
        this.banArray = [];
        this.ban = "";
    }
    /**
     * to destroy the emit subscription on ngOnDestroy otherwise it keeps into the memory for root
   */
    ngOnDestroy() {
        //console.log("invoice Fleet ngDestroy invoideDateID" + this.invoicedateguid);
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
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


    //color: any = ChartHelper.graphColor;
    //dia() {
    //    return JSON.stringify(this.color);
    //}
}
