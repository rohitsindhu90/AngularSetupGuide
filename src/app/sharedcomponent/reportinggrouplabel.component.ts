import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { DropdownModule } from 'primengdevng8/dropdown';
import { TabViewModule } from 'primengdevng8/tabview';
import { SelectItem, SortMeta } from 'primengdevng8/api';
import { LinkType } from '../_services/enumtype';


import { InvoiceReportService } from '../_services/invoice-report.service';

import { ReportingGroupType } from '../_services/enumtype';
import { ReportingGroupsGuid } from '../_models/reportinggroup1';


@Component({
    selector: 'reportinggroup-label',
    templateUrl: './reportinggrouplabel.component.html'
})
export class ReportingGroupLabelComponent implements OnInit {



    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;

    reportinggroup1description: string;
    reportinggroup2description: string;
    reportinggroup3description: string;
    reportinggroup4description: string;
    reportinggroup5description: string;
    reportinggroup6description: string;

    @Input() reportinggroupsdetail: ReportingGroupsGuid;



    constructor(
        private invoicereportservice: InvoiceReportService) {


    }

    ngOnInit() {
        var process1 = this.loadReportingGroupList();

    }


    loadReportingGroupList(): Promise<any> {
        
        return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

            var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
            if (reportinggroup1 != null) {
                this.reportinggroup1Active = reportinggroup1.active;
                this.reportinggroup1DisplayName = reportinggroup1.displayname;
                this.reportinggroup1description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup1description : null;
            }
            var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
            if (reportinggroup2 != null) {
                this.reportinggroup2Active = reportinggroup2.active;
                this.reportinggroup2DisplayName = reportinggroup2.displayname
                this.reportinggroup2description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup2description : null;
            }

            var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
            if (reportinggroup3 != null) {
                this.reportinggroup3Active = reportinggroup3.active;
                this.reportinggroup3DisplayName = reportinggroup3.displayname
                this.reportinggroup3description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup3description : null;
            }

            var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
            if (reportinggroup4 != null) {
                this.reportinggroup4Active = reportinggroup4.active;
                this.reportinggroup4DisplayName = reportinggroup4.displayname
                this.reportinggroup4description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup4description : null;
            }

            var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
            if (reportinggroup5 != null) {
                this.reportinggroup5Active = reportinggroup5.active;
                this.reportinggroup5DisplayName = reportinggroup5.displayname
                this.reportinggroup5description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup5description : null;
            }

            var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
            if (reportinggroup6 != null) {
                this.reportinggroup6Active = reportinggroup6.active;
                this.reportinggroup6DisplayName = reportinggroup6.displayname
                this.reportinggroup6description = this.reportinggroupsdetail != null ? this.reportinggroupsdetail.reportinggroup6description : null;

            }

        });

    }

}

