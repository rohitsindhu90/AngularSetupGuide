import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

import { LinkType } from '../_services/enumtype';
import { DropdownModule } from 'primengdevng8/dropdown';
import { TabViewModule } from 'primengdevng8/tabview';
import { SelectItem, SortMeta } from 'primengdevng8/api';

import { ReportingGroup1Service } from '../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../_services/reportinggroup6.service';
import { InvoiceReportService } from '../_services/invoice-report.service';

import { ReportingGroupType, } from '../_services/enumtype';
import { ReportingGroupsGuid } from '../_models/reportinggroup1';
import { ReportingGroupViewModel } from '../_models/report/reportinggroupviewmodel';


@Component({
    selector: 'reportinggroup-dropdown',
    templateUrl: './reportinggroupdropdown.component.html'
})
export class ReportingGroupDDComponent implements OnInit {


    reportinggroup1Array: any[];
    @Input() reportinggroup1guid: string;
    reportinggroup1DisplayName: string;
    reportinggroup1Active: boolean;
    reportinggroup1Required: boolean;

    reportinggroup2Array: any[];
    @Input() reportinggroup2guid: string;
    reportinggroup2DisplayName: string;
    reportinggroup2Active: boolean;
    reportinggroup2Required: boolean;

    reportinggroup3Array: any[];
    @Input() reportinggroup3guid: string;
    reportinggroup3DisplayName: string;
    reportinggroup3Active: boolean;
    reportinggroup3Required: boolean;

    reportinggroup4Array: any[];
    @Input() reportinggroup4guid: string;
    reportinggroup4DisplayName: string;
    reportinggroup4Active: boolean;
    reportinggroup4Required: boolean;

    reportinggroup5Array: any[];
    @Input() reportinggroup5guid: string;
    reportinggroup5DisplayName: string;
    reportinggroup5Active: boolean;
    reportinggroup5Required: boolean;

    reportinggroup6Array: any[];
    @Input() reportinggroup6guid: string;
    reportinggroup6DisplayName: string;
    reportinggroup6Active: boolean;
    reportinggroup6Required: boolean;

    @Output() onChangeReportingGroupEvent: EventEmitter<any> = new EventEmitter<any>();

    @Input() disabledAll: boolean;
    @Input() placeholder: string;
    requiredByConfig: boolean;
    @Input() requiredByConfigValue: string;



    @Input() IsRequiredActiveOnly: boolean = true;
    @Input() rgModelArray: ReportingGroupViewModel[];

    //@Output()
    //sendMsgEvent = new EventEmitter<string>();
    //reportinggroupsguidids: ReportingGroupsGuid[];

    constructor(

        private reportinggroup1service: ReportingGroup1Service,
        private reportinggroup2service: ReportingGroup2Service,
        private reportinggroup3service: ReportingGroup3Service,
        private reportinggroup4service: ReportingGroup4Service,
        private reportinggroup5service: ReportingGroup5Service,
        private reportinggroup6service: ReportingGroup6Service,
        private invoicereportservice: InvoiceReportService) {


    }

    ngOnInit() {
        var process1 = this.loadReportingGroupList();
        // var process2 = this.loadFilterTypeDropDown();
        // var process3 = this.loadReportingGroupList();
        if (!this.placeholder) {
            this.placeholder = 'ALL';
        }
        this.requiredByConfig = !!this.requiredByConfigValue;

    }

    test() {
        return JSON.stringify(this.reportinggroup1Array);
    }

    loadReportingGroupList(): Promise<any> {
        if (this.rgModelArray) {
            this.setReportingGorup(this.rgModelArray);
        }
        else {
            return this.invoicereportservice.getReportingGroupDetails(true).then(res => {
                this.setReportingGorup(res);
            });
        }

    }

