import { Component, OnInit, EventEmitter } from '@angular/core';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem } from 'primengdevng8/api';
import { ReportingGroupViewModel } from 'src/app/_models/report/ReportingGroupViewModel';
import { DisConnectionReportModel } from 'src/app/_models/report/disconnectionreportmodel';
import { InvoiceDateService } from 'src/app/_services/invoicedate.service';
import { InvoiceReportService } from 'src/app/_services/invoice-report.service';
import { BENDetailService } from 'src/app/_services/bendetail.service';
import { UtilityMethod } from 'src/app/_common/utility-method';
@Component({
    templateUrl: './disconnection-report.component.html',
})
export class DisconnectionReportComponent implements OnInit {

    private loader: EventEmitter<any>;

    /* Invoice Months */
    invoicemonthArray: SelectItem[];
    fromDate: Date;
    toDate: Date;
    maxDate: Date;


    csvfilename: string;
    error: string;

    reportingList: ReportingGroupViewModel[];
    model: DisConnectionReportModel[];

    networkfilterset: any[] = [{ value: null, label: "" }];
    typefilterset: any[] = [{ value: null, label: "" }];
    benfilterset: any[] = [{ value: null, label: "" }];
    isbenexist: boolean;

    qTypeFilter:any;
    qNetworkFilter:any;
    qBenFilter:any;

    constructor(
        private globalEvent: GlobalEventsManager,
        private invoiceDateService: InvoiceDateService,
        private invoiceReportService: InvoiceReportService,
        private bendetailService: BENDetailService,
        //private genericService: GenericService,
        //private invoiceService: InvoiceService,
        //private networkService: NetworkService,
        //private benDetailService: BENDetailService,
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        this.fromDate = new Date();
        this.toDate = new Date();
        this.maxDate = new Date();
        this.fromDate.setDate(this.toDate.getDate() - 30);
        this.csvfilename = "DisconnectionReport";

        let process1 = this.loadRoamedReport();
        let process2 = this.loadReportingGroups();
        let process3 = this.isBENExist();

        this.loader.emit(Promise.all([process1, process2, process3]));
    }

    isBENExist(): Promise<any> {
        return this.bendetailService.IsBenExistForFleet().then(data => {
            this.isbenexist = data;
        });
    }

    loadReportingGroups(): Promise<any> {

        return this.invoiceReportService.getReportingGroupDetails().then((data) => {
            this.reportingList = data;
        });
    }

    refreshData() {
        this.loadRoamedReport();
    }

    loadRoamedReport() {
        
        this.loader.emit(this.invoiceReportService.GetDisConnectionReport(UtilityMethod.formatDateExtended(this.fromDate), UtilityMethod.formatDateExtended(this.toDate)).then((data) => {            

            this.clearGridFilter();
            this.model = data;

            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescription === obj.networkdescription }) === index).map(q => {
                return { 'value': q.networkdescription, 'label': q.networkdescription };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });


            this.typefilterset.push({ value: 'Termination', label: 'Termination' });
            this.typefilterset.push({ value: 'PACRequest', label: 'PACRequest' });

            if (this.isbenexist) {
                //Getting  ben  list from grid data
                data.filter((obj, index, self) => self.findIndex((t) => { return t.bendescription === obj.bendescription }) === index).map(q => {
                    return { 'value': q.bendescription, 'label': q.bendescription };
                }).forEach(q => {
                    if (this.benfilterset.filter(n => n.value == q.value).length == 0) {
                        this.benfilterset.push(q);
                    }
                });
            }



        }));
    }


    clearGridFilter() {
        this.networkfilterset = [{ value: null, label: "" }];
        this.typefilterset = [{ value: null, label: "" }];
        this.benfilterset = [{ value: null, label: "" }];
    }

    onSelect() {
        this.error = this.invoiceDateService.validateInvoiceDateRange(this.fromDate, this.toDate);
        //this.error = this.invoiceDateService.validateInvoiceDateRange(new Date(this.fromDate.toLocaleDateString('en-GB')), new Date(this.toDate.toLocaleDateString('en-GB')));
        if (this.error) {
            this.model = [];
        }
        else {
            this.refreshData();
        }

    }
}