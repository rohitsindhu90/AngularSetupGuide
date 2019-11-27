import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, QueryList, OnChanges, ElementRef, ComponentRef, Injectable, Injector, ViewChildren, ViewContainerRef, ViewChild, ComponentFactoryResolver, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CallClassReportComponent } from './call-class-report.component';
import { CallClassLinkSourceComponent } from './call-class.linksource.component';
import { FeatureRoleRelHierarchicalViewModel, FeatureRoleRelTreeViewModel } from 'src/app/_models/features';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { SelectItem } from 'primengdevng8/api';
import { CallClassReportViewModel } from 'src/app/_models/report/call-class-report-details.model';
//import { Column } from 'primengdevng8/components/common/shared';
import { Column } from '../../_models/primeng-datatable';
import { NetworkService } from 'src/app/_services/network.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceService } from 'src/app/_services/invoice.service';
import { GenericService } from 'src/app/_services/generic.service';
import { ClientControlService } from 'src/app/_services/clientcontrol.service';
import { GlobalEventsManager } from 'src/app/_common/global-event.manager';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';
import { FeatureService } from 'src/app/_services/feature.service';
import { UserDetail } from 'src/app/_models/user-detail';
import { LocalStorageProvider } from 'src/app/_common/localstorageprovider';
import { ClientControlEnum, FeatureType, LinkType } from 'src/app/_services/enumtype';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { ChartHelper, ChartType } from 'src/app/_models/chart';
import { UtilityMethod, String } from 'src/app/_common/utility-method';


declare let Chart: any;

@Component({
    selector: 'call-class-component',
    templateUrl: './call-class.component.html',
    entryComponents: [CallClassReportComponent, CallClassLinkSourceComponent]
})

export class CallClassComponent implements OnInit {
    // creating four view child container for dynamic loading
    @ViewChild('callclassfleetcontainer', { read: ViewContainerRef, static: false }) managefleetcontainer: ViewContainerRef;
    @ViewChildren('callclassfleetdynamiccontainer', { read: ViewContainerRef }) managefleetdynamiccontainer: QueryList<ViewContainerRef>;
    @ViewChild("usagechart", { static: false }) usagechart: any;


    activeIndex: number;
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

    /* declare variable for graph related */
    titleName: string = "Total Billing Information";
    islinksourcetabclickEnable: boolean = false;

    error: string;

    /* drill down category from other tabs */
    selectedcategory: string = '';

    private loader: EventEmitter<any>;
    isInvoiceActive: boolean = false;
    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    invoicemonthdetailArray: SelectItem[] = [];

    fromdate: Date;
    todate: Date;
    csvfilename: string;

    /* Networks */
    networkArray: SelectItem[];
    networkguid: string;

    charttypeusage: boolean = false;
    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    billingplatformguid: string;

    /* Ben List */
    benArray: SelectItem[];
    benguid: string;;

    banArray: SelectItem[];
    ban: string;

    callclassreportviewmodel: CallClassReportViewModel[];
    chartData: any;
    usageChartData: any;
    chartOptions: any;
    usagechartOptions: any;
    benfilterset: any[] = [{ value: null, label: "" }];
    banfilterset: any[] = [{ value: null, label: "" }];

    ismpayexist: boolean;

    istotalbillingcallcostvisible: boolean = false;
    datacolumns: Column[] = [];

    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;
    noInvoiceAvailable?: boolean;

    rgModelArray: ReportingGroupViewModel[];
    qBenFilter: any;
    qBanFilter: any;
    //banArray: any;
    /**
    * Constructor: used to inject services
    * @param networkService: Network service to inject
    * @param authenticationService: AuthenticationService to inject
    * @param : UploadInvoiceService to inject
    */
    constructor(private networkService: NetworkService,
        private authenticationService: AuthenticationService,
        private invoiceReportService: InvoiceReportService,
        private invoiceDateService: InvoiceDateService,
        private invoiceService: InvoiceService,
        private genericService: GenericService,
        private clientcontrolservice: ClientControlService,
        private globalEvent: GlobalEventsManager,
        private bendetailservice: BENDetailService,
        private route: ActivatedRoute,
        private componentFactoryResolver: ComponentFactoryResolver,
        private userservice: UserService,
        private router: Router,
        private featureservice: FeatureService,
        public el: ElementRef,
        private viewContainerRef: ViewContainerRef,
        private authService: AuthenticationService
    ) {
        this.loader = globalEvent.busySpinner;


    }