    private setReportingGorup(res: ReportingGroupViewModel[]) {
        var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
        if (reportinggroup1 != null) {
            this.reportinggroup1Active = reportinggroup1.active;
            this.reportinggroup1DisplayName = reportinggroup1.displayname;
            this.reportinggroup1Required = this.requiredByConfig && reportinggroup1.isrequired;
            this.loadReportingGroup1Dropdown();
        }
        var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
        if (reportinggroup2 != null) {
            this.reportinggroup2Active = reportinggroup2.active;
            this.reportinggroup2DisplayName = reportinggroup2.displayname;
            this.reportinggroup2Required = this.requiredByConfig && reportinggroup2.isrequired;
            this.loadReportingGroup2Dropdown();
        }
        var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
        if (reportinggroup3 != null) {
            this.reportinggroup3Active = reportinggroup3.active;
            this.reportinggroup3DisplayName = reportinggroup3.displayname;
            this.reportinggroup3Required = this.requiredByConfig && reportinggroup3.isrequired;
            this.loadReportingGroup3Dropdown();
        }
        var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
        if (reportinggroup4 != null) {
            this.reportinggroup4Active = reportinggroup4.active;
            this.reportinggroup4DisplayName = reportinggroup4.displayname;
            this.reportinggroup4Required = this.requiredByConfig && reportinggroup4.isrequired;
            this.loadReportingGroup4Dropdown();
        }
        var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
        if (reportinggroup5 != null) {
            this.reportinggroup5Active = reportinggroup5.active;
            this.reportinggroup5DisplayName = reportinggroup5.displayname;
            this.reportinggroup5Required = this.requiredByConfig && reportinggroup5.isrequired;
            this.loadReportingGroup5Dropdown();
        }
        var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
        if (reportinggroup6 != null) {
            this.reportinggroup6Active = reportinggroup6.active;
            this.reportinggroup6DisplayName = reportinggroup6.displayname;
            this.reportinggroup6Required = this.requiredByConfig && reportinggroup6.isrequired;
            this.loadReportingGroup6Dropdown();
        }
    }

