import { Component, Input, OnInit, EventEmitter, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { SelectItem } from 'primengdevng8/api';
import { AuthenticationService } from '../_services/authentication.service';
import { InvoiceReportService } from '../_services/invoice-report.service'
import { GenericService } from '../_services/generic.service';
import { BillingReport } from '../_models/billing-report';
import { DashboardService } from '../_services/dashboard.service';
import { ChartHelper, ChartType } from '../_models/chart';
//import { Globalize } from '../_common/globalizejs';
import { HighestSpendingCTNList } from '../_models/highestspendingctnlist';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { jsPdf, PDfConfig } from '../_common/pdf-export.component';
import { UserDetail } from '../_models/user-detail';
import { InvoiceService } from '../_services/invoice.service';
import { UtilityMethod } from '../_common/utility-method';
import { ReportingGroupType } from '../_services/enumtype';
import { FeatureService } from '../_services/feature.service';
import { AverageUsesModel, MostExpensiveViewModel, DataLimitExceedingMobilesViewModel } from '../_models/dashboardchart';
import { Router } from '@angular/router';
let $ = require('jquery');
import { Column } from '../_models/primeng-datatable';
import { ReportingGroupDetailsProvider } from '../_common/reporting-group-details-provider';
import { InvoiceDateService } from '../_services/invoicedate.service';
import { LocalStorageProvider } from '../_common/localstorageprovider';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    providers: [
        jsPdf
    ],
    styles:[        
        `.pBottom {
            margin-top: 0;
            margin-bottom: 1rem !important;
        }`,
        `.pBottom a {
            color: #0275d8;
            text-decoration: none;
        }`
    ]
})

export class DashboardComponent implements OnInit {

    private loader: EventEmitter<any>;

    activetabindex: number = 0;

    networkguid: string;
    billingplatformguid: string;
    benguid: string;
    banGuid: string;
    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;
    isShowPDF: boolean = false;
    networkdescription: string;
    billingplatformdescription: string;
    bandescription: string;
    bendescription: string;
    reportinggroup1description: string;
    reportinggroup2description: string;
    reportinggroup3description: string;
    reportinggroup4description: string;
    reportinggroup5description: string;
    reportinggroup6description: string;

    datacolumns: Column[] = [];


    billingReport: BillingReport[];
    blockedDocument: boolean = false;

    isInvoiceActive: boolean = false;

    /* Mobile Number */
    mobilenumberArray: SelectItem[];
    mobilenumber: string = "";

    sixMonthSpendAnalysisData: any;
    lastMonthSpendAnalysisData: any;
    lastMonthUsageData: any;
    currentMonthYear: string;
    highestSpendingCTNData: HighestSpendingCTNList[];
    sixMonthAverageSpendByTariffData: any;
    sixMonthUsageAnalysisData: any;
    lastMonthUsageUKData: any;
    lastMonthUsageInternationalData: any;
    lastMonthUsageRoamedData: any;


    highestMinuteUsers: HighestSpendingCTNList[];
    highestTextUsers: HighestSpendingCTNList[];
    highestDataUsers: HighestSpendingCTNList[];

    averageUsesModel: AverageUsesModel[];
    averageusesdatamodel: AverageUsesModel[];

    //used for export to pdf button attr to disable or change text
    disableexportbutton: boolean = true;
    exporttopdf: string;

    viewinvoicemonthlist: any[] = [{ value: "6", label: "6 Months" }, { value: "9", label: "9 Months" }, { value: "12", label: "12 Months" }];
    viewselectedinvoicemonth: string = "6";

    invoicemonthlist: any[];
    selectedinvoicemonth: string = "";

    mostExpensiveTransactionData: MostExpensiveViewModel;
    dataLimitExceedingMobilesViewModel: DataLimitExceedingMobilesViewModel;
    totaldatacost: number;
    totalroamedcost: number;

    /* Activity Data */
    sixMonthActivityData: any;
    activityConnection: any;
    activitychangerequest: any;
    activitydisconnection: any;
    activityunallocation: any;
    activitycare: any;
    showobservation: boolean;
    noInvoiceAvailable?: boolean;
    themeFontColor: string;
    constructor(private authenticationService: AuthenticationService
        , private invoiceReportService: InvoiceReportService
        , private genericService: GenericService
        , private dashboardService: DashboardService
        , private globalEvent: GlobalEventsManager
        , private elementref: ElementRef
        , private ref: ChangeDetectorRef
        , private zone: NgZone
        , private invoiceService: InvoiceService
        , private featureservice: FeatureService
        , private jspdf: jsPdf
        , private router: Router
        , private invoiceDateService: InvoiceDateService
        , private authService:AuthenticationService
    ) {

        this.loader = globalEvent.busySpinner;

    }


    ngOnInit() {
        this.loader.emit(this.loadInvoiceMonths());
    }