    ngOnInit() {
        let user: UserDetail = this.authService.currentUserValue;
        this.clientcontrolservice.GetClientControlByKey(ClientControlEnum.TotalBillingCallCost).then(r => {
            this.istotalbillingcallcostvisible = r.active;


        });
        let currentUrl = this.router.url.split('?')[0];
        this.userservice.LoadFeatureTreeViewByUserRole(user.roleid, user.id, currentUrl, FeatureType.Feature).then(res => {

            this.tabs = res;
            setTimeout(() => {
                this.bindEvent();
            }, 1000);
        });
        this.globalEvent.refreshLinkSourceCallClassGraph.subscribe((data: any) => {
            if (data != null) {
                this.linksourceguid = data.linksourceguid;
                this.titleName = this.activetableid + " - " + data.description;
                this.islinksourcetabclickEnable = true;

                var p1 = this.generateChart();
                this.loader.emit(Promise.all([p1]).then(x => {
                    this.globalEvent.refreshCallClassFleet.emit({ refreshFleet: true });
                }));
            }
            else {
                this.islinksourcetabclickEnable = false;
            }
        });
        this.route.queryParams.subscribe(params => {
            this.fromdate = params['fd'];
            this.todate = params['td'];
            this.networkguid = params["nid"];
            let reportingGroup = params["rg"];
            let reportingGroupGuid = params["rgid"];
            //dynamic parameter based on ceratria select from spend usage report 
            this[reportingGroup + 'guid'] = reportingGroupGuid;

            this.ban = params["banid"];
            this.benguid = params["benid"];
            this.billingplatformguid = params["bp"];
            if (this.fromdate == null || this.fromdate == undefined) {
                this.getInvoiceMonths();
            }

        });

        if (this.fromdate) {
            this.getInvoiceMonths();
        }
    }

    private getInvoiceMonths() {
        let process2 = this.loadReportingGroups();
        this.loader.emit(Promise.all([process2]).then(() => {
            let process3 = this.loadInvoiceMonthsNetworkCC(false);
            this.loader.emit(Promise.all([process3]));
        }));
    }

