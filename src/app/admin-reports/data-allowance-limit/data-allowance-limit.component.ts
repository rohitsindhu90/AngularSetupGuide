import { Component, OnInit, EventEmitter } from '@angular/core'
import { OverUsageReportModel } from '../../_models/report/over-usage-report.model';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { OverUsageReportService } from '../../_services/overusagereport.service';
import { InvoiceDateService } from '../../_services/invoicedate.service';
import { NetworkService } from '../../_services/network.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { CompanyService } from '../../_services/company.service';
import { NgForm } from '@angular/forms';
import { CustomReuseStrategy } from '../../_common/custom-route-reuse-strategy';
import { SessionStroageProvider } from '../../_helper/session.storage.provider';


@Component({
    selector: 'data-allowance-limit',
    templateUrl: 'data-allowance-limit.component.html'
})


export class DataAllowanceLimitComponent implements OnInit {

    gridmodel: OverUsageReportModel[];
    csvfilename: string = "Data Allowance Limit";
    private loader: EventEmitter<any>;
    networkfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    companyArray: SelectItem[];
    companyid: any;
    networkArray: SelectItem[];
    networkid: any;
    billingplatformArray: SelectItem[];
    billingplatformid: string;
    IsbillingPlatformExist: boolean = false;
    datalimit?: number;
    monthname: string = '';
    invoicemonthArray: SelectItem[];    
    model: OverUsageReportModel = new OverUsageReportModel();
    selectedCompanyName: string = '';
    selectedNetworkName: string = '';
    selectedBillingplatformName: string = '';
    selectedMonthName: string = '';
    selectedDataAllowance: string = '';
    qFilter:any;
    billingFilter:any;
    constructor(
        private globalEvent: GlobalEventsManager, private overUsageReportService: OverUsageReportService, private invoiceDateService: InvoiceDateService, private networkService: NetworkService, private companyService: CompanyService, private confirmationservice: ConfirmationService) {
        this.loader = globalEvent.busySpinner;

    }

    ngOnInit(): void {

        var p2 = this.loadCompany();
        var p1 = this.loadGrid();
        this.loader.emit(Promise.all([p1, p2]));
    }


    loadMonth(): Promise<any> {
        this.invoicemonthArray = [];
        return this.invoiceDateService.getInvoiceDateList().then((data) => {

            if (data != null) {
                data.forEach(item => this.invoicemonthArray.push({
                    label: item,
                    value: item,
                }));
                if (this.selectedMonthName != '') {
                    this.monthname = this.selectedMonthName;
                }
                else {

                    this.monthname = this.invoicemonthArray[0].value;

                }

                //this.getDataLimit();
            }

        });
    }

    loadGrid(): Promise<any> {
        return this.overUsageReportService.getDataAccessLimitGridData().then((data) => {
            this.gridmodel = data;

            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.network === obj.network }) === index).map(q => {
                return { 'value': q.network, 'label': q.network };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });

