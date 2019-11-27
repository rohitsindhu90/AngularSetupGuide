import { Component, OnInit, EventEmitter } from '@angular/core';
import { NgForm, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { NetworkService } from "../_services/network.service";
import { GenericService } from "../_services/generic.service";
import { Tariff } from '../_models/tariff';
import { RegexExpression } from '../_common/regex-expression';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { TariffService } from '../_services/tariff.service';

@Component({
    //selector: 'top-usage-report',
    templateUrl: './tariff-maintenance.component.html'
})
export class TariffMaintenanceComponent implements OnInit {
    private loader: EventEmitter<any>;

    /* Networks */
    networkArray: SelectItem[];
    tariffArray: SelectItem[];
    /* Billing Platforms */
    billingPlatformArray: SelectItem[];
    /* Connection Type List */
    connectiontypeArray: SelectItem[];
    /* BAN List */
    statusArray: SelectItem[];

    addNewTariff: boolean = false;
    model: Tariff;
    csvfilename: string;
    tariffGrid: Tariff[];
    decimalregx: RegExp = RegexExpression.decimal;
    networkfilterset: any[] = [{ value: null, label: "" }];
    billingplatformfilterset: any[] = [{ value: null, label: "" }];
    connectiontypefilterset: any[] = [{ value: null, label: "" }];
    statusfilterset: any[] = [{ value: null, label: "" }];

    qNetworkFilter: any;
    qBillingPlatformFilter: any;
    qConnectionTypeFilter: any;
    qStatusFilter: any;
    constructor(//private authenticationService: AuthenticationService,
        private globalEvent: GlobalEventsManager,
        private tariffService: TariffService,
        private networkService: NetworkService,
        private router: Router,
        private genericService: GenericService,
        private confirmationservice: ConfirmationService
    ) {

        this.loader = globalEvent.busySpinner;
    }

    ngOnInit() {
        let process1 = this.loadTariffGrid();
        let process2 = this.loadNetworkDropdown();
        let process3 = this.loadConnectionTypeDropDown();
        let process4 = this.loadTariffDropdown();
        this.loader.emit(Promise.all([process1, process2, process3, process4]));

        this.loadStatusDropDown();

        this.model = new Tariff();
        let abc = 0;
        this.model.tariffcashback = "0.00";//+abc.toFixed(2);
        //+"0.00";

    }

    ngAfterViewInit() {
    }


    checkboxChange(form: NgForm) {

        form.resetForm({ addNewTariff: this.addNewTariff, active: this.model.status });
        this.model = new Tariff();
        this.model.tariffcashback = "0.00";
        if (this.addNewTariff) {
            this.model.status = true;

        }
        else {
            this.model.status = null;

        }


    }

    onChangeTariff(tariff: any) {
        let tariffGuid = this.model.tariffguid;
        //======If VTariff selected from Tariff Grid Row===
        if (tariff != null) {
            tariffGuid = tariff.data.tariffguid;
        }
        this.loader.emit(this.tariffService.GetTariffByTariffGuid(tariffGuid).then((data) => {
            this.model = data;
            this.loadBillingPlatformDropDown();
        }));

        this.addNewTariff = false;
    }

    /**
      * Load the Tariff array for the given company
      */
    loadTariffDropdown(): Promise<any> {
        this.clearTariffDropdown();
        return this.tariffService.BindTariffDropDown(null).then((data) => {
            if (data != null) {
                this.tariffArray.push({ label: 'Select', value: null });
                data.forEach(item => this.tariffArray.push({
                    label: item.tariffdescription, value: item.tariffguid
                }));
            }
        });
    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearTariffDropdown() {
        this.tariffArray = [];
        //this.networkguid = null;
    }

    /**
       * Load the network array for the given company
       */
    loadNetworkDropdown(): Promise<any> {
        this.clearNetworks();
        return this.networkService.getNetworkList(null, null, null).then((data) => {
            if (data != null) {
                this.networkArray.push({ label: 'Select', value: null });
                data.forEach(item => this.networkArray.push({
                    label: item.networkdescription, value: item.networkguid
                }));
            }
        });
    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearNetworks() {
        this.networkArray = [];
        //this.networkguid = null;
    }

    /**
   * Load the  grid and billing platforms for the given company and selected network
   */
    OnNetworkChange() {
        let process1 = this.loadBillingPlatformDropDown();
        this.loader.emit(Promise.all([process1]));

    }

    /**
     * Load the billing platforms for the given company and selected network
     */
    loadBillingPlatformDropDown(): Promise<any> {

        this.clearBillingPlatform();
        if (this.model.networkguid != undefined) {
            return this.networkService.getNetworkBillingPlatforms(this.model.networkguid, false).then((data) => {
                if (data && data != null) {
                    if (data.length > 1) {
                        this.billingPlatformArray.push({ label: 'Select', value: null });
                        data.forEach(item => this.billingPlatformArray.push({
                            label: item.billingplatformdescription, value: item.billingplatformguid
                        }));
                    }
                    else if (data.length == 1) {
                        this.model.billingplatformguid = data[0].billingplatformguid;
                    }

                }
            });
        }
    }

    /**
    * Clears the billing platform and selection
    */
    clearBillingPlatform() {
        this.billingPlatformArray = [];
        //this.billingplatformguid = null;
    }

    loadConnectionTypeDropDown(): Promise<any> {
        this.clearConnectionTypeDropDown();
        return this.genericService.GetConnectionTypeList(true).then((data) => {
            if (data != null) {
                this.connectiontypeArray.push({ label: 'Select', value: null });
                data.forEach(item => this.connectiontypeArray.push({
                    label: item.description, value: item.connectiontypeid
                }));
            }
        });
    }



    clearConnectionTypeDropDown() {
        this.connectiontypeArray = [];
        //this.networkguid = null;
    }


    loadStatusDropDown() {
        this.clearStatusDropDown();

        this.statusArray.push({ label: 'Select', value: null });
        this.statusArray.push({ label: 'Active', value: true });
        this.statusArray.push({ label: 'Obsolete', value: false });

    }


    /**
    * Clears the networks dropdown and selecttion
    */
    clearStatusDropDown() {
        this.statusArray = [];
        //this.networkguid = null;
    }


    saveTariff(form: NgForm) {

        this.loader.emit(this.tariffService.SaveTariff(this.model).subscribe((result: any) => {
            if (result) {
                this.confirmationservice.confirm({
                    message: result.message,
                    key: 'dialog',
                    rejectVisible: false,
                    accept: () => {
                        if (result.success) {
                            this.ngOnInit();
                            form.resetForm();
                        }
                    }
                });
            }
        }));

    }

    /**
* Load the Total Biiing Summary Data report for given company
*/
    loadTariffGrid() {

        return this.loader.emit(this.tariffService.getTariffList(null).then((data) => {
            this.tariffGrid = data;
            //console.table(data);
            this.csvfilename = "TariffMaintenance";

            //Getting  network  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.networkdescrption === obj.networkdescrption }) === index).map(q => {
                return { 'value': q.networkdescrption, 'label': q.networkdescrption };
            }).forEach(q => {
                if (this.networkfilterset.filter(n => n.value == q.value).length == 0) {
                    this.networkfilterset.push(q);
                }
            });

            //Getting  BillingPlatForm  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.billingplatformdescription === obj.billingplatformdescription }) === index).map(q => {
                return { 'value': q.billingplatformdescription, 'label': q.billingplatformdescription };
            }).forEach(q => {
                if (this.billingplatformfilterset.filter(n => n.value == q.value).length == 0) {
                    this.billingplatformfilterset.push(q);
                }
            });


            //Getting  connection  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.connectiontypedescription === obj.connectiontypedescription }) === index).map(q => {
                return { 'value': q.connectiontypedescription, 'label': q.connectiontypedescription };
            }).forEach(q => {
                if (this.connectiontypefilterset.filter(n => n.value == q.value).length == 0) {
                    this.connectiontypefilterset.push(q);
                }
            });

            //Getting  Status  list from grid data
            data.filter((obj, index, self) => self.findIndex((t) => { return t.statusdescrption === obj.statusdescrption }) === index).map(q => {
                return { 'value': q.statusdescrption, 'label': q.statusdescrption };
            }).forEach(q => {
                if (this.statusfilterset.filter(n => n.value == q.value).length == 0) {
                    this.statusfilterset.push(q);
                }
            });

        }));
    }

    disgnose() {
        return JSON.stringify(this.billingPlatformArray);
    }

}