    loadReportingGroups(): Promise<any> {
        return this.invoiceReportService.getReportingGroupDetails(true).then((res) => {
            this.rgModelArray = res;
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
    }


    loadInvoiceMonthsNetworkCC(clearValue: boolean = true): Promise<any> {
        this.clearInvoiceMonths();
        return this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data && data.length) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item.invoicedatedescription,
                    value: item.startdate,
                }));
                //to get invoidedateguid for drill down parameter
                data.forEach(item => this.invoicemonthdetailArray.push({
                    label: item.invoicedateguid,
                    value: item.startdate,
                }));
                this.noInvoiceAvailable = false;
                if (this.fromdate == undefined) {
                    this.fromdate = data[0].startdate;
                }
                if (this.todate == undefined) {
                    this.todate = data[0].startdate;
                }
                // this.csvfilename = "CallClassReport_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;

                this.IsMPAYExist();
                this.loadNetworkDropdown(clearValue);
                this.loadBenBanDropdown(clearValue).then(r => {
                    this.refreshData();
                });

            }
            else {
                this.noInvoiceAvailable = true;
            }
        });

    }

    generateChart(): Promise<any> {
        return this.invoiceReportService.GetCallClassDetailsGraph('', this.networkguid, this.billingplatformguid, this.benguid, this.ban,
            this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid,
            this.fromdate, this.todate, this.getLinkSource(), this.linksourceguid, this.getReportingGroupTypeGuid()).then(data => {
                this.chartData = {
                    labels: data.map(q => q.reportdescription.toUpperCase()),
                    datasets: [
                        {
                            data: data.map(q => {
                                return q.usagecharge.toFixed(2);
                            })
                        }
                    ]
                };
                this.usageChartData = {
                    labels: data.map(q => q.reportdescription.toUpperCase()),
                    datasets: [
                        {
                            label: 'Data(MB)',
                            backgroundColor: ChartHelper.graphColor[0],
                            borderColor: ChartHelper.graphColor[0],

                            data: data.map(q => {
                                return q.datavolume.toFixed(2);
                            })
                        },
                        {
                            label: 'Minutes',
                            backgroundColor: ChartHelper.graphColor[1],
                            borderColor: ChartHelper.graphColor[1],
                            data: data.map(q => {
                                return q.minutes.toFixed(2);
                            })
                        }
                        ,
                        {
                            label: 'SMS',
                            backgroundColor: ChartHelper.graphColor[2],
                            borderColor: ChartHelper.graphColor[2],
                            data: data.map(q => {
                                return q.volume;
                            })
                        }

                    ]

                }
                this.generateChartOptions();
            });

    }


    generateChartOptions() {

        this.chartOptions = ChartHelper.getChartOptions(ChartType.bar, false, true, false, 0, 'top', false, false, this.handleClick, 12, false, false);
        this.usagechartOptions = ChartHelper.getChartOptions(ChartType.bar, true, false, false, 0, 'top', true, true, this.handleClick, 12, false, false);

    }

    handleClick = function (evt: any, chartController: any) {
        var x_element = chartController.getElementsAtXAxis(evt);


        //if (x_element.length > 0 && evt.y > 230 && evt.x>=355) {
        //if (x_element.length > 0 && (x_element[0]._view.y - evt.y) < 150) {
        // Get current Dataset
        var dataset = x_element[0]._datasetIndex;
        // Get current serial by dataset index
        var clickedElementindex = x_element[0]["_index"];
        //get specific label by index 
        var label = chartController.data.labels[clickedElementindex];
        //get value by index     
        
        this.navigateToTotalBillingByCallCategory(label);

        //}

    }.bind(this);

    clearInvoiceMonths() {
        this.invoicemonthArray = [];
    }

    //Check for IsMPAYExist to Display column in grid
    IsMPAYExist(): Promise<any> {
        return this.invoiceService.IsMPAYBetweenInvoiceDateExist(this.fromdate, this.todate).then(res => {

            this.ismpayexist = res;
        })
    }

    loadNetworkDropdown(clearValue: boolean = true): Promise<any> {
        this.clearNetworks(clearValue);
        this.networkArray.push({ label: 'ALL', value: null });
        return this.networkService.getNetworkList(this.fromdate, this.todate).then((data) => {
            data.forEach(item => this.networkArray.push({
                label: item.networkdescription, value: item.networkguid
            }));
        });
    }

    loadBenBanDropdown(clearValue: boolean = true): Promise<any> {
        let p1 = this.loadBenDropDown(clearValue);
        let p2 = this.loadBanDropDown(clearValue);

        return Promise.all([p1, p2])
    }

    clearNetworks(clearValue: boolean) {
        this.networkArray = [];
        if (clearValue) {
            this.networkguid = null;
        }
    }

    clearBillingPlatform(clearValue: boolean = true) {
        this.billingPlatformArray = [];
        if (clearValue) {
            this.billingplatformguid = null;
        }
    }

    clearBens(clearValue: boolean = true) {
        this.benArray = [];
        if (clearValue) {
            this.benguid = null;
        }

    }

    clearBans(clearValue: boolean = true) {
        this.banArray = [];
        if (clearValue) {
            this.ban = null;
        }
    }


    loadBenDropDown(clearValue: boolean = true): Promise<any> {
        this.clearBens(clearValue);
        return this.getBenDetails().then((data) => {
            if (data && data.length > 0) {
                this.benArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.benArray.push({
                    label: item.bendescription, value: item.benguid
                }));
                //this.toggleTab(LinkType[LinkType.BEN].toString(), true);
            }
            else {
                //this.toggleTab(LinkType[LinkType.BEN].toString(), false);
            }

        });

    }

    loadBanDropDown(clearValue: boolean = true): Promise<any> {
        this.clearBans(clearValue);
        return this.getBanDetails().then((data) => {
            if (data && data.length > 0) {
                this.banArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.banArray.push({
                    label: item.description, value: item.banguid
                }));
                this.toggleTab(LinkType[LinkType.BAN].toString(), true);
            }
            else {
                this.toggleTab(LinkType[LinkType.BAN].toString(), false);
            }
        });
    }

    getBenDetails() {
        return this.invoiceService.getBenList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
    }

    getBanDetails() {
        return this.invoiceService.getBanList(null, this.networkguid, this.billingplatformguid, this.fromdate, this.todate);
    }

    /* this method refresh the child tab grid data and graph according to selection of tab. i.e. link source.
       link source is active tab.
       */

    refreshData(tabevent: boolean = true) {
        //this.generateChart();
        if (this.iscomponentload && !this.islinksourcetabclickEnable) {
            this.LoadDataByLinkSource();
        }
        else {
            this.LoadDataByFleet();
        }

    }
    LoadDataByLinkSource() {
        this.linksourceguid = null;

        //var p1 = this.generateChart();

        //const p2 = () => {
        //    const promise = new Promise((resolve, reject) => {
        //        setTimeout(() => {
        //            this.loadManageFleetByLinkSource();
        //        }, 0);
        //    });
        //};
        //this.loader.emit(Promise.all([p1]).then(p2).then(x => {

        //}));

        var p1 = this.generateChart();
        var p2 = this.loadManageFleetByLinkSource();
        this.loader.emit(Promise.all([p1, p2]).then(x => {
        }));

    }

    LoadDataByFleet() {

        //var p1 = this.generateChart();        
        //const p2 = () => {
        //    const promise = new Promise((resolve, reject) => {
        //        setTimeout(() => {
        //            this.loadManageFleet();
        //            this.globalEvent.refreshCallClassFleet.emit({ refreshFleet: true });
        //        }, 0);
        //    });
        //};


        this.loader.emit(this.generateChart());
        var process2 = this.loadManageFleet();
        //var process3 =  this.globalEvent.refreshCallClassFleet.emit({ refreshFleet: true })       
        this.loader.emit(Promise.all([process2]).then(x => {
            this.globalEvent.refreshCallClassFleet.emit({ refreshFleet: true });
        }));
    }



    checkInvoiceAccess(): Promise<any> {
        return this.featureservice.getFeatureList('/invoice', true).then(res => {
            if (res.length > 0) {
                this.isInvoiceActive = true;
            }
            else {
                this.isInvoiceActive = false;
            }
        });

    }

    clearGridFilter() {
        this.benfilterset = [{ value: null, label: "" }];
        this.banfilterset = [{ value: null, label: "" }];
    }


    onChangeNetwork() {

        var p1 = this.loadBillingPlatformDropDown();
        var p2 = this.loadBenBanDropdown();
        var p3 = this.refreshData();
        Promise.all([p1, p2, p3]);
    }


    /**
     * Load the billing platforms for the selected network
     */
    loadBillingPlatforms(clearValue: boolean = true) {
        this.clearBillingPlatform(clearValue);
        if (this.networkguid != undefined && this.networkguid != null) {
            return this.networkService.getBillingPlatforms(UtilityMethod.IfNull(this.networkguid, ''), false, this.fromdate, this.todate, '');
        }
    }



    /**
     * If billing platforms exists for given network, load them, else load the months
     */
    loadBillingPlatformDropDown() {

        this.clearBillingPlatform();
        if (this.networkguid != undefined && this.networkguid != null) {
            this.loadBillingPlatforms().then((data) => {
                if (data) {
                    this.billingPlatformArray.push({ label: 'ALL', value: null });
                    data.forEach(item => this.billingPlatformArray.push({
                        label: item.billingplatformdescription, value: item.billingplatformguid
                    }));

                }
            });
        }
    }

    onChangeBillingPlatForm() {
        this.loadBenBanDropdown();
        this.refreshData();
    }

    //onChangeBenDetails() {
    //    this.refreshData();
    //}

    //onChangeBanDetails() {
    //    this.refreshData();
    //}

    /**
     * Clears the invoice months and selection
     */


    /**
     * Clears the networks dropdown and selecttion
     */

    onChangeReportingGroupEvent(reportinggroupsguidids: any) {

        if (reportinggroupsguidids != null) {
            this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
            this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
            this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
            this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
            this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
            this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

            this.refreshData();
        }
    }

    selectData(event: any) {

        event.originalEvent.stopImmediatePropagation();

        let rheader = event.element._model.label;
        this.navigateToTotalBillingByCallCategory(rheader);
    }

    navigateToTotalBillingByCallCategory(rheader: string) {
        this.router.navigate(['total-billing-analysis'], {
            queryParams: this.setQueryParams(undefined, rheader)
        });
    }
    setQueryParams(ccviewmodel?: CallClassReportViewModel, rheader?: string): any {
        let benGuid: string;
        let mn: string;
        let billGuid: string;
        let ndesc: string;
        let bendesc: any;
        let billdesc: string;
        let _banguid: string;
        let _bandesc: string;
        let cc: string;
        let dp: string
        let frommonth: string;
        let tomonth: string;


        if (ccviewmodel) {
            mn = ccviewmodel.mobilenumber;
            benGuid = this.benguid;
            bendesc = this.benArray && this.benArray.length > 0 ? this.benArray.filter(x => x.value == (this.benguid || null))[0].label : null;
            billGuid = this.billingplatformguid;
            billdesc = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].label : null;
            ndesc = this.networkArray.filter(x => x.value == (this.networkguid || null))[0].label;
            _banguid = this.ban;
            _bandesc = this.banArray && this.banArray.length > 0 ? this.banArray.filter(x => x.value == (this.ban || null))[0].label : null
            //benGuid = ccviewmodel.benguid;
            //bendesc = ccviewmodel.bendescription;
            //billGuid = ccviewmodel.billingplatformguid;
            //billdesc = ccviewmodel.billingplatformdescription;
            //ndesc = ccviewmodel.networkdescription;
            //_bandesc = ccviewmodel.ban;
            //_banguid = ccviewmodel.banguid;
        }
        else {
            benGuid = this.benguid;
            bendesc = this.benArray && this.benArray.length > 0 ? this.benArray.filter(x => x.value == (this.benguid || null))[0].label : null;
            billGuid = this.billingplatformguid;
            billdesc = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].label : null;
            ndesc = this.networkArray.filter(x => x.value == (this.networkguid || null))[0].label;
            _banguid = this.ban;
            _bandesc = this.banArray && this.banArray.length > 0 ? this.banArray.filter(x => x.value == (this.ban || null))[0].label : null
            //cc = this.costcentrelist && this.costcentrelist.length > 0 ? this.costcentrelist.filter(x => x.value == (this.costcentreguid || null))[0].label : null;
            //dp = this.departmentlist && this.departmentlist.length > 0 ? this.departmentlist.filter(x => x.value == (this.departmentguid || null))[0].label : null;
        }

        frommonth = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.fromdate || null))[0].label : null;
        tomonth = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.todate || null))[0].label : null;

        let params = {
            mn: mn,
            billingguid: billGuid,
            nid: this.networkguid,
            //ban: UtilityMethod.IfNull(_banguid, ''),
            ndesc: ndesc,
            billdesc: billdesc,
            rheader: rheader,
            bendesc: bendesc,
            benGuid: benGuid,
            banGuid: _banguid,
            bandesc: UtilityMethod.IfNull(_bandesc),
            fromdate: this.fromdate,
            todate: this.todate,
            frommonth: frommonth,
            tomonth: tomonth,
            //month: month,
            r1guid: this.reportinggroup1guid,
            r1desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1')[0].header : '',
            r2guid: this.reportinggroup2guid,
            r2desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2')[0].header : '',
            r3guid: this.reportinggroup3guid,
            r3desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3')[0].header : '',
            r4guid: this.reportinggroup4guid,
            r4desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4')[0].header : '',
            r5guid: this.reportinggroup5guid,
            r5desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5')[0].header : '',
            r6guid: this.reportinggroup6guid,
            r6desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6')[0].header : '',
            linktype: this.getLinkSource(),
            rtypeguid: this.getReportingGroupTypeGuid(),
            linksourceguid: this.linksourceguid
        }
        return params;
    }
    navigateToItemised(ccviewmodel?: any) {

        this.router.navigate(['total-billing-itemised'], {
            queryParams: this.setQueryParams(ccviewmodel)
        });
    }

    onInvoiceMonthChange() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromdate, this.todate);
        if (this.error) {
            this.callclassreportviewmodel = [];
        }
        else {
            let p1 = this.loadNetworkDropdown();
            let p2 = this.IsMPAYExist();
            let p3 = this.loadBenBanDropdown();
            let p4 = this.refreshData();
            this.csvfilename = "CallClassReort_" + this.invoicemonthArray.find(x => x.value == this.fromdate).label + "_" + this.invoicemonthArray.find(x => x.value == this.todate).label;
        }
    }


    GetVisibleTabs(): FeatureRoleRelHierarchicalViewModel[] {
        let visibletabs: FeatureRoleRelHierarchicalViewModel[];
        if (this.tabs) {
            visibletabs = this.tabs.filter(x => !x.data.isvisibleonly);
        }
        return visibletabs;
    }

    toggleTab(key: string, hide: boolean) {
        if (this.tabs && this.tabs.length > 0) {
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
    loadManageFleet() {
        let localLinkTypeGuid = null;
        if (this.componentRef) {
            localLinkTypeGuid = this.componentRef.instance["linksourceguid"];
            this.componentRef.destroy();
        }
        const factory = this.componentFactoryResolver.resolveComponentFactory(CallClassReportComponent);
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
        this.componentRef.instance["networkguid"] = this.networkguid;

        this.componentRef.instance["ndesc"] = this.networkArray.filter(x => x.value == (this.networkguid || null))[0].label;
        this.componentRef.instance["billingplatformguid"] = this.billingplatformguid;

        this.componentRef.instance["billdesc"] = this.billingPlatformArray && this.billingPlatformArray.length > 0 ? this.billingPlatformArray.filter(x => x.value == (this.billingplatformguid || null))[0].label : null;
        this.componentRef.instance["benguid"] = this.benguid;

        this.componentRef.instance["bendesc"] = this.benArray && this.benArray.length > 0 ? this.benArray.filter(x => x.value == (this.benguid || null))[0].label : null;
        this.componentRef.instance["ban"] = this.ban;

        this.componentRef.instance["_bandesc"] = this.banArray && this.banArray.length > 0 ? this.banArray.filter(x => x.value == (this.ban || null))[0].label : null
        this.componentRef.instance["isbandisplay"] = this.banArray != undefined ? this.banArray.length > 1 ? true : false : false;
        this.componentRef.instance["fromdate"] = this.fromdate;
        this.componentRef.instance["todate"] = this.todate;

        this.componentRef.instance["frommonth"] = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.fromdate || null))[0].label : null;
        this.componentRef.instance["tomonth"] = this.invoicemonthArray && this.invoicemonthArray.length > 0 ? this.invoicemonthArray.filter(x => x.value == (this.todate || null))[0].label : null;

        this.componentRef.instance["linktype"] = this.getLinkSource();
        this.componentRef.instance["rtypeguid"] = this.getReportingGroupTypeGuid();
        this.componentRef.instance["csvfilename"] = this.csvfilename;
        this.componentRef.instance["isbenexist"] = this.benArray != undefined ? this.benArray.length > 1 ? true : false : false;
        this.componentRef.instance["ismpayexist"] = this.ismpayexist;
        this.componentRef.instance["reportinggroup1guid"] = this.reportinggroup1guid;
        this.componentRef.instance["reportinggroup2guid"] = this.reportinggroup2guid;
        this.componentRef.instance["reportinggroup3guid"] = this.reportinggroup3guid;
        this.componentRef.instance["reportinggroup4guid"] = this.reportinggroup4guid;
        this.componentRef.instance["reportinggroup5guid"] = this.reportinggroup5guid;
        this.componentRef.instance["reportinggroup6guid"] = this.reportinggroup6guid;

        this.componentRef.instance["r1desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1')[0].header : '';
        this.componentRef.instance["r2desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2')[0].header : '';
        this.componentRef.instance["r3desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3')[0].header : '';
        this.componentRef.instance["r4desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4')[0].header : '';
        this.componentRef.instance["r5desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5')[0].header : '';
        this.componentRef.instance["r6desc"] = this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6')[0].header : '';
        this.componentRef.instance["istotalbillingcallcostvisible"] = this.istotalbillingcallcostvisible;
        if (linksource) {
            this.componentRef.instance["currenttabname"] = activetabname;
        }
        if (linksourceguid) {
            this.componentRef.instance["linksourceguid"] = linksourceguid;
        }
        this.componentRef.instance["rgModelArray"] = this.rgModelArray;

    }
    /* 
    Load the Link Source Component by selecting the tab i.e. Link Source (Department, ConsCentre, Netwok)
    */
    loadManageFleetByLinkSource() {
        if (this.activeTab) {
            if (this.componentRef && this.iscomponentload) {
                this.componentRef.destroy()
            }
            const factory = this.componentFactoryResolver.resolveComponentFactory(CallClassLinkSourceComponent);
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
        if (this.subscription && this.subscription.unsubscribe) {
            this.subscription.unsubscribe();
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
}