            //Getting  billing platform  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatform === obj.billingplatform }) === index).map(q => {
                return { 'value': q.billingplatform, 'label': q.billingplatform };
            }).forEach(q => {
                this.billingplatformfilterset.push(q);
            });
        });
    }

    loadCompany(): Promise<any> {
        this.companyArray = [];
        return this.companyService.getCompanyList().then((data) => {

            this.companyArray.push({
                label: 'Select Company',
                value: '0'
            })

            if (data != null) {
                data.forEach(item => this.companyArray.push({
                    label: item.companydescription,
                    value: { id: item.companyid, dns: item.dnsname },
                }));
                this.companyid = this.companyArray[0].value;
            }

        });
    }

    /**
    * Populates the network dropdown
    */
    onCompanyChange(event: any) {

        SessionStroageProvider.setDNSSessionStorage(event.value.dns);

        if (this.companyid === '0')
            return;

        this.companyid = event.value;

        var p1 = this.loadMonth();
        this.loader.emit(Promise.all([p1]).then((data) => {
            this.loader.emit(Promise.all([this.loadNetwork()]).then((data) => { }))
        }));

        //this.loadNetwork();
        //this.loadMonth();
    }

    loadNetwork(): Promise<any> {
        this.networkArray = [];
        return this.networkService.getNetworkList().then((data) => {           
            data.forEach(item => this.networkArray.push({
                label: item.networkdescription
                , value: { id: item.id, guid: item.networkguid }
            }));

            this.networkid = this.networkArray[0].value;

            if (this.selectedNetworkName != '') {
                this.networkid = this.networkArray.find(x => x.label == this.selectedNetworkName).value;
                this.loadBillingPlatforms(this.networkid.guid);
            }
           else if(this.networkArray.length > 0) {
                this.loadBillingPlatforms(this.networkArray[0].value.guid);
            }           
        });
    }

    loadBillingPlatforms(networkguid: string) {   
        return this.networkService.getBillingPlatforms(networkguid, true).then((data) => {
            this.billingplatformArray = [];
            this.billingplatformid = '0';
            if (data != null) {
                if (data.length > 0) {                   
                    data.forEach(item => this.billingplatformArray.push({
                        label: item.billingplatformdescription, value: item.id
                    }));
                    if (this.selectedBillingplatformName != '') {
                        this.billingplatformid = this.billingplatformArray.find(x => x.label == this.selectedBillingplatformName).value;
                    }
                    else {
                        this.billingplatformid = this.billingplatformArray[0].value;
                    }                                     
                }
            }
            this.getDataLimit();
        });
    }


    onNetworkChange(event: any) {
       
        // load the list        
        this.loadBillingPlatforms(event.value.guid);
        var p1 = this.loadBillingPlatforms(event.value.guid);
        this.loader.emit(Promise.all([p1]).then(r => { this.getDataLimit() }));


    }

    onBillingplatformChange() {
        this.getDataLimit();
    }

    onInvoiceMonthChange() {
        this.getDataLimit();
    }

    getDataLimit(): Promise<any> {
        this.datalimit = null;
      
        return this.overUsageReportService.getCompanyDataAllowance(this.monthname, this.networkid.id, this.billingplatformid).then(result => {
            this.datalimit = result
           
        });
    }

    ngOnDestroy() {
        SessionStroageProvider.clearSessionStorage();
    }

    refreshControls() {
        this.companyid = '0';
        this.networkid = '';
        this.networkArray = [];
        this.billingplatformid = '';
        this.billingplatformArray = [];
        this.monthname = '';
        this.datalimit;        
    }


    updateData(form: NgForm) {

        
        this.model.networkid = this.networkid.id;
        this.model.billingplatformid = this.billingplatformid;
        this.model.monthname = this.monthname;
        this.model.dataallowance = this.datalimit;

        this.loader.emit(this.overUsageReportService.save(this.model).then(result => {
            if (result) {
                this.confirmationservice.confirm({
                    message: 'Saved Successfully',
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        form.resetForm();                        
                        //CustomReuseStrategy.clearCompSnapshot();
                        this.loadGrid();
                        this.refreshControls();
                    }
                });
            }
        }));
    }


    handleRowSelect(event: any) {
        this.selectedCompanyName = event.data["company"];
        this.selectedNetworkName = event.data["network"];
        this.selectedBillingplatformName = event.data["billingplatform"];
        this.selectedMonthName = event.data["monthname"];
        this.selectedDataAllowance = event.data["dataallowance"];

        this.companyid = this.companyArray.find(x => x.label == this.selectedCompanyName).value;
        this.onClick(this.companyid);

    }


    onClick(value: any) {

        SessionStroageProvider.setDNSSessionStorage(value.dns);

        var p1 = this.loadMonth();
        this.loader.emit(Promise.all([p1]).then((data) => {            
            this.loader.emit(Promise.all([this.loadNetwork()]).then((data) => { }))
        }));
    }




}


