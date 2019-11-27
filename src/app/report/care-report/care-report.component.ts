import { Component, OnInit, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { Column } from 'src/app/_models/primeng-datatable';
import { CareViewModel } from 'src/app/_models/care/care';
import { SelectItem } from 'primengdevng8/api';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { GenericService } from 'src/app/_services/generic.service';
import { ModalPopupService } from 'src/app/_common/modelpopup.service';
import { CareService } from 'src/app/_services/care.service';
import { ReportingGroupDetailsProvider } from 'src/app/_common/reporting-group-details-provider';
import { UtilityMethod } from 'src/app/_common/utility-method';
import { CareReportDetailComponent } from './care-report-detail/care-report-detail.component';
var linq=require('linq');

@Component({
    selector: 'care-report',
    templateUrl: './care-report.component.html',
})
export class CareReportComponent implements OnInit {
    private loader: EventEmitter<any>;
    fromDate: Date;
    toDate: Date;
    maxDate: Date;
    datacolumns: Column[] = [];

    model: CareViewModel[];
    networkfilterset: SelectItem[];
    issuetypefilterset: SelectItem[];
    reporttypefilterset: SelectItem[];
    error: string;
    
    qNetworkFilter:any;
    qIssueTypeFilter:any;
    qReportTypeFilter:any;
    careissuetype: {name:string,count:number}[]=[];

    constructor(private globalEvent: GlobalEventsManager,
        private invoicereportservice: InvoiceReportService,
        private invoicedateservice: InvoiceDateService,
        private genericservice: GenericService,
        private modalpopupservice: ModalPopupService,
        private careservice: CareService) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        this.fromDate = firstDay;
        this.toDate = lastDay;
        this.invoicereportservice.getReportingGroupDetails(true).then(res => {
            res.forEach(x => x.description = x.description + 'description');
            this.datacolumns = ReportingGroupDetailsProvider.GetColumns(res);
        });
        this.genericservice.GetCareIssueTypeAsync().then(res => {
            this.careissuetype = res.map(x => {
                return {name:x,count:0};
            });
            this.loadData();
        });
        
        
    }

    loadData() {
        this.loader.emit(this.careservice.getCareLogReportAsync(UtilityMethod.formatDateExtended(this.fromDate), UtilityMethod.formatDateExtended(this.toDate)).then(data => {
            this.model = data;
            
            let groupByIssueType = linq.from(data)
                .groupBy("$.issuetypedescription", null,
                function (key: any, g: any) {
                    return {
                        "name": key,
                        "count": g.count(),
                    }
                })
                .toArray();
            
            this.careissuetype.forEach(x => {
                let obj = groupByIssueType.filter((y:any)=> y.name == x.name);
                if (obj && obj.length > 0) {
                    x.count = obj[0].count;
                }
                else {
                    x.count = 0;
                }
            });

            this.clearGridFilter();


            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });


            //Getting  IssueType  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.issuetypedescription === obj.issuetypedescription }) === index).map(q => {
                return { 'value': q.issuetypedescription, 'label': q.issuetypedescription };
            }).forEach(q => {
                if (this.issuetypefilterset.filter(n => n.value == q.value).length == 0) {
                    this.issuetypefilterset.push(q);
                }
                });

            //Getting  ReportType  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.reporttypedescription === obj.reporttypedescription }) === index).map(q => {
                return { 'value': q.reporttypedescription, 'label': q.reporttypedescription };
            }).forEach(q => {
                if (this.reporttypefilterset.filter(n => n.value == q.value).length == 0) {
                    this.reporttypefilterset.push(q);
                }
            });

        }));
    }

    onSelect() {
        this.error = this.invoicedateservice.validateInvoiceDateRange(this.fromDate, this.toDate);
    }

    handleRowSelect(event:any) {
        let data: CareViewModel = event.data;
        let params: any = { CareEnquiryID: data.id};
        this.openModalPopup(<any>CareReportDetailComponent,'Care Detail', params);
    }

    openModalPopup(comp: Component, title: string, params?: any) {
        this.modalpopupservice.displayViewInPopup(title, comp, params, "lg").result.then(res => {
        });
    }

    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.reporttypefilterset = [{ value: null, label: "" }];
        this.issuetypefilterset = [{ value: null, label: "" }];
    }
}