    /**
    * Load the avaialble upload months for given company, selected network and billingplatfrom
    */
    loadInvoiceMonths() {
        this.invoiceDateService.getInvoiceMonth().then((data) => {
            if (data.length > 0) {
                this.noInvoiceAvailable = false;
                this.loadData();
            }
            else {
                this.noInvoiceAvailable = true;
            }
        });
    }
    loadData() {
        let process1 = this.BindInvoiceMothDrodown();
        this.loader.emit(Promise.all([process1]).then(() => {

            let process2 = this.loadDashboardGrid();
            let process4 = this.BindInvoiceMothDrodown();
            let process3 = this.checkInvoiceAccess();
            let process5 = this.IsShowPDF();

            //this.loader.emit(Promise.all([process2, process4]).then(
            //  () => {
            let process6 = this.chartData();
            let process7 = this.ObservationData();
            let process8 = this.loadReportingGroups();
            this.loader.emit(Promise.all([process2, process3, process4, process5, process6, process7, process8]));
            //})
            //);
        }
        ));
    }

    refreshData() {

        let process1 = this.chartData();
        let process2 = this.loadDashboardGrid();
        let process3 = this.ObservationData();
        this.loader.emit(Promise.all([process1, process2, process3]));
    }

    onChangeReportingGroupEvent(reportinggroupsguidids: any) {

        if (reportinggroupsguidids != null) {
            this.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
            this.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
            this.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
            this.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
            this.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
            this.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;

            this.reportinggroup1description = reportinggroupsguidids.reportinggroup1description
            this.reportinggroup2description = reportinggroupsguidids.reportinggroup2description
            this.reportinggroup3description = reportinggroupsguidids.reportinggroup3description
            this.reportinggroup4description = reportinggroupsguidids.reportinggroup4description
            this.reportinggroup5description = reportinggroupsguidids.reportinggroup5description
            this.reportinggroup6description = reportinggroupsguidids.reportinggroup6description

            //this.loader.emit(this.loadDashboardGrid());

            let process2 = this.loadDashboardGrid();
            this.loader.emit(Promise.all([process2]).then
                (
                    () => {
                        let process5 = this.chartData();
                        let process7 = this.ObservationData();
                        this.loader.emit(Promise.all([process5, process7]));
                    }
                ));
        }
    }

    loadDashboardGrid(): Promise<any> {

        return this.invoiceReportService.GetBillingReportDetails(this.networkguid, this.billingplatformguid, this.benguid, UtilityMethod.IfNull(this.banGuid, '')
            , this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid
            , this.reportinggroup6guid, this.mobilenumber).then(res => {
                this.billingReport = res;
            });
    }

    checkInvoiceAccess(): Promise<any> {
        return this.featureservice.getFeatureList('/invoice', true).then(res => {
            if (res.length > 0) {
                this.isInvoiceActive = true;
            }
            else {
                this.isInvoiceActive = false;
                this.loader.emit(this.loadMobileNumber());
            }
        });
    }

    loadMobileNumber(): Promise<any> {
        this.clearMobileNumber();

        return this.invoiceReportService.GetMobileNumberByUserId().then((data) => {
            if (data != null) {
                this.mobilenumberArray.push({ label: 'ALL', value: null });
                data.forEach(item => this.mobilenumberArray.push({
                    label: item, value: item
                }));
            }
        });
    }

    clearMobileNumber() {
        this.mobilenumberArray = [];
        this.mobilenumber = "";
    }

    onMobileNumberChange() {
        this.refreshData();
    }

    onChangeNetworkEvent(network: any) {
        if (network != null) {
            this.networkguid = network.networkguid;
            this.networkdescription = network.networkdescription;
            this.billingplatformguid = null;
            this.refreshData();
        }
    }

    onChangeBillingPlatformEvent(billingPlatform: any) {
        if (billingPlatform != null) {
            this.billingplatformguid = billingPlatform.billingplatformguid;
            this.billingplatformdescription = billingPlatform.billingplatformdescription;
            this.refreshData();
        }
    }

    onChangeBanformEvent(ban: any) {
        if (ban != null) {
            this.banGuid = ban.banguid;
            this.bandescription = ban.description;
            this.refreshData();
        }
    }

    onChangeBenEvent(ben: any) {
        if (ben != null) {
            this.benguid = ben.benguid;
            this.bendescription = ben.bendescription;
            this.refreshData();
        }
    }

    chartLineOptions() {
        return ChartHelper.getChartOptions(ChartType.bar, true, true, true, 0, undefined, true, false, undefined, 16);
        //return ChartHelper.getChartOptions(ChartType.line, true, true, true, undefined, undefined, undefined, false, undefined, 16);        
    }


