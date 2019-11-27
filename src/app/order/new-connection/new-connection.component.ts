
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceFilter } from '../../_models/order/DeviceFilter';
import { RefubrishedDeviceFilter } from '../../_models/order/RefubrishedDeviceFilter';
import { SelectItem, AutoCompleteHeaderColumnMeta, } from 'primengdevng8/api';
import { OrderService } from '../../_services/order/order.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { HardwareViewModel } from '../../_models/order/hardwareorderviewmodel';
import { RefubrishedQtyValidation } from '../../_models/order/refubqtyvalidation';
import { MobileFilter } from "../../_models/mobile-filter";
import { CTNDetailService } from '../../_services/ctndetail.service';
import { UserFilter } from '../../_models/user-filter';
import { UserService } from '../../_services/user.service';
import { NetworkService } from "../../_services/network.service";
import { NewConnectionModel, SelectItemCustom } from '../../_models/newconnectionmodel';
import { GenericService } from '../../_services/generic.service';
import { TariffService } from '../../_services/tariff.service';
import { UtilityMethod } from '../../_common/utility-method';
import { OrderType } from '../../_common/enumtype';
import { NewConnectionLineItemModel } from '../../_models/newconnectionlineitem';
import { RegexExpression } from '../../_common/regex-expression';
import { ModalPopupService } from '../../_common/modelpopup.service';
import { UserMaintenaceComponent } from '../../user/user-maintenance.component';

import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { ReportingGroupType, ReportingGroupRelationshipType } from '../../_services/enumtype';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { OrderConfirmViewModel } from '../../_models/order/orderconfirmviewmodel';
import { OrderStatus } from '../../_services/enumtype';
// import { setTimeout } from 'timers';

//import { Globalize } from '../../_common/globalizejs';
// import { DatePipe } from '@angular/common';
// import { DateTimeFormatPipe } from '../../_common/custom-ng-pipe';


@Component({
  selector: 'new-connections',
  templateUrl: 'new-connection.component.html',

})

export class NewConnectionComponent implements OnInit {
  @ViewChild('f', { static: false }) form: NgForm;