    /**
      * Load the ReportingGroup1 array for the given company
      */
    loadReportingGroup1Dropdown() {
        this.clearReportingGroup1();
        if (this.reportinggroup1Active) {

            this.reportinggroup1service.getReportingGroup1List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup1Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup1Array.push({
                        label: item.reportinggroup1description, value: item.reportinggroup1guid, id: item.reportinggroup1id

                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup1 and selecttion
    */
    clearReportingGroup1() {
        this.reportinggroup1Array = [];
        //this.reportinggroup1guid = null;
    }


    /**
       * Load the ReportingGroup2 array for the given company
       */
    loadReportingGroup2Dropdown() {
        this.clearReportingGroup2();
        if (this.reportinggroup2Active) {

            this.reportinggroup2service.getReportingGroup2List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup2Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup2Array.push({
                        label: item.reportinggroup2description, value: item.reportinggroup2guid, id: item.reportinggroup2id
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup2 and selecttion
    */
    clearReportingGroup2() {
        this.reportinggroup2Array = [];
        //this.reportinggroup2guid = null;
    }

    /**
       * Load the ReportingGroup3 array for the given company
       */
    loadReportingGroup3Dropdown() {
        this.clearReportingGroup3();
        if (this.reportinggroup3Active) {

            this.reportinggroup3service.getReportingGroup3List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup3Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup3Array.push({
                        label: item.reportinggroup3description, value: item.reportinggroup3guid, id: item.reportinggroup3id
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup3 and selecttion
    */
    clearReportingGroup3() {
        this.reportinggroup3Array = [];
        //this.reportinggroup3guid = null;
    }

    /**
       * Load the ReportingGroup4 array for the given company
       */
    loadReportingGroup4Dropdown() {
        this.clearReportingGroup4();
        if (this.reportinggroup4Active) {

            this.reportinggroup4service.getReportingGroup4List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup4Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup4Array.push({
                        label: item.reportinggroup4description, value: item.reportinggroup4guid, id: item.reportinggroup4id
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup4 and selecttion
    */
    clearReportingGroup4() {
        this.reportinggroup4Array = [];
        //this.reportinggroup4guid = null;
    }

    /**
       * Load the ReportingGroup5 array for the given company
       */
    loadReportingGroup5Dropdown() {
        this.clearReportingGroup5();
        if (this.reportinggroup5Active) {

            this.reportinggroup5service.getReportingGroup5List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup5Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup5Array.push({
                        label: item.reportinggroup5description, value: item.reportinggroup5guid, id: item.reportinggroup5id
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup5 and selecttion
    */
    clearReportingGroup5() {
        this.reportinggroup5Array = [];
        //this.reportinggroup5guid = null;
    }

    /**
       * Load the ReportingGroup6 array for the given company
       */
    loadReportingGroup6Dropdown() {
        this.clearReportingGroup6();
        if (this.reportinggroup6Active) {

            this.reportinggroup6service.getReportingGroup6List(this.IsRequiredActiveOnly).then((data) => {
                if (data != null && data.length > 0) {
                    this.reportinggroup6Array.push({ label: this.placeholder, value: null });
                    data.forEach(item => this.reportinggroup6Array.push({
                        label: item.reportinggroup6description, value: item.reportinggroup6guid, id: item.reportinggroup6id
                    }));
                }
            });
        }
    }


    /**
    * Clears the  ReportingGroup6 and selecttion
    */
    clearReportingGroup6() {
        this.reportinggroup6Array = [];
        //this.reportinggroup6guid = null;
    }


    onChangeReportingGroup() {

        var reportinggroupsguidids: ReportingGroupsGuid = new ReportingGroupsGuid();
        //reportinggroupsguidids.reportinggroup1guid = this.reportinggroup1guid;
        //reportinggroupsguidids.reportinggroup2guid = this.reportinggroup2guid;
        //reportinggroupsguidids.reportinggroup3guid = this.reportinggroup3guid;
        //reportinggroupsguidids.reportinggroup4guid = this.reportinggroup4guid;
        //reportinggroupsguidids.reportinggroup5guid = this.reportinggroup5guid;
        //reportinggroupsguidids.reportinggroup6guid = this.reportinggroup6guid;

        reportinggroupsguidids.reportinggroup1guid = this.reportinggroup1guid != undefined ? this.reportinggroup1guid : null;
        reportinggroupsguidids.reportinggroup2guid = this.reportinggroup2guid != undefined ? this.reportinggroup2guid : null;
        reportinggroupsguidids.reportinggroup3guid = this.reportinggroup3guid != undefined ? this.reportinggroup3guid : null;
        reportinggroupsguidids.reportinggroup4guid = this.reportinggroup4guid != undefined ? this.reportinggroup4guid : null;
        reportinggroupsguidids.reportinggroup5guid = this.reportinggroup5guid != undefined ? this.reportinggroup5guid : null;
        reportinggroupsguidids.reportinggroup6guid = this.reportinggroup6guid != undefined ? this.reportinggroup6guid : null;



        reportinggroupsguidids.reportinggroup1description = this.reportinggroup1Array && this.reportinggroup1Array.length > 0 ? this.reportinggroup1Array.filter(x => x.value == (this.reportinggroup1guid || null))[0].label : null;
        reportinggroupsguidids.reportinggroup2description = this.reportinggroup2Array && this.reportinggroup2Array.length > 0 ? this.reportinggroup2Array.filter(x => x.value == (this.reportinggroup2guid || null))[0].label : null;
        reportinggroupsguidids.reportinggroup3description = this.reportinggroup3Array && this.reportinggroup3Array.length > 0 ? this.reportinggroup3Array.filter(x => x.value == (this.reportinggroup3guid || null))[0].label : null;
        reportinggroupsguidids.reportinggroup4description = this.reportinggroup4Array && this.reportinggroup4Array.length > 0 ? this.reportinggroup4Array.filter(x => x.value == (this.reportinggroup4guid || null))[0].label : null;
        reportinggroupsguidids.reportinggroup5description = this.reportinggroup5Array && this.reportinggroup5Array.length > 0 ? this.reportinggroup5Array.filter(x => x.value == (this.reportinggroup5guid || null))[0].label : null;
        reportinggroupsguidids.reportinggroup6description = this.reportinggroup6Array && this.reportinggroup6Array.length > 0 ? this.reportinggroup6Array.filter(x => x.value == (this.reportinggroup6guid || null))[0].label : null;


        reportinggroupsguidids.reportinggroup1id = this.reportinggroup1Array && this.reportinggroup1Array.length > 0 ? this.reportinggroup1Array.filter(x => x.value == (this.reportinggroup1guid || null))[0].id : null;
        reportinggroupsguidids.reportinggroup2id = this.reportinggroup2Array && this.reportinggroup2Array.length > 0 ? this.reportinggroup2Array.filter(x => x.value == (this.reportinggroup2guid || null))[0].id : null;
        reportinggroupsguidids.reportinggroup3id = this.reportinggroup3Array && this.reportinggroup3Array.length > 0 ? this.reportinggroup3Array.filter(x => x.value == (this.reportinggroup3guid || null))[0].id : null;
        reportinggroupsguidids.reportinggroup4id = this.reportinggroup4Array && this.reportinggroup4Array.length > 0 ? this.reportinggroup4Array.filter(x => x.value == (this.reportinggroup4guid || null))[0].id : null;
        reportinggroupsguidids.reportinggroup5id = this.reportinggroup5Array && this.reportinggroup5Array.length > 0 ? this.reportinggroup5Array.filter(x => x.value == (this.reportinggroup5guid || null))[0].id : null;
        reportinggroupsguidids.reportinggroup6id = this.reportinggroup6Array && this.reportinggroup6Array.length > 0 ? this.reportinggroup6Array.filter(x => x.value == (this.reportinggroup6guid || null))[0].id : null;


        this.onChangeReportingGroupEvent.emit(reportinggroupsguidids);

    }
}