    //Create Chart Data from Model
    generateChartByTab(titleName: string): Promise<any> {
        this.hidePDfButton(true);
        return this.dashboardService.GetSpendUsageAnalysis(titleName, this.networkguid, this.billingplatformguid, this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid, this.benguid, UtilityMethod.IfNull(this.banGuid, ''), this.mobilenumber, this.viewselectedinvoicemonth, this.selectedinvoicemonth).then(data => {
            this.currentMonthYear = data.monthyeardescription;

            //if (titleName == "Spend") {
            this.highestSpendingCTNData = data.highestspendingctnlist;
            if (data.sixmonthspendanalysislinechartviewmodel != null) {
                data.sixmonthspendanalysislinechartviewmodel.linechartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.sixMonthSpendAnalysisData = {
                    labels: data.sixmonthspendanalysislinechartviewmodel.months,
                    datasets: data.sixmonthspendanalysislinechartviewmodel.linechartlist,
                    monthid: data.sixmonthspendanalysislinechartviewmodel.monthid
                };
            }
            else {
                this.sixMonthSpendAnalysisData = [];
            }
            if (data.sixmonthaveragespendbytarifflinechartviewmodel != null) {
                data.sixmonthaveragespendbytarifflinechartviewmodel.sixmonthaveragespendbytarifflinechartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));
                this.sixMonthAverageSpendByTariffData = {
                    labels: data.sixmonthaveragespendbytarifflinechartviewmodel.months,
                    datasets: data.sixmonthaveragespendbytarifflinechartviewmodel.sixmonthaveragespendbytarifflinechartlist
                };
            }
            else {
                this.sixMonthAverageSpendByTariffData = [];
            }
            if (data.lastmonthspendanalysispiechartviewmodel != null) {
                this.lastMonthSpendAnalysisData = {
                    labels: data.lastmonthspendanalysispiechartviewmodel.labels,
                    datasets: [{
                        data: data.lastmonthspendanalysispiechartviewmodel.lastmonthspendanalysispiechart.data,
                        backgroundColor: ChartHelper.graphColor,
                        borderColor: ChartHelper.graphColor
                    }
                    ]
                };
            }
            else {
                this.lastMonthSpendAnalysisData = [];
            }

            if (data.lastmonthusagepiechartviewmodel != null) {
                this.lastMonthUsageData = {
                    labels: data.lastmonthusagepiechartviewmodel.labels,
                    datasets: [{
                        data: data.lastmonthusagepiechartviewmodel.lastmonthusagepiechart.data,
                        backgroundColor: ChartHelper.graphColor,
                        borderColor: ChartHelper.graphColor
                    }
                    ]
                };
            }
            else {
                this.lastMonthUsageData = [];
            }

            //}
            //else if (titleName == "Usage") {
            this.averageUsesModel = data.averageusesmodel;
            this.averageusesdatamodel = data.averageusesdatamodel;
            this.highestMinuteUsers = data.highestminuteuserlist;
            this.highestTextUsers = data.highesttextuserlist;
            this.highestDataUsers = data.highestdatauserlist;
            if (data.sixmonthusageanalysisbarchartviewmodel != null) {
                data.sixmonthusageanalysisbarchartviewmodel.sixmonthusageanalysisbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));
                this.sixMonthUsageAnalysisData = {
                    labels: data.sixmonthusageanalysisbarchartviewmodel.months,
                    datasets: data.sixmonthusageanalysisbarchartviewmodel.sixmonthusageanalysisbarchartlist
                };
            }
            else {
                this.sixMonthUsageAnalysisData = [];
            }


            if (data.lastmonthusageukbarchartviewmodel != null) {
                data.lastmonthusageukbarchartviewmodel.lastmonthusageukbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageUKData = {
                    labels: data.lastmonthusageukbarchartviewmodel.labels,
                    datasets: data.lastmonthusageukbarchartviewmodel.lastmonthusageukbarchartlist
                };
            }
            else {
                this.lastMonthUsageUKData = [];
            }
            if (data.lastmonthusageinternationalbarchartviewmodel != null) {
                data.lastmonthusageinternationalbarchartviewmodel.lastmonthusageinternationalbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageInternationalData = {
                    labels: data.lastmonthusageinternationalbarchartviewmodel.labels,
                    datasets: data.lastmonthusageinternationalbarchartviewmodel.lastmonthusageinternationalbarchartlist
                };
            }
            else {
                this.lastMonthUsageInternationalData = [];
            }

            if (data.lastmonthusageroamedbarchartviewmodel != null) {
                data.lastmonthusageroamedbarchartviewmodel.lastmonthusageroamedbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageRoamedData = {
                    labels: data.lastmonthusageroamedbarchartviewmodel.labels,
                    datasets: data.lastmonthusageroamedbarchartviewmodel.lastmonthusageroamedbarchartlist
                };
            }
            else {
                this.lastMonthUsageRoamedData = [];
            }

            if (data.sixmonthactivitychartviewmodel != null) {
                data.sixmonthactivitychartviewmodel.linechartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));
                this.sixMonthActivityData = {
                    labels: data.sixmonthactivitychartviewmodel.months,
                    datasets: data.sixmonthactivitychartviewmodel.linechartlist
                };
            }
            else {
                this.sixMonthActivityData = [];
            }

            //if (data.sixmonthactivitychartviewmodel != null) {
            //    data.sixmonthactivitychartviewmodel.sixmonthspendanalysislinechartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

            //    this.sixMonthActivityData = {
            //        labels: data.sixmonthactivitychartviewmodel.months,
            //        datasets: data.sixmonthactivitychartviewmodel.sixmonthspendanalysislinechartlist,
            //        monthid: data.sixmonthactivitychartviewmodel.monthid
            //    };
            //}
            //else {
            //    this.sixMonthSpendAnalysisData = [];
            //}


            this.activitycare = data.activitycare;
            this.activitychangerequest = data.activitychangerequest;
            this.activityConnection = data.activityconnection;
            this.activitydisconnection = data.activitydisconnection;
            this.activityunallocation = data.activityunallocation;
            //}
            //else if (titleName == "Activity") {
            //}
            this.hidePDfButton(false);

        });

    }

    //get Chart Data
    chartData(): Promise<any> {
        let p1 = this.generateChartByTab('Spend');
        //let p2 = this.generateChartByTab('Usage');
        //let p3 = this.generateChartByTab('Activity');
        return p1;
    }

    chartPieOptions() {
        return ChartHelper.getChartOptions(ChartType.pie, true, true, true, undefined, undefined, undefined, false, undefined, 16);
    }

    chartBarOptions() {
        //return ChartHelper.getChartOptions(ChartType.bar, true, false, true, undefined, undefined, undefined, false, undefined, 16);
        return ChartHelper.getChartOptions(ChartType.bar, true, false, false, 0, undefined, true, false, this.handleClick, 16, false);
    }

    //chartBarOptions1() {
    //    return ChartHelper.getChartOptions(ChartType.bar, true, false, false, 0, undefined, true, false, null, 16, false);
    //}

    handleClick = function (evt: any, chartController: any) {
        var x_element = chartController.getElementsAtXAxis(evt);

        //if (x_element.length > 0 && evt.y > 230 && evt.x>=355) {
        if (x_element.length > 0 && (x_element[0]._view.y - evt.y) < 150) {
            // Get current Dataset
            var dataset = x_element[0]._datasetIndex;
            // Get current serie by dataset index
            var clickedElementindex = x_element[0]["_index"];
            //get specific label by index 
            var label = chartController.data.labels[clickedElementindex];
            //get value by index      
            //this.navigateToTotalBillingByCallCategory(label);
        }

    }.bind(this)
    selectData(event: any) {

        this.router.navigate(['invoice'], {
            queryParams: {
                fd: this.sixMonthSpendAnalysisData["monthid"][event.element._index]
            }
        });

    }


    /*start export to pdf */
    hidePDfButton(hide: boolean): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.disableexportbutton = hide;
            if (hide) {
                this.exporttopdf = "Processing Wait...";
            }
            else {
                this.exporttopdf = "Export To PDF";
            }
            resolve(true);
        });

    }

    //main method which we call on Export PDF button click event
    exportToPDF() {
        //hiding button on click
        this.hidePDfButton(true);
        this.blockedDocument = true;
        ChartHelper.ChartColor("#1d272e");
        setTimeout(() => {
            this.generateReport().then(r => {

                //enable button on complete
                this.hidePDfButton(false);
                this.blockedDocument = false;
                //ChartHelper.ChartColor("#ffffff");
                ChartHelper.ChartColor(this.themeFontColor);
            })
        }, 10);


        //let p2 = this.generateReport().then(r => {
        //    //enable button on complete 
        //    this.hidePDfButton(false);
        //    ChartHelper.ChartColor("#ffffff");
        //});
        //this.loader.emit(Promise.all([p1, p3]).then(x => { p2 }));

    }

    ////Start Export PDF

    generateReport(): Promise<boolean> {
        let p = new Promise<boolean>((resolve) => {

            let pdf_config: PDfConfig = {
                title: 'Dashboard',
                subject: 'Dashboard Report',
                author: 'CommsMannager',
                keywords: 'dashboard',
                creator: 'CommsManager',
                pageWidth: 297,
                pageHeight: 210,
                orientation: 'l',
            };

            //pdf configuration
            let pdf = this.jspdf.SetupPdf(pdf_config);

            //setting default values when ever user click on Export Button
            this.jspdf.resetXValue();
            this.jspdf.resetYValue();

            //printing header text e.g date stamp or title
            this.jspdf.headerText();

            //start: adding logo to pdf 
            let _x = this.jspdf.x;
            let _y = this.jspdf.y;

            let logowidth = 61;
            let logoheight = 22;

            this.jspdf.addCommsManagerLogo();


            let userDetail: UserDetail = this.authService.currentUserValue;
            //LocalStorageProvider.getUserStorage();
            let theme_fontColor = (userDetail && userDetail.usertheme) ? userDetail.usertheme.fontcolor : '#1d272e';
            this.jspdf.centerAlignText(userDetail.ClientInfo.filter(x => x.key == "ClientName")[0].value, 20, undefined, undefined, true, 14);

            this.themeFontColor = theme_fontColor;
            //getting filter text values from view selected by the user
            let i = 0;
            let ele = $('dashboard .form-inline .form-group').not('.pdf-exclude');

            if (ele) {
                for (let i = 0; i < ele.length; i++) {
                    let filterText = "";
                    let labels = $(ele[i]).find('label');
                    for (let l = 0; l < labels.length; l++) {
                        if (l > 0) {
                            filterText += ": ";
                        }
                        filterText += $(labels[l]).text();
                    }
                    // adding filter Text
                    this.jspdf.addTextToPdf(filterText, undefined, 8);
                }


            }

            this.jspdf.addTextToPdf('Requested By: ' + userDetail.name, undefined, 8);

            //adding line break
            this.jspdf.centerAlignText("", undefined, undefined, undefined, true);


            //declare grid json mapping , later we will use jspdf-autotable to print table 
            let billinreport_columns_mapping = [
                { title: "Billing Report Month", dataKey: "invoicemonthname" },
                { title: "Quantity of Mobiles", dataKey: "rowcount" },
                { title: "Quantity Change", dataKey: "quantitychange" }
            ];

            let highestspendingctndata_columns_mapping = [
                { title: "Employee Name", dataKey: "employeename" },
                { title: "Mobile Number", dataKey: "mobilenumber" },
                { title: "Total Cost", dataKey: "totalcost" }
            ];


            let highestminuteusers_columns_mapping = [
                { title: "Employee Name", dataKey: "employeename" },
                { title: "Mobile Number", dataKey: "mobilenumber" },
                { title: "Minutes", dataKey: "minutes" }
            ];


            let highesttextusers_columns_mapping = [
                { title: "Employee Name", dataKey: "employeename" },
                { title: "Mobile Number", dataKey: "mobilenumber" },
                { title: "Text", dataKey: "sms" }
            ];

            let highestdatausers_column_mapping = [{ title: "Employee Name", dataKey: "employeename" },
            { title: "Mobile Number", dataKey: "mobilenumber" },
            { title: "Data (MB)", dataKey: "data" }];



            let averageusage_column_mapping = [{ title: "Average", dataKey: "descripton" },
            { title: "Quantity", dataKey: "quantity" }];

            // activity tab
            let activity_connection_mapping = [{ title: "Connections", dataKey: "description" },
            { title: "Quantity", dataKey: "quantity" }];

            let activity_disconnection_mapping = [{ title: "Disconnections", dataKey: "description" },
            { title: "Quantity", dataKey: "quantity" }];

            let activity_care_mapping = [{ title: "Care Request", dataKey: "description" },
            { title: "Quantity", dataKey: "quantity" }];

            let activity_change_mapping = [{ title: "Change Request", dataKey: "description" },
            { title: "Quantity", dataKey: "quantity" }];

            let activity_unallocation_mapping = [{ title: "Unallocations", dataKey: "description" },
            { title: "Quantity", dataKey: "quantity" }];


            //adding grid from json to pdf
            this.json2pdf(billinreport_columns_mapping, this.billingReport);



            this.jspdf.addNewPage();



            //processing tab charts data
            this.chart2Pdf("Spend", theme_fontColor).then(res => {
                this.jspdf.addNewPage();
                //after processing chart one grid which is on spend tab we are adding to pdf
                this.json2pdf(highestspendingctndata_columns_mapping, this.highestSpendingCTNData, '#highestspending-report .title');

                let observation_container = document.getElementById("observation_container");
                if (observation_container) {
                    let title: string = observation_container.getElementsByClassName("title")[0].textContent;
                    this.jspdf.addTextToPdf(title.trim(), "bold");

                    let childele = observation_container.getElementsByTagName("span");
                    for (let i = 0; i < childele.length; i++) {
                        this.jspdf.addTextToPdf(childele[i].innerText);
                    }
                }

                //changing tab index -- workaround for Chart js rendering issue 
                let tabindex: number = this.activetabindex;
                if (this.activetabindex != 1) {
                    this.activetabindex = 1;
                }

                setTimeout(() => {
                    this.jspdf.addNewPage();
                    this.chart2Pdf("Usage", theme_fontColor).then(u => {

                        this.json2pdf(highestminuteusers_columns_mapping, this.highestMinuteUsers, '#highestspending-minute-report .title');

                        this.jspdf.addNewPage();

                        this.json2pdf(highesttextusers_columns_mapping, this.highestTextUsers, '#highestspending-text-report .title');

                        this.jspdf.addNewPage();

                        this.json2pdf(highestdatausers_column_mapping, this.highestDataUsers, '#highestspending-data-report .title');

                        this.json2pdf(averageusage_column_mapping, this.averageUsesModel, '#averageUsageByVoiceConnection-data-report .title');

                        this.json2pdf(averageusage_column_mapping, this.averageusesdatamodel, '#averageUsageByDataConnection-data-report .title');

                        this.jspdf.addNewPage();

                        if (this.activetabindex != 2) {
                            this.activetabindex = 2;

                        }

                        setTimeout(() => {
                            this.chart2Pdf("Activity", theme_fontColor).then(u => {

                                this.json2pdf(activity_connection_mapping, this.activityConnection, '#activity-connection-report .title');
                                this.json2pdf(activity_disconnection_mapping, this.activitydisconnection, '#activity-disconnection-report .title');
                                this.json2pdf(activity_care_mapping, this.activitycare, '#activity-care-report .title');
                                this.json2pdf(activity_change_mapping, this.activitychangerequest, '#activity-change-request-report .title');
                                this.json2pdf(activity_unallocation_mapping, this.activityunallocation, '#activity-unallocation-report .title');

                                this.activetabindex = tabindex;

                                this.jspdf.footerText();

                                this.jspdf.Save();

                                resolve(true);
                            });
                        }, 1000);

                    })
                }, 1000);
            });

        });
        return p;

    }

    json2pdf(columnMapping: any[], data: any[], titleselector: string = null) {
        if (data) {
            let pdf = this.jspdf.pdf;


            //replacing all null and undefined values with empty string 
            let pdfData: any[] = JSON.parse(JSON.stringify(data)) as any[];
            for (let i = 0; i < columnMapping.length; i++) {
                pdfData.forEach(x =>
                    x[columnMapping[i].dataKey] = (x[columnMapping[i].dataKey] == null || x[columnMapping[i].dataKey] == undefined ? "" : x[columnMapping[i].dataKey]));

            }
            this.jspdf.resetXValue();
            this.jspdf.pdfpageBreak((length * 10) + 7);

            if (titleselector) {
                let gridtitle = $(titleselector).text();
                this.jspdf.centerAlignText(gridtitle, 10, 'bold', 0, false, 7);
            }

            pdf.autoTable(columnMapping, pdfData, {
                theme: "grid",
                styles: {
                    //cellPadding: 1, valign: 'middle', fontSize: 10, lineWidth: 0.5, textColor: [255, 255, 255], overflow: 'linebreak', tableWidth: 'auto', columnWidth: 'auto', fillColor: false, lineColor: [0, 233, 211]
                    cellPadding: 1, valign: 'middle', fontSize: 10, lineWidth: 0.5, overflow: 'linebreak', tableWidth: 'auto', columnWidth: 'auto', lineColor: [33, 45, 52], textColor: [0, 0, 0]
                },
                headerStyles: {
                    //verticalcellpadding: 5, valign: 'middle', lineWidth: 0.5, textColor: [0, 233, 211], fillColor: false, lineColor: [0, 233, 211]
                    verticalcellpadding: 5, valign: 'middle', lineWidth: 0.5, fillColor: [83, 103, 115], lineColor: [33, 45, 52], textColor: [255, 255, 255]
                },
                bodyStyles: { verticalcellpadding: 5, cellPadding: 2 },
                margin: { left: this.jspdf.defaultXValue, right: this.jspdf.defaultXValue },
                startY: this.jspdf.y,
                pageBreak: 'avoid'
            });

            //get table draw end postion
            this.jspdf.y = pdf.autoTableEndPosY() + 10;
            //pdf.setTextColor(255, 255, 255);
        }
    }

    chart2Pdf(tabName: string, themefontColor: string): Promise<boolean> {
        let _pdf = this.jspdf.pdf;
        let _x = this.jspdf.resetXValue();
        let _y = this.jspdf.y;

        let p = new Promise<boolean>((resolve) => {
            _y = this.jspdf.centerAlignText(tabName, 12, 'bold', 0, true);

            let chart_container = $('p-tabpanel[header =' + tabName + ']').find('.chart-container');

            if (chart_container) {
                for (let i = 0; i < chart_container.length; i++) {
                    //get canvas
                    let smchart = $(chart_container[i]).attr("data-sm-chart");
                    let canvasList = $(chart_container[i]).find('canvas');

                    for (let c = 0; c < canvasList.length; c++) {

                        let type = $(canvasList[c]).closest('p-chart').attr('type');

                        let imagewidth = _pdf.internal.pageSize.width - 20;
                        let imageheight = 134;

                        // setting render start point
                        if (type == 'pie') {
                            imagewidth = 100;
                            imageheight = 100;
                            if (c == 0) {
                                _x = this.jspdf.defaultXValue;
                                //_x = (pdf.internal.pageSize.width / 2) - (imagewidth / 2);
                            }
                            else {
                                _x = _pdf.internal.pageSize.width - (imagewidth + this.jspdf.defaultXValue);
                            }
                        }
                        else if (smchart) {
                            imagewidth = 120;
                            imageheight = 70;
                            //first chart
                            if (c == 0) {
                                _x = this.jspdf.defaultXValue;
                            }
                            else if (c == 1) {
                                _x = _pdf.internal.pageSize.width - (imagewidth + this.jspdf.defaultXValue);
                            }
                            else if (c == canvasList.length - 1) {
                                _x = (_pdf.internal.pageSize.width / 2) - ((imagewidth + this.jspdf.defaultXValue) / 2);
                                this.jspdf.y = _y = _y + 10;
                            }
                        }
                        else {
                            _x = this.jspdf.defaultXValue;
                        }
                        _y = this.jspdf.pdfpageBreak(imageheight + this.jspdf.defaultYValue);
                        if (c == 0) {

                            //checking if page break is required or not
                            let title = $(chart_container[i]).find('.chart-title').text();
                            if (title) {
                                _y = this.jspdf.centerAlignText(title, 10, 'bold');
                            }
                        }

                        let graph = canvasList[c];
                        if (graph) {

                            let img = graph.toDataURL('image/png');

                            //pdf.setFillColor(33, 45, 52);
                            //pdf.setFillColor(59, 82, 96);
                            //if (themefontColor === '#ffffff' || themefontColor === 'white') {
                            //    _pdf.setFillColor(83, 103, 115);
                            //    this.jspdf.addRect(_x, _y, imagewidth, imageheight);
                            //}
                            //_pdf.setFillColor(83, 103, 115);

                            //_pdf.rect(_x, _y - 2, imagewidth + 2, imageheight + 2, "F");

                            _pdf.addImage(img, 'PNG', _x, _y, imagewidth, imageheight, null, "slow");
                            if ((c == (canvasList.length - 1)) || (smchart && canvasList.length > 2 && c == canvasList.length - 2) || (type != 'pie' && !smchart)) {
                                _y = _y + imageheight + 5;
                            }


                        }
                        //reset pdf component y axis 
                        this.jspdf.y = _y;
                    }


                    //imageStartX = imageStartX + imagewidth;
                }
            }
            resolve(true);
        });
        return p;
    }

    /*end export to pdf */

    //On Invoice Change 
    onViewInvoiceMonthChange() {

        let process1 = this.BindInvoiceMothDrodown();

        this.loader.emit(Promise.all([process1]).then(() => {
            this.loader.emit(this.chartData());
        }));
    }

    //On Invoice Change 
    onInvoiceMonthChange() {

        let process1 = this.lastmonthdatanalysis();
        let process2 = this.ObservationData();
        this.loader.emit(Promise.all([process1, process2]));  //FOR THE TIME BEING NO NEED TO PASS TITLE PARAMETER 

    }

    BindInvoiceMothDrodown(): Promise<any> {

        return this.dashboardService.GetInvoiceMonths(this.viewselectedinvoicemonth).then((data:any) => {
            if (data && data != null) {
                this.invoicemonthlist = [];
                data.forEach(item => this.invoicemonthlist.push({
                    label: item.invoicedatedescription, value: item.id, invoicedateguid: item.invoicedateguid
                }));

                if (this.invoicemonthlist.length > 0) {
                    this.selectedinvoicemonth = this.invoicemonthlist[0].value;
                }
            }
        });
    }


    //Last Month Data Analysis For Spend Tab
    lastmonthdatanalysis(): Promise<any> {

        return this.dashboardService.GetLastMonthDataAnalysis(this.networkguid, this.billingplatformguid, this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid, this.benguid, UtilityMethod.IfNull(this.banGuid, ''), this.mobilenumber, this.viewselectedinvoicemonth, this.selectedinvoicemonth).then(data => {

            this.currentMonthYear = data.monthyeardescription;

            //if (titleName == "Spend") {

            this.highestSpendingCTNData = data.highestspendingctnlist;

            if (data.lastmonthspendanalysispiechartviewmodel != null) {
                this.lastMonthSpendAnalysisData = {
                    labels: data.lastmonthspendanalysispiechartviewmodel.labels,
                    datasets: [{
                        data: data.lastmonthspendanalysispiechartviewmodel.lastmonthspendanalysispiechart.data,
                        backgroundColor: ChartHelper.graphColor,
                        borderColor: ChartHelper.graphColor
                    }
                    ]
                };
            }
            else {
                this.lastMonthSpendAnalysisData = [];
            }

            if (data.lastmonthusagepiechartviewmodel != null) {
                this.lastMonthUsageData = {
                    labels: data.lastmonthusagepiechartviewmodel.labels,
                    datasets: [{
                        data: data.lastmonthusagepiechartviewmodel.lastmonthusagepiechart.data,
                        backgroundColor: ChartHelper.graphColor,
                        borderColor: ChartHelper.graphColor
                    }
                    ]
                };
            }
            else {
                this.lastMonthUsageData = [];
            }
            //}     
            //else if (titleName == "Usage")
            //{
            this.averageUsesModel = data.averageusesmodel;
            this.averageusesdatamodel = data.averageusesdatamodel;
            this.highestMinuteUsers = data.highestminuteuserlist;
            this.highestTextUsers = data.highesttextuserlist;
            this.highestDataUsers = data.highestdatauserlist;

            if (data.lastmonthusageukbarchartviewmodel != null) {
                data.lastmonthusageukbarchartviewmodel.lastmonthusageukbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageUKData = {
                    labels: data.lastmonthusageukbarchartviewmodel.labels,
                    datasets: data.lastmonthusageukbarchartviewmodel.lastmonthusageukbarchartlist
                };
            }
            else {
                this.lastMonthUsageUKData = [];
            }
            if (data.lastmonthusageinternationalbarchartviewmodel != null) {
                data.lastmonthusageinternationalbarchartviewmodel.lastmonthusageinternationalbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageInternationalData = {
                    labels: data.lastmonthusageinternationalbarchartviewmodel.labels,
                    datasets: data.lastmonthusageinternationalbarchartviewmodel.lastmonthusageinternationalbarchartlist
                };
            }
            else {
                this.lastMonthUsageInternationalData = [];
            }

            if (data.lastmonthusageroamedbarchartviewmodel != null) {
                data.lastmonthusageroamedbarchartviewmodel.lastmonthusageroamedbarchartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));

                this.lastMonthUsageRoamedData = {
                    labels: data.lastmonthusageroamedbarchartviewmodel.labels,
                    datasets: data.lastmonthusageroamedbarchartviewmodel.lastmonthusageroamedbarchartlist
                };
            }
            else {
                this.lastMonthUsageRoamedData = [];
            }
            //if (data.sixmonthactivitychartviewmodel != null) {

            //    data.sixmonthactivitychartviewmodel.sixmonthspendanalysislinechartlist.forEach((item, i) => (item.backgroundColor = ChartHelper.graphColor[i]) && (item.borderColor = ChartHelper.graphColor[i]));
            //    this.sixMonthActivityData = {
            //        labels: data.sixmonthactivitychartviewmodel.months,
            //        datasets: data.sixmonthactivitychartviewmodel.sixmonthspendanalysislinechartlist
            //    };
            //}
            //else {

            //    this.sixMonthActivityData = [];
            //}
            this.activitycare = data.activitycare;
            this.activitychangerequest = data.activitychangerequest;
            this.activityConnection = data.activityconnection;
            this.activitydisconnection = data.activitydisconnection;
            this.activityunallocation = data.activityunallocation;

            //}
        });
    }

    ObservationData(): Promise<any> {
        return this.dashboardService.ObservationData(this.networkguid, this.billingplatformguid, this.reportinggroup1guid, this.reportinggroup2guid, this.reportinggroup3guid, this.reportinggroup4guid, this.reportinggroup5guid, this.reportinggroup6guid, this.benguid, UtilityMethod.IfNull(this.banGuid, ''), this.mobilenumber, this.selectedinvoicemonth).then(data => {
            this.dataLimitExceedingMobilesViewModel = data.datalimitexceedingmobilesviewmodel;
            this.totalroamedcost = data.totalroamedcost;
            this.totaldatacost = data.totaldatacost;
            this.mostExpensiveTransactionData = data.mostexpensiveviewmodel;
            this.showobservation = data.showobservation;
        });

    }

    observationViewDetailsClick(event: any) {

        var invoiceguid = this.invoicemonthlist[this.invoicemonthlist.map(function (i) { return i.value; }).indexOf(this.selectedinvoicemonth)].invoicedateguid;

        var dashboarddrilldowndescriptiondata = [];

        if (event != 'datathresholdexceeded') {

            dashboarddrilldowndescriptiondata.push({

                networkdescription: this.networkdescription == undefined ? "All" : this.networkdescription
                , billingplatformdescription: this.billingplatformdescription == undefined ? "All" : this.billingplatformdescription
                , bandescription: this.bandescription == undefined ? "All" : this.bandescription
                , bendescription: this.bendescription == undefined ? "All" : this.bendescription
                , reportinggroup1description: this.reportinggroup1description == undefined ? "All" : this.reportinggroup1description
                , reportinggroup2description: this.reportinggroup2description == undefined ? "All" : this.reportinggroup2description
                , reportinggroup3description: this.reportinggroup3description == undefined ? "All" : this.reportinggroup3description
                , reportinggroup4description: this.reportinggroup4description == undefined ? "All" : this.reportinggroup4description
                , reportinggroup5description: this.reportinggroup5description == undefined ? "All" : this.reportinggroup5description
                , reportinggroup6description: this.reportinggroup6description == undefined ? "All" : this.reportinggroup6description
                , r1desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup1')[0].header.toLowerCase() : ''
                , r2desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup2')[0].header.toLowerCase() : ''
                , r3desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup3')[0].header.toLowerCase() : ''
                , r4desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup4')[0].header.toLowerCase() : ''
                , r5desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup5')[0].header.toLowerCase() : ''
                , r6desc: this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6').length > 0 ? this.datacolumns.filter(x => x.field.toLowerCase() == 'reportinggroup6')[0].header.toLowerCase() : ''


            });

            LocalStorageProvider.setLabelStorage(LocalStorageProvider.dasbhboardstoragename, dashboarddrilldowndescriptiondata);

            this.router.navigate(['invoice-itemised-bill', invoiceguid, ""],
                {
                    queryParams:
                    {
                        ben: this.benguid
                        , ban: this.banGuid
                        , r1: this.reportinggroup1guid
                        , r2: this.reportinggroup2guid
                        , r3: this.reportinggroup3guid
                        , r4: this.reportinggroup4guid
                        , r5: this.reportinggroup5guid
                        , r6: this.reportinggroup6guid
                        , op: event
                        , n: this.networkguid
                        , bp: this.billingplatformguid
                    }
                });
        }
        else {
            this.router.navigate(['invoice'], {
                queryParams: {
                    fd: this.selectedinvoicemonth
                    , dd: 1
                    , nt: this.networkguid
                    , bp: this.billingplatformguid
                    , ben: this.benguid
                    , ban: this.banGuid
                    , r1: this.reportinggroup1description == undefined ? "" : (this.reportinggroup1description == "ALL" ? "" : this.reportinggroup1description)
                    , r2: this.reportinggroup2description == undefined ? "" : (this.reportinggroup2description == "ALL" ? "" : this.reportinggroup2description)
                    , r3: this.reportinggroup3description == undefined ? "" : (this.reportinggroup3description == "ALL" ? "" : this.reportinggroup3description)
                    , r4: this.reportinggroup4description == undefined ? "" : (this.reportinggroup4description == "ALL" ? "" : this.reportinggroup4description)
                    , r5: this.reportinggroup5description == undefined ? "" : (this.reportinggroup5description == "ALL" ? "" : this.reportinggroup5description)
                    , r6: this.reportinggroup6description == undefined ? "" : (this.reportinggroup6description == "ALL" ? "" : this.reportinggroup6description)
                }
            });
        }
    }


    loadReportingGroups(): Promise<any> {
        return this.invoiceReportService.getReportingGroupDetails(true).then((res) => {
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
    }

    IsShowPDF(): Promise<any> {
        return this.dashboardService.showPDF().then((data) => {
            this.isShowPDF = data;
        });
    }

    navigateToTotalBillingByCallCategory() {

    }


}