  saveError: string;
  loader: EventEmitter<any>;
  networkArray: SelectItem[];
  billingPlatformArray: SelectItem[];
  connectionTypeArray: SelectItem[];
  tariffArray: SelectItem[];
  orderTypeArray: SelectItem[];
  portTypeOrder: boolean = false;
  BANArray: SelectItem[];
  banguid: string;
  BENArray: SelectItem[];
  benguid: string;
  userFilterList: UserFilter[];
  userFilter: UserFilter = new UserFilter();
  userFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [
    { field: "name", header: 'Employee Name', width: '30%' },
    { field: 'staffid', header: 'StaffID', width: '30%' },
    { field: 'emailaddress', header: 'Email', width: '40%' }
  ];
  deviceFilterheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: 'device', header: 'Product', width: '40%' },
  { field: 'price', header: 'Price', width: '10%' },
  { field: 'producttype', header: 'Product Type', width: '50%' }];
  refubrishedDeviceFilterheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: 'device', header: 'Product', width: '40%' },
  { field: 'price', header: 'Price', width: '10%' },
  { field: 'producttype', header: 'Product Type', width: '40%' },
  { field: 'qty', header: 'Qty', width: '10%' }];
  deviceFilter: DeviceFilter[];
  refubrishedDeviceFilter: RefubrishedDeviceFilter[];
  newDeviceList: SelectItem[];
  refurbishedDeviceList: SelectItem[];
  qtyEnabled: boolean;
  model: NewConnectionModel;
  showRefubrished: boolean;
  mobilenumberregx: RegExp = RegexExpression.mobilenumber;
  pacnumberregex: RegExp = RegexExpression.PACNumber;
  simnumberregex: RegExp = RegexExpression.simnumber;
  vodageminibillingguid: string;
  refubQtyValidation: RefubrishedQtyValidation[];
  minDate: Date = new Date();
  rgplaceholder: string = 'SELECT';
  anyRefurbishedInvalid: boolean = false;

  reportinggroup1Array: SelectItemCustom[];
  reportinggroup1DisplayName: string;
  reportinggroup1Active: boolean;
  reportinggroup1Required: boolean;

  reportinggroup2Array: SelectItemCustom[];
  reportinggroup2DisplayName: string;
  reportinggroup2Active: boolean;
  reportinggroup2Required: boolean;


  reportinggroup3Array: SelectItemCustom[];
  reportinggroup3DisplayName: string;
  reportinggroup3Active: boolean;
  reportinggroup3Required: boolean;

  reportinggroup4Array: SelectItemCustom[];
  reportinggroup4DisplayName: string;
  reportinggroup4Active: boolean;
  reportinggroup4Required: boolean;

  reportinggroup5Array: SelectItemCustom[];
  reportinggroup5DisplayName: string;
  reportinggroup5Active: boolean;
  reportinggroup5Required: boolean;

  reportinggroup6Array: SelectItemCustom[];
  reportinggroup6DisplayName: string;
  reportinggroup6Active: boolean;
  reportinggroup6Required: boolean;
  orderguid: string;
  orderGuidExist: boolean = false;

  reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
  reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
  reportingGroupTypeEnum = ReportingGroupType;
  reportingGroupRelationshipType = ReportingGroupRelationshipType;
  yearRange: string = `${new Date().getFullYear()}:${3 + (new Date().getFullYear())}`;
  loading: boolean;

  models: OrderConfirmViewModel;
  orderStatusEnum = OrderStatus;
  freshConnection: boolean = false;

  constructor(private orderService: OrderService
    , private globalEvent: GlobalEventsManager, private ctnDetailService: CTNDetailService, private userService: UserService, private networkService: NetworkService, private genericService: GenericService, private router: Router,
    private tariffService: TariffService,
    private modalPopupService: ModalPopupService,
    private reportinggroup1service: ReportingGroup1Service,
    private reportinggroup2service: ReportingGroup2Service,
    private reportinggroup3service: ReportingGroup3Service,
    private reportinggroup4service: ReportingGroup4Service,
    private reportinggroup5service: ReportingGroup5Service,
    private reportinggroup6service: ReportingGroup6Service,
    private invoicereportservice: InvoiceReportService,
    private clientControlService: ClientControlService,
    private route: ActivatedRoute,
  ) {
    this.loader = globalEvent.busySpinner;
    this.minDate.setDate(this.minDate.getDate() + 2);
  }

  ngOnInit() {
    this.models = new OrderConfirmViewModel();
    this.loading = false;
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(params => {
        this.orderguid = params['orderguid'] || "";
        if (this.orderguid !== '') {
          this.loadOrderConfirm();
        }
        else {
          this.freshConnection = true;
        }
      });
    });


    let process1 = this.isShowRefubrished();
    let process2 = this.isShowQuantity();
    let process3 = this.isCascade();
    let process4 = this.getReportingGroupRelationList();
    this.loader.emit(Promise.all([process1, process2, process3, process4]).then(() => {
      this.initPage();
    }));

  }
  ngAfterViewChecked() {

  }

  loadOrderConfirm(): Promise<any> {
    return this.orderService.loadOrderConfirm(this.orderguid).then((data) => {
      if (data != null) {
        this.orderGuidExist = true;
        this.models = data;
        this.freshConnection = false;
      }
    });
  }

  initPage() {
    if (this.orderguid == "") {
      this.orderGuidExist = true;
      this.model = new NewConnectionModel();
      let lineItem = new NewConnectionLineItemModel();
      lineItem.quantity = 1;
      this.model.lineitems = [lineItem];
      this.model.simnumber = "89441";

    }
    else {
      this.orderGuidExist = true;
      this.model = new NewConnectionModel();
    }

    let process4 = this.loadReportingGroupList();
    let process1 = this.loadNetworkDropdown();

    this.loader.emit(Promise.all([process4]).then(() => {
      this.getnewconnectionorderbyguid();
    }));
  }
  getnewconnectionorderbyguid() {
    // else {
    this.loader.emit(this.orderService.getnewconnectionorderbyguid(this.orderguid).then((data) => {

      if (data != null) {
        this.orderGuidExist = true;
        let lineitems = JSON.parse(JSON.stringify(data.lineitems));
        this.model = data;
        this.model.lineitems = []
        for (var i = 0; i < lineitems.length; i++) {
          this.model.lineitems.push(lineitems[i]);
        }
        this.userFilter = this.model.userfilter;
        this.setRefubQtyValidation();

        this.onNetworkChange(true).then(a =>
          this.onBillingPlatformChange(true)
            .then(a => {

              this.onConnectionTypeChange(true);
            }));


        this.onTariffChange(true);

        this.portTypeOrder = this.model.ordertypeid == OrderType.Port;
      }
      else {
        this.orderGuidExist = false;

      }


      //==============
      if (this.reportingGroupCascade.IsCasCade) {
        this.loadReportingGroupIDsWhenGUIDExist();
      }


    }));

    // }

  }

  loadNetworkDropdown() {

    this.networkService.getAllActiveNetworkList().then((data) => {
      if (data && data.length > 0) {
        this.clearNetworks();
        this.networkArray.push({
          label: 'Select Network', value: null
        });
        data.forEach(item => this.networkArray.push({
          label: item.networkdescription, value: item.networkguid
        }));


        if (data.length == 1) {
          this.model.networkguid = this.networkArray[1].value;
          if (this.orderguid == "") {
            this.onNetworkChange(false);
          }
        }
        // else{
        //     this.model.networkguid = '';
        // }
      }
    });
  }

  clearNetworks() {
    this.networkArray = [];
    this.model.networkguid = null;
  }

  onNetworkChange(isPreserveValue?: boolean): Promise<any> {

    this.clearConnectionType(isPreserveValue);
    this.clearTariff(isPreserveValue);
    this.clearOrderTypes(isPreserveValue);
    this.clearbenarrary();
    this.clearbanArray();

    if (this.model.networkguid == null || this.model.networkguid == undefined || this.model.networkguid == "") {
      this.clearBillingPlatform(isPreserveValue);

      return null;
    }


    return this.loadBillingPlatform(isPreserveValue);


  }

  loadBillingPlatform(isPreserveValue: boolean): Promise<any> {
    this.clearBillingPlatform(isPreserveValue);
    return this.networkService.getNetworkBillingPlatforms(this.model.networkguid).then((data) => {

      if (data && data.length > 0) {

        //this.billingPlatformArray.push({
        //    label: 'Select Billing Platform', value: null
        //});
        if (data.length != 1) {
          this.billingPlatformArray.push({
            label: 'Select Billing Platform', value: null
          });
        }
        data.forEach(item => this.billingPlatformArray.push({
          label: item.billingplatformdescription, value: item.billingplatformguid
        }));
        let gemdata = data.filter(c => c.billingplatformdescription.toLowerCase() == 'gemini')[0];
        if (gemdata && gemdata.billingplatformguid) {
          this.vodageminibillingguid = gemdata.billingplatformguid;
        }
        if (data.length == 1) {
          this.model.billingplatformguid = data[0].billingplatformguid;
          this.clearbanArray();
          this.clearbenarrary();
          //this.loadConnectionType(isPreserveValue);
          this.clearTariff(isPreserveValue);
          if (!isPreserveValue) {
            this.onBillingPlatformChange(isPreserveValue);
          }

        }
      }
      else {
        this.clearbanArray();
        this.clearbenarrary();
        this.loadConnectionType(isPreserveValue);
        this.clearTariff(isPreserveValue);
      }
    });
  }

  clearBillingPlatform(isPreserveValue: boolean) {
    this.billingPlatformArray = [];
    if (!isPreserveValue) {
      this.model.billingplatformguid = null;
    }

  }

  onBillingPlatformChange(isPreserveValue?: boolean): Promise<any> {
    if (this.model.billingplatformguid != null || this.billingPlatformArray.length === 1) {
      if (this.model.billingplatformguid == this.vodageminibillingguid || (this.billingPlatformArray.length === 1 && this.billingPlatformArray.some(item => item.label.toLowerCase() == 'gemini'))) {
        this.loadbenData();
      }
      else {
        this.clearbenarrary();
      }
      this.loadBanArray();
      this.loadConnectionType(isPreserveValue);
      this.clearTariff(isPreserveValue);
      this.clearOrderTypes(isPreserveValue);
    }
    else {
      this.clearConnectionType(isPreserveValue);
      this.clearTariff(isPreserveValue);
      this.clearOrderTypes(isPreserveValue);
      this.clearbenarrary();
      this.clearbanArray();
    }
    return new Promise((resolve, reject) => { resolve(true); });
  }

  loadbenData() {
    this.clearbenarrary();
    return this.orderService.getBenForNewConnection().then((data) => {
      if (data && data.length) {
        this.BENArray.push({
          label: 'Select BEN', value: null
        });
        data.forEach(item => this.BENArray.push({
          label: item.bendescription, value: item.benguid
        }));


        if (data.length == 1) {
          this.model.benguid = this.BENArray[1].value;
        }
      }
    });
  }

  clearbenarrary() {
    this.BENArray = [];
    this.benguid = null;
  }

  loadConnectionType(isPreserveValue: boolean) {

    this.genericService.GetConnectionTypeList(true).then((data) => {
      this.clearConnectionType(isPreserveValue);
      if (data && data.length > 0) {
        this.connectionTypeArray.push({
          label: 'Select Connection Type', value: null
        });
        data.forEach(item => this.connectionTypeArray.push({
          label: item.description, value: item.connectiontypeid
        }));
      }
    });
  }

  clearConnectionType(isPreserveValue: boolean) {
    this.connectionTypeArray = [];
    if (!isPreserveValue) {
      this.model.connectiontypeid = null;
    }
  }

  onConnectionTypeChange(isPreserveValue?: boolean) {
    this.clearOrderTypes(isPreserveValue);
    if (this.model.connectiontypeid != null) {
      this.loadTariff(isPreserveValue);
    }
    else {
      this.clearTariff(isPreserveValue);
    }
  }

  loadTariff(isPreserveValue: boolean) {

    this.tariffService.getTariffListforNewConnection(this.model.networkguid, UtilityMethod.IfNull(this.model.billingplatformguid, ''), this.model.connectiontypeid, true).then((data) => {
      this.clearTariff(isPreserveValue);
      if (data && data.length > 0) {
        this.tariffArray.push({
          label: 'Select Tariff', value: null
        });
        data.forEach(item => this.tariffArray.push({
          label: item.tariffdescription, value: item.tariffguid
        }));
      }
    });
  }

  clearTariff(isPreserveValue: boolean) {
    this.tariffArray = [];
    if (!isPreserveValue) {
      this.model.tariffguid = null;
    }
  }

  loadOrderType(isPreserveValue: boolean) {

    this.orderService.getOrderTypes(this.model.networkguid, UtilityMethod.IfNull(this.model.billingplatformguid, ''), this.model.connectiontypeid, this.model.tariffguid).then((data) => {
      this.clearOrderTypes(isPreserveValue);
      if (data && data.length) {
        this.orderTypeArray.push({
          label: 'Select Order Type', value: null
        });
        data.forEach(item => this.orderTypeArray.push({
          label: item.description, value: item.id
        }));
      }
    });
  }

  clearOrderTypes(isPreserveValue: boolean) {
    this.orderTypeArray = [];
    if (!isPreserveValue) {
      this.model.ordertypeid = null;
    }

  }

  onOrderTypeChange() {
    this.portTypeOrder = this.model.ordertypeid == OrderType.Port;
    this.removeProductFromModel();
  }

  removeProductFromModel() {

    let lineItem = new NewConnectionLineItemModel();
    lineItem.quantity = 1;
    this.model.lineitems = [lineItem];
  }

  loadBanArray() {
    this.clearbanArray();
    this.orderService.getBanForNewConnection(this.model.networkguid, this.model.billingplatformguid).then((data) => {
      if (data && data.length) {
        this.BANArray.push({
          label: 'Select BAN', value: null
        });
        data.forEach(item => this.BANArray.push({
          label: item.description, value: item.banguid
        }));
      }
    });
  }

  clearbanArray() {
    this.BANArray = [];
    this.banguid = null;
  }

  completeMethodUserAccount(event: any) {
    let query: string;
    query = event.query
    this.userService.getUsersByFilter(query).then((data) => {
      this.userFilterList = data;
    });
  }

  onSelectUserAccount(event: any) {
    this.model.userguid = event.userguid;
    this.model.useremail = event.emailaddress;
  }

  onClearUserAccount(event: any) {
    this.model.userguid = null;
    this.model.useremail = null;
  }

  onTariffChange(isPreserveValue?: boolean) {
    if (this.model.tariffguid != null) {
      this.loadOrderType(isPreserveValue);
    }
    else {
      this.clearOrderTypes(isPreserveValue);
    }
  }

  completeMethodDevice(event: any, index: number) {

    let productIDs: number[];
    if (this.model.lineitems && this.model.lineitems.length > 1) {
      productIDs = this.model.lineitems.filter(a => a.productid > 0).map(a => a.productid);

      let currentProduct: NewConnectionLineItemModel = this.model.lineitems[index];
      if (currentProduct && currentProduct.productid) {
        productIDs = productIDs.filter((value, index) => {
          return value !== currentProduct.productid
        })
      }
    }

    this.orderService.loadProductListByConnectionType(event.query, this.model.connectiontypeid, this.model.tariffguid, this.model.ordertypeid, productIDs).then(data => {
      if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
        this.model.lineitems[index] = new NewConnectionLineItemModel();
      }
      this.model.lineitems[index].devicefilter = data;

    });
  }

  onSelectDevice(event: any, index: number) {

    if (event.orderproductdetailid != undefined) {
      if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
        this.model.lineitems[index] = new NewConnectionLineItemModel();
      }
      this.model.lineitems[index].productid = event.orderproductdetailid;
      this.model.lineitems[index].producttypeid = event.producttypeid;
      this.model.lineitems[index].quantity = 1;
      this.clearRefDevive(index);
      this.updateRefubValidationQty(event, index);
      this.validateRefubUI();

    }



  }

  clearModelDevice(event: any, index: number) {

    this.model.lineitems[index].productid = null;
    this.model.lineitems[index].producttypeid = null;
    this.model.lineitems[index].device = null;
  }

  isShowRefubrished() {
    return this.orderService.showRebrished().then((data) => {
      this.showRefubrished = data;
    });
  }

  isShowQuantity() {
    return this.orderService.showQuantity().then((data) => {
      this.qtyEnabled = data;
    });
  }

  isCascade() {
    return this.clientControlService.IsReportingGroupCascade().then((data) => {
      this.reportingGroupCascade = { IsCasCade: null, CascadeValue: null };
      this.reportingGroupCascade.IsCasCade = data.iscascade;
      this.reportingGroupCascade.CascadeValue = data.cascadevalue;
    });
  }

  isReportingGroupCascade(id: number): ReportingGroupRelMasterModel[] {
    return this.reportingGroupRelMasterArray.filter(x => x.childrportinggroupid == id);
  }

  getReportingGroupRelationList() {
    return this.genericService.GetReportingGroupRelationList().then((data) => {
      this.reportingGroupRelMasterArray = data;
    });
  }

  clearDevice(index: number) {

    if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
      this.model.lineitems[index] = new NewConnectionLineItemModel();
    }
    this.model.lineitems[index].productid = null;
    this.model.lineitems[index].producttypeid = null;
    this.model.lineitems[index].device = null;

  }

  clearRefDevive(index: number) {

    if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
      this.model.lineitems[index] = new NewConnectionLineItemModel();
    }
    this.model.lineitems[index].refurbisheddeviceid = null;
    this.model.lineitems[index].refurbisheddevicetypeid = null;
    this.model.lineitems[index].refurbisheddevice = null;
  }

  reCompleteMethodDevice(event: any, index: number) {
    this.orderService.getRefubrishedDeviceByFilter(event.query, this.model.connectiontypeid).then(data => {
      this.refubrishedDeviceFilter = data;
    });
  }

  onReSelectDevice(event: any, index: number) {

    if (event.productid != undefined) {
      if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
        this.model.lineitems[index] = new NewConnectionLineItemModel();
      }
      this.model.lineitems[index].refurbisheddeviceid = event.productid;
      this.model.lineitems[index].refurbisheddevicetypeid = event.producttypeid;
      this.model.lineitems[index].validationmaxquantity = event.qty;
      if (this.model.lineitems[index].quantity == 0 || this.model.lineitems[index].quantity > this.model.lineitems[index].validationmaxquantity)
        this.model.lineitems[index].quantity = 1;
      this.clearDevice(index);
      this.updateRefubValidationQty(event, index);
      this.validateRefubUI();

    }
  }

  updateRefubValidationQty(event: any, index: number, fromRemove: boolean = false) {
    if (fromRemove) {
      // check if already exists
      let item = this.refubQtyValidation.filter(k => {
        return k.productid == event.productid
      })[0];
      if (item && item.productid) {
        item.userQty = item.userQty - event.qty;
      }
    }
    else {

      this.setRefubQtyValidation();

    }
  }



  setRefubQtyValidation() {
    this.refubQtyValidation = [];
    this.model.lineitems.forEach(item => {
      if (item.refurbisheddeviceid) {
        let localItem = this.refubQtyValidation.filter(k => {
          return k.productid == item.refurbisheddeviceid.toString()
        })[0];
        if (localItem && localItem.productid) {
          localItem.userQty = localItem.userQty + Number(item.quantity);
        }
        else {
          let localItem = new RefubrishedQtyValidation();
          localItem.productid = item.refurbisheddeviceid.toString();
          localItem.totalQty = item.validationmaxquantity;
          localItem.userQty = item.quantity;
          this.refubQtyValidation.push(localItem);
        }
      }
    });
  }

  clearReModelDevice(event: any, index: number) {

    this.model.lineitems[index].refurbisheddeviceid = null;
    this.model.lineitems[index].refurbisheddevicetypeid = null;
    this.model.lineitems[index].validationmaxquantity = null;
    this.validateRefubUI();
  }

  onChangeReDevice(event: any, index: number) {
    if (this.model.lineitems[index] == null || this.model.lineitems[index] == undefined) {
      this.model.lineitems[index] = new NewConnectionLineItemModel();
    }
    this.model.lineitems[index].productid = null;
    this.model.lineitems[index].producttypeid = null;
  }

  click() {
    // check the count
    let count = this.model.lineitems.length;
    // for each of those, at least product or refubrished product must be selected
    let anyItemNotSelected = false;
    anyItemNotSelected = this.model.lineitems.some(item => {
      return ((item.productid == 0 && item.refurbisheddeviceid == 0) || (item.productid == null && item.refurbisheddeviceid == null) || (item.productid == undefined && item.refurbisheddeviceid == undefined));
    });
    if (!anyItemNotSelected) {
      let lineItem = new NewConnectionLineItemModel();
      lineItem.quantity = 1;
      this.model.lineitems.push(lineItem);
    }


  }

  save(form: NgForm) {

    if (this.model != null) {
      let refubInvalid = this.validateRefubQty();
      let validateModel = this.validateModel();
      if (!refubInvalid && validateModel) {
        if (this.model.requestedportdate) {
          let dtNumber: number = Date.parse(this.model.requestedportdate);
          if (!isNaN(dtNumber)) {
            let dtPort: Date = new Date(dtNumber);
            //this.model.requestedportdate = Globalize.dateFormatter(dtPort);
          }
        }
        this.loader.emit(this.orderService.saveNewConnection(this.model).then((data) => {
          if (!data.success) {
            this.saveError = data.message;
          }
          else {

            // get the guid, redirect
            let orderGuid = data.object;
            if (orderGuid) {
              this.router.navigate(['/order-confirmation'], { queryParams: { orderguid: orderGuid } });
            }
          }
        }));
      }
    }
  }

  validateRefubQty() {
    if (this.refubQtyValidation) {
      let items = this.refubQtyValidation.filter(item => item.productid);
      let valid = items.some(item => item.userQty > item.totalQty);
      this.validateRefubUI();
      return valid;
    }
    return false;
  }

  validateRefubUI() {
    // all items where qty > total
    let allInvalidItems = this.refubQtyValidation.filter(item => item.productid && item.userQty > item.totalQty);
    let allInvalidIds = allInvalidItems.map((v) => Number(v.productid));
    // find these items in line items
    let invalidLineItems = this.model.lineitems.filter(item => allInvalidIds.indexOf(item.refurbisheddeviceid) !== -1);
    let validItems = this.model.lineitems.filter(item => allInvalidIds.indexOf(item.refurbisheddeviceid) === -1);
    // mark all these as invalid
    invalidLineItems.forEach(item => item.refurbishedinvalid = true);
    validItems.forEach(item => item.refurbishedinvalid = false);
    this.anyRefurbishedInvalid = this.model.lineitems.some(item => item.refurbishedinvalid);
  }

  validateModel() {
    // this is the bug thingy,
    // return false, if 
    if (!this.model.tariffguid || !this.model.tariffguid || !this.model.ordertypeid)
      return false;
    return true;
  }

  addNewUser() {
    let params: any = { isComponentINPopUp: true, componentname: "Add New User", isAddnewuserDisabled: true, addnewuser: true };

    this.modalPopupService.displayViewInPopup("Add New User", <any>UserMaintenaceComponent, params, "lg").result.then(res => {
      if (res) {

        this.userFilter = new UserFilter();
        this.userFilter.staffid = res.staffid;
        this.userFilter.name = res.name;
        this.userFilter.userguid = res.userguid;
        let event = { userguid: res.userguid, emailaddress: res.emailaddress, staffid: res.staffid };
        this.onSelectUserAccount(event);

        this.completeMethodUserAccount({ query: res.staffid });
      };
    });
  }

  onChangeReportingGroupEvent(reportinggroupsguidids: any) {

    if (reportinggroupsguidids != null) {
      this.model.reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
      this.model.reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
      this.model.reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
      this.model.reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
      this.model.reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
      this.model.reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;
    }
  }

  onChangeSpinner(index: number, event: any) {
    let currentValue = this.model.lineitems[index].quantity;
    let inputValue = 1;
    if (event) {
      inputValue = event.target.value;
      if (inputValue < 1) {
        event.target.value = 1;
      }
    }
    else {
      inputValue = currentValue;
    }
    let refubId = this.model.lineitems[index].refurbisheddeviceid;
    if (refubId) {
      let maxQty = this.model.lineitems[index].validationmaxquantity;
      if (inputValue > maxQty) {
        //event.target.value = maxQty;
        this.model.lineitems[index].quantity = maxQty;
        this.loading = true;
        setTimeout(() => {
          document.getElementsByTagName('p-spinner')[index].getElementsByTagName('input')[0].value = maxQty.toString();
          this.loading = false;
        }, 800);

      }
      let allItems = this.model.lineitems.filter(item => item.refurbisheddeviceid == refubId);
      let totalQty = 0;
      allItems.forEach(item => totalQty += Number(item.quantity));
      let item = this.refubQtyValidation.filter(k => {
        return Number(k.productid) == refubId;
      })[0];
      if (item && item.productid) {
        item.userQty = totalQty;
      }
      this.validateRefubUI();
    }
  }

  clearAll(form: NgForm) {

  }

  loadReportingGroupList(): Promise<any> {


    return this.invoicereportservice.getReportingGroupDetails(true).then(res => {

      var reportinggroup1 = res.filter(a => a.id == ReportingGroupType.ReportingGroup1)[0];
      if (reportinggroup1 != null) {
        this.reportinggroup1Active = reportinggroup1.active;
        this.reportinggroup1DisplayName = reportinggroup1.displayname;
        this.reportinggroup1Required = reportinggroup1.isrequired;

        this.loadReportingGroup1Dropdown();
      }
      var reportinggroup2 = res.filter(a => a.id == ReportingGroupType.ReportingGroup2)[0];
      if (reportinggroup2 != null) {
        this.reportinggroup2Active = reportinggroup2.active;
        this.reportinggroup2DisplayName = reportinggroup2.displayname;
        this.reportinggroup2Required = reportinggroup2.isrequired;

        if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
          this.loadReportingGroup2Dropdown();
        }
      }

      var reportinggroup3 = res.filter(a => a.id == ReportingGroupType.ReportingGroup3)[0];
      if (reportinggroup3 != null) {
        this.reportinggroup3Active = reportinggroup3.active;
        this.reportinggroup3DisplayName = reportinggroup3.displayname
        this.reportinggroup3Required = reportinggroup3.isrequired;

        if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
          this.loadReportingGroup3Dropdown();
        }
      }

      var reportinggroup4 = res.filter(a => a.id == ReportingGroupType.ReportingGroup4)[0];
      if (reportinggroup4 != null) {
        this.reportinggroup4Active = reportinggroup4.active;
        this.reportinggroup4DisplayName = reportinggroup4.displayname
        this.reportinggroup4Required = reportinggroup4.isrequired;

        if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
          this.loadReportingGroup4Dropdown();
        }
      }

      var reportinggroup5 = res.filter(a => a.id == ReportingGroupType.ReportingGroup5)[0];
      if (reportinggroup5 != null) {
        this.reportinggroup5Active = reportinggroup5.active;
        this.reportinggroup5DisplayName = reportinggroup5.displayname
        this.reportinggroup5Required = reportinggroup5.isrequired;

        if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
          this.loadReportingGroup5Dropdown();
        }
      }

      var reportinggroup6 = res.filter(a => a.id == ReportingGroupType.ReportingGroup6)[0];
      if (reportinggroup6 != null) {
        this.reportinggroup6Active = reportinggroup6.active;
        this.reportinggroup6DisplayName = reportinggroup6.displayname
        this.reportinggroup6Required = reportinggroup6.isrequired;

        if (!this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
          this.loadReportingGroup6Dropdown();
        }

      }

    });

  }



  /**
    * Load the ReportingGroup1 array for the given company
    */
  loadReportingGroup1Dropdown() {
    this.clearReportingGroup1();
    if (this.reportinggroup1Active) {

      return this.reportinggroup1service.getReportingGroup1List(true).then((data) => {
        if (data != null) {
          this.reportinggroup1Array = [];
          this.reportinggroup1Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup1guid = null;
  }


  /**
     * Load the ReportingGroup2 array for the given company
     */
  loadReportingGroup2Dropdown() {
    this.clearReportingGroup2();
    if (this.reportinggroup2Active) {

      this.reportinggroup2service.getReportingGroup2List(true).then((data) => {
        if (data != null) {
          this.reportinggroup2Array = [];
          this.reportinggroup2Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup2guid = null;
  }

  /**
     * Load the ReportingGroup3 array for the given company
     */
  loadReportingGroup3Dropdown() {
    this.clearReportingGroup3();
    if (this.reportinggroup3Active) {

      this.reportinggroup3service.getReportingGroup3List(true).then((data) => {
        if (data != null) {
          this.reportinggroup3Array = [];
          this.reportinggroup3Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup3guid = null;
  }

  /**
     * Load the ReportingGroup4 array for the given company
     */
  loadReportingGroup4Dropdown() {
    this.clearReportingGroup4();
    if (this.reportinggroup4Active) {

      this.reportinggroup4service.getReportingGroup4List(true).then((data) => {
        if (data != null) {
          this.reportinggroup4Array = [];
          this.reportinggroup4Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup4guid = null;
  }

  /**
     * Load the ReportingGroup5 array for the given company
     */
  loadReportingGroup5Dropdown() {
    this.clearReportingGroup5();
    if (this.reportinggroup5Active) {

      this.reportinggroup5service.getReportingGroup5List(true).then((data) => {
        if (data != null) {
          this.reportinggroup5Array = [];
          this.reportinggroup5Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup5guid = null;
  }

  /**
     * Load the ReportingGroup6 array for the given company
     */
  loadReportingGroup6Dropdown() {
    this.clearReportingGroup6();
    if (this.reportinggroup6Active) {

      this.reportinggroup6service.getReportingGroup6List(true).then((data) => {
        if (data != null) {
          this.reportinggroup6Array = [];
          this.reportinggroup6Array.push({ label: '--Select--', value: null, id: null });
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
    this.model.reportinggroup6guid = null;
  }

  onChangeReportingGroup1(): Promise<any> {

    if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
      let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
      this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);

      if (selectedReportingGroup && selectedReportingGroup.id) {
        if (this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.id);
        }

        if (this.reportinggroup3Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.id);
        }

        if (this.reportinggroup4Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.id);
        }
        if (this.reportinggroup5Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.id);
        }
        if (this.reportinggroup6Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.id);
        }
      }

    }
    else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

      let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
      this.clearReportingGroupDropDownWhenDaisyChain(2);
      if (selectedReportingGroup.id && this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
        //this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1);
        //this.clearReportingGroupDropDownWhenDaisyChain(index, 2);
        return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.id);
      }
      else {
        return new Promise((resolve: any, reject: any) => { resolve(1); });
      }

    }

    return new Promise((resolve: any, reject: any) => { resolve(1); });

  }


  onChangeReportingGroup(reportingGroupType: number, childReportingGroupActive: boolean): Promise<any> {

    if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {
      let selectedReportingGroup: SelectItemCustom;
      if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
        selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.model.reportinggroup1guid)[0];
        this.clearReportingGroupDropDownWhenDaisyChain(2);
      }
      else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {
        selectedReportingGroup = this.reportinggroup2Array.filter(x => x.value == this.model.reportinggroup2guid)[0];
        this.clearReportingGroupDropDownWhenDaisyChain(3);
      }
      else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
        selectedReportingGroup = this.reportinggroup3Array.filter(x => x.value == this.model.reportinggroup3guid)[0];
        this.clearReportingGroupDropDownWhenDaisyChain(4);
      }

      else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
        selectedReportingGroup = this.reportinggroup4Array.filter(x => x.value == this.model.reportinggroup4guid)[0];
        this.clearReportingGroupDropDownWhenDaisyChain(5);
      }
      else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
        selectedReportingGroup = this.reportinggroup5Array.filter(x => x.value == this.model.reportinggroup5guid)[0];
        this.clearReportingGroupDropDownWhenDaisyChain(6);
      }
      //else if (reportingGroupType=== ReportingGroupType.ReportingGroup6) {
      //    selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == this.model.reportinggroup6guid)[0];
      //}



      let nextreportingGroupType = reportingGroupType + 1;
      if (selectedReportingGroup && selectedReportingGroup.id && childReportingGroupActive && this.isReportingGroupCascade(nextreportingGroupType).length) {
        //this.clearReportingGroupDropDownWhenCascade(reportingGroupType);
        return this.loadCascadeReportingGroupDropdown(nextreportingGroupType, selectedReportingGroup.id);
      }

      else {
        return new Promise((resolve: any, reject: any) => { resolve(1); });
      }

    }
    return new Promise((resolve: any, reject: any) => { resolve(1); });
  }

  loadCascadeReportingGroupDropdown(childRportingGroupId: number, parentReportingGroupRecordId: number): Promise<any> {

    return this.genericService.GetReportingGroupListByChildRportingGroupId(childRportingGroupId, parentReportingGroupRecordId, true).then((data) => {
      if (data != null) {

        if (childRportingGroupId === ReportingGroupType.ReportingGroup2) {

          this.reportinggroup2Array = [];
          this.reportinggroup2Array.push({ label: '--Select--', value: null, id: null });
          data.forEach(item => this.reportinggroup2Array.push({
            label: item.description, value: item.reportinggroupguid, id: item.id
          }));
        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup3) {
          this.reportinggroup3Array = [];
          this.reportinggroup3Array.push({ label: '--Select--', value: null, id: null });
          data.forEach(item => this.reportinggroup3Array.push({
            label: item.description, value: item.reportinggroupguid, id: item.id
          }));
        }

        else if (childRportingGroupId === ReportingGroupType.ReportingGroup4) {
          this.reportinggroup4Array = [];
          this.reportinggroup4Array.push({ label: '--Select--', value: null, id: null });
          data.forEach(item => this.reportinggroup4Array.push({
            label: item.description, value: item.reportinggroupguid, id: item.id
          }));
        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup5) {
          this.reportinggroup5Array = [];
          this.reportinggroup5Array.push({ label: '--Select--', value: null, id: null });
          data.forEach(item => this.reportinggroup5Array.push({
            label: item.description, value: item.reportinggroupguid, id: item.id
          }));
        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup6) {
          this.reportinggroup6Array = [];
          this.reportinggroup6Array.push({ label: '--Select--', value: null, id: null });
          data.forEach(item => this.reportinggroup6Array.push({
            label: item.description, value: item.reportinggroupguid, id: item.id
          }));
        }

      }
    });

  }

  removeClick(index: number) {
    // get the item
    let removedItem = this.model.lineitems[index].refurbisheddeviceid;
    if (removedItem) {
      let qty = this.model.lineitems[index].quantity;
      let event = { productid: removedItem, qty: qty };
      this.updateRefubValidationQty(event, index, true);
    }
    this.model.lineitems.splice(index, 1);
    this.validateRefubUI();
  }

  clearDeviceDropDowns() {

    let lineItem = new NewConnectionLineItemModel();
    lineItem.quantity = 1;
    this.model.lineitems = [lineItem];

  }
  clearReportingGroupDropDownWhenCascade(id: number) {

    let reportingGroups = this.reportingGroupRelMasterArray.filter(a => a.childrportinggroupid > id);
    if (this.reportinggroup2Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup2)) {
      this.clearReportingGroup2();
    }
    if (this.reportinggroup3Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup3)) {
      this.clearReportingGroup3();
    }

    if (this.reportinggroup4Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup4)) {
      this.clearReportingGroup4();
    }
    if (this.reportinggroup5Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup5)) {
      this.clearReportingGroup5();
    }
    if (this.reportinggroup6Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup6)) {
      this.clearReportingGroup6();
    }
  }

  loadReportingGroupIDsWhenGUIDExist() {
    let _reportinggroup1guid = this.model.reportinggroup1guid;
    let _reportinggroup2guid = this.model.reportinggroup2guid;
    let _reportinggroup3guid = this.model.reportinggroup3guid;
    let _reportinggroup4guid = this.model.reportinggroup4guid;
    let _reportinggroup5guid = this.model.reportinggroup5guid;
    let _reportinggroup6guid = this.model.reportinggroup6guid;

    this.onChangeReportingGroup1().then((res: any) => {

      this.model.reportinggroup1guid = _reportinggroup1guid;
      this.model.reportinggroup2guid = _reportinggroup2guid;
      if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

        this.onChangeReportingGroup(ReportingGroupType.ReportingGroup2, this.reportinggroup3Active).then(() => {
          this.model.reportinggroup3guid = _reportinggroup3guid;
          this.onChangeReportingGroup(ReportingGroupType.ReportingGroup3, this.reportinggroup4Active).then(() => {
            this.model.reportinggroup4guid = _reportinggroup4guid;
            this.onChangeReportingGroup(ReportingGroupType.ReportingGroup4, this.reportinggroup5Active).then(() => {
              this.model.reportinggroup5guid = _reportinggroup5guid;
              this.onChangeReportingGroup(ReportingGroupType.ReportingGroup5, this.reportinggroup6Active).then(() => {
                this.model.reportinggroup6guid = _reportinggroup6guid;
              });
            });;
          });;
        });
      }
      else {
        this.model.reportinggroup3guid = _reportinggroup3guid;
        this.model.reportinggroup4guid = _reportinggroup4guid;
        this.model.reportinggroup5guid = _reportinggroup5guid;
        this.model.reportinggroup6guid = _reportinggroup6guid;
      }

    });


  }

  clearReportingGroupDropDownWhenDaisyChain(start: number) {
    for (var i = start; i <= 6; i++) {
      this["reportinggroup" + i + "Array"] = [];
      this.model["reportinggroup" + i + "guid"] = null;
      this.model["reportinggroup" + i + "id"] = null;
    }

  }

  redirectToHome() {
    this.router.navigate(['home']);
  }

}
