import { Component, EventEmitter, OnInit, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceFilter } from '../../_models/order/DeviceFilter';
import { SelectItem, ConfirmationService, AutoCompleteHeaderColumnMeta } from 'primengdevng8/api';
import { OrderService } from '../../_services/order/order.service';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { HardwareViewModel } from '../../_models/order/hardwareorderviewmodel';
import { MobileFilter } from "../../_models/mobile-filter";
import { CTNDetailService } from '../../_services/ctndetail.service';
import { UserService } from '../../_services/user.service';
import { GenericService } from '../../_services/generic.service';
import { RefubrishedQtyValidation } from '../../_models/order/refubqtyvalidation';
import { InvoiceReportService } from '../../_services/invoice-report.service';
import { ReportingGroup1Service } from '../../_services/reportinggroup1.service';
import { ReportingGroup2Service } from '../../_services/reportinggroup2.service';
import { ReportingGroup3Service } from '../../_services/reportinggroup3.service';
import { ReportingGroup4Service } from '../../_services/reportinggroup4.service';
import { ReportingGroup5Service } from '../../_services/reportinggroup5.service';
import { ReportingGroup6Service } from '../../_services/reportinggroup6.service';
import { ReportingGroupType, ReportingGroupRelationshipType } from '../../_services/enumtype';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ReportingGroupRelMasterModel } from '../../_models/reportinggrouprelmaster.model';
import { OrderConfirmViewModel } from '../../_models/order/orderconfirmviewmodel';
import { OrderStatus } from '../../_services/enumtype';


@Component({
  selector: 'hardware-order',
  templateUrl: 'hardware.orders.component.html',
  styles: ['label.required::after {  content: "*"; color: red; padding :0em !important; padding-left: 1em;}', '.checkboxMargin  { margin-top: -9px !important;}']
})

export class HardwareOrdersComponent implements OnInit {
  private loader: EventEmitter<any>;
  errormsg: string = "";
  model: OrderConfirmViewModel;
  orderStatusEnum = OrderStatus;
  freshHardwareOrder: boolean = false;

  isRefurbishedProductActive: boolean = false;
  isReplacementDeviceActive: boolean = false;
  isQuantityActive: boolean = false;
  anyRefurbishedInvalid: boolean = false;

  deviceFilterheadermeta: AutoCompleteHeaderColumnMeta[] = [
    { field: 'device', header: 'Product', width: '40%' },
    { field: 'price', header: 'Price', width: '10%' },
    { field: 'producttype', header: 'Product Type', width: '50%' }
  ];

  refubrishedDeviceFilterheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: 'device', header: 'Product', width: '40%' },
  { field: 'price', header: 'Price', width: '10%' },
  { field: 'producttype', header: 'Product Type', width: '40%' },
  { field: 'qty', header: 'Qty', width: '10%' }];

  replacementdevicelist: any[] = [{ value: null, label: "Select" }, { value: true, label: "Yes" }, { value: false, label: "No" }];

  mobileFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [
    { field: "mobilenumber", header: 'Mobile Number' },
    { field: 'staffname', header: 'Staff Name' },
    { field: 'status', header: 'Status' }
  ];

  userFilterHeaderMeta: AutoCompleteHeaderColumnMeta[] = [
    { field: "name", header: 'Employee Name', width: '30%' },
    { field: 'username', header: 'User Name', width: '30%' },
    { field: 'emailaddress', header: 'Email', width: '40%' }
  ];

  models: HardwareViewModel[];//= [new HardwareViewModel()];
  refubQtyValidation: RefubrishedQtyValidation[];

  reportinggroup1Array: any[];
  reportinggroup1DisplayName: string;
  reportinggroup1Active: boolean;

  reportinggroup2Array: any[];
  reportinggroup2DisplayName: string;
  reportinggroup2Active: boolean;

  reportinggroup3Array: any[];
  reportinggroup3DisplayName: string;
  reportinggroup3Active: boolean;

  reportinggroup4Array: any[];
  reportinggroup4DisplayName: string;
  reportinggroup4Active: boolean;

  reportinggroup5Array: any[];
  reportinggroup5DisplayName: string;
  reportinggroup5Active: boolean;

  reportinggroup6Array: any[];
  reportinggroup6DisplayName: string;
  reportinggroup6Active: boolean;

  reportinggroup1Required: boolean;
  reportinggroup2Required: boolean;
  reportinggroup3Required: boolean;
  reportinggroup4Required: boolean;
  reportinggroup5Required: boolean;
  reportinggroup6Required: boolean;
  placeholder: string = "Select";
  orderguid: string;
  orderGuidExist: boolean = false;


  reportingGroupCascade: { IsCasCade: boolean, CascadeValue: number };
  reportingGroupRelMasterArray: ReportingGroupRelMasterModel[];
  reportingGroupTypeEnum = ReportingGroupType;
  reportingGroupRelationshipType = ReportingGroupRelationshipType;

  constructor(private orderService: OrderService
    , private globalEvent: GlobalEventsManager
    , private ctnDetailService: CTNDetailService
    , private userService: UserService
    , private genericService: GenericService
    , private invoicereportservice: InvoiceReportService
    , private reportinggroup1service: ReportingGroup1Service,
    private reportinggroup2service: ReportingGroup2Service,
    private reportinggroup3service: ReportingGroup3Service,
    private reportinggroup4service: ReportingGroup4Service,
    private reportinggroup5service: ReportingGroup5Service,
    private reportinggroup6service: ReportingGroup6Service,
    private route: ActivatedRoute,
    private clientControlService: ClientControlService,
    private router: Router) {
    this.loader = globalEvent.busySpinner;
  }

  ngOnInit() {
    this.model = new OrderConfirmViewModel();
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(params => {
        this.orderguid = params['orderguid'] || "";
        if (this.orderguid !== '') {
          this.loadOrderConfirm();
        }
        else {
          this.freshHardwareOrder = true;
        }
      });
    });

    this.getReportingGroupRelationList();
    this.isCascade().then(() => {
      let p1 = this.checkRefurbishedProductActive();
      let p2 = this.checkReplacementDeviceActive();
      let p3 = this.checkShowQuantity();
      let p4 = this.loadReportingGroupList();
      this.loader.emit(Promise.all([p1, p2, p3, p4]).then(() => {

      }));
    });

    // this.loader.emit(
    setTimeout(() => { this.gethardwareorderbyguid(); }, 4500);
    // );
  }

  ngAfterViewChecked() {
  }

  loadOrderConfirm(): Promise<any> {
    return this.orderService.loadOrderConfirm(this.orderguid).then((data) => {
      if (data != null) {
        this.orderGuidExist = true;
        this.model = data;
        this.freshHardwareOrder = false;
      }
    });
  }

  gethardwareorderbyguid() {

    if (this.orderguid == "") {

      let hardwareViewModel = new HardwareViewModel();
      //if (this.reportinggroup1Array) {
      //    hardwareViewModel.reportinggroup1Array = this.reportinggroup1Array.slice();
      //}
      //if (this.reportinggroup2Array) {
      //    hardwareViewModel.reportinggroup2Array = this.reportinggroup2Array.slice();
      //}
      //if (this.reportinggroup3Array) {
      //    hardwareViewModel.reportinggroup3Array = this.reportinggroup3Array.slice();
      //}
      //if (this.reportinggroup4Array) {
      //    hardwareViewModel.reportinggroup4Array = this.reportinggroup4Array.slice();
      //}
      //if (this.reportinggroup5Array) {
      //    hardwareViewModel.reportinggroup5Array = this.reportinggroup5Array.slice();
      //}
      //if (this.reportinggroup6Array) {
      //    hardwareViewModel.reportinggroup6Array = this.reportinggroup6Array.slice();
      //}
      this.loadReportingGroupsArrayInModel(hardwareViewModel);
      this.models = [hardwareViewModel];
      this.orderGuidExist = true;

    }
    else {
      this.orderService.gethardwareorderbyguid(this.orderguid).then((data) => {
        if (data != null) {
          this.orderGuidExist = true;
          this.models = data;
          this.setrefubQtyValidation();
          if (this.reportingGroupCascade.IsCasCade) {
            for (var i = 0; i < this.models.length; i++) {
              if (this.reportinggroup1Array) {
                this.models[i].reportinggroup1Array = this.reportinggroup1Array.slice();
              }
              if (this.reportinggroup2Array) {
                this.models[i].reportinggroup2Array = this.reportinggroup2Array.slice();
              }
              if (this.reportinggroup3Array) {
                this.models[i].reportinggroup3Array = this.reportinggroup3Array.slice();
              }
              if (this.reportinggroup4Array) {
                this.models[i].reportinggroup4Array = this.reportinggroup4Array.slice();
              }
              if (this.reportinggroup5Array) {
                this.models[i].reportinggroup5Array = this.reportinggroup5Array.slice();
              }
              if (this.reportinggroup6Array) {
                this.models[i].reportinggroup6Array = this.reportinggroup6Array.slice();
              }
              this.loadReportingGroupIDsWhenGUIDExist(i);
            }
          }
          else {


            this.models.forEach((value: HardwareViewModel, index: number) => {
              this.loadReportingGroupsArrayInModel(value);
            })
          }
        }

        else {
          this.orderGuidExist = false;

        }

      });

    }
  }

  checkRefurbishedProductActive(): Promise<any> {
    return this.genericService.CheckRefurbishedProductActive().then((data) => {
      this.isRefurbishedProductActive = data;
    });
  }

  checkReplacementDeviceActive(): Promise<any> {
    return this.genericService.CheckReplacementDeviceActive().then((data) => {
      this.isReplacementDeviceActive = data;
    });
  }

  checkShowQuantity() {
    return this.orderService.showQuantity().then((data) => {
      this.isQuantityActive = data;
    });
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

      this.reportinggroup1service.getReportingGroup1List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup1Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup1Array.push({
            label: item.reportinggroup1description, value: item.reportinggroup1id, id: item.reportinggroup1id

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

      this.reportinggroup2service.getReportingGroup2List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup2Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup2Array.push({
            label: item.reportinggroup2description, value: item.reportinggroup2id, id: item.reportinggroup2id
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

      this.reportinggroup3service.getReportingGroup3List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup3Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup3Array.push({
            label: item.reportinggroup3description, value: item.reportinggroup3id, id: item.reportinggroup3id
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

      this.reportinggroup4service.getReportingGroup4List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup4Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup4Array.push({
            label: item.reportinggroup4description, value: item.reportinggroup4id, id: item.reportinggroup4id
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

      this.reportinggroup5service.getReportingGroup5List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup5Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup5Array.push({
            label: item.reportinggroup5description, value: item.reportinggroup5id, id: item.reportinggroup5id
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

      this.reportinggroup6service.getReportingGroup6List(true).then((data) => {
        if (data != null && data.length > 0) {
          this.reportinggroup6Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.reportinggroup6Array.push({
            label: item.reportinggroup6description, value: item.reportinggroup6id, id: item.reportinggroup6id
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

  onClickRefurbishedProduct(index: number) {
    if (this.models[index].isrefurbished) {
      this.deviceFilterheadermeta = [{ field: 'device', header: 'Product', width: '40%' },
      { field: 'price', header: 'Price', width: '10%' },
      { field: 'producttype', header: 'Product Type', width: '40%' },
      { field: 'qty', header: 'Qty', width: '10%' }];
    }
    else {
      this.deviceFilterheadermeta = [
        { field: 'device', header: 'Product', width: '40%' },
        { field: 'price', header: 'Price', width: '10%' },
        { field: 'producttype', header: 'Product Type', width: '50%' }
      ];
    }

    this.clearModelDevice(null, index);

  }


  completeMethodDevice(event: any, index: number) {
    let isExcludeProductID: boolean = this.models.some(a => a.producttypeid == 6 || a.producttypeid == 4);
    let productIDs: number[];
    if (isExcludeProductID) {
      productIDs = this.models.filter(a => a.producttypeid == 6 || a.producttypeid == 4).map(a => a.productid);
    }

    this.orderService.getDeviceByFilter(event.query, isExcludeProductID, productIDs).then(data => {
      this.models[index].deviceFilterList = data;
    });

  }

  onSelectDevice(event: any, index: number) {
    //manish
    if (event.productid != undefined) {

      var isAlreadyStockOnlyProductSelected = false;
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].isstockonly && this.models[i].selecteddevice.productid === this.models[index].selecteddevice.productid) {
          isAlreadyStockOnlyProductSelected = true;
        }
      }

      this.models[index].isstockonlyReadOnly = false;
      if (isAlreadyStockOnlyProductSelected) {
        this.models[index].isstockonlyReadOnly = true;
      }





      let price = event.price ? event.price.toFixed(2) : 0.00.toFixed(2);
      this.models[index].refurbisheddeviceid = null;
      this.models[index].productid = event.orderproductdetailid;
      this.models[index].producttypeid = event.producttypeid;
      this.models[index].quantity = 1;
      this.models[index].cost = price;//event.price ? event.price : 0.00;
      this.models[index].totalcost = price//event.price.toFixed(2);
      // this.clearModelMobile(event, index);

      this.setOrderTotalCost();

      this.clearCTNValues(index);
      this.clearUserValues(index);
      this.clearReportinggroupValues(index);
      this.models[index].isreplaceexistingdevice = null;
    }

  }

  setOrderTotalCost() {
    if (this.models[0].ordertotalcost == null) {
      this.models[0].ordertotalcost = 0.00;
    }

    let initialValue = 0;
    let sum = this.models.reduce(function (accumulator, currentValue) {
      return accumulator + (+(currentValue.totalcost || 0));
    }, initialValue);

    let price: any = sum ? sum.toFixed(2) : 0.00.toFixed(2);
    this.models[0].ordertotalcost = price;
  }

  clearModelDevice(event: any, index: number) {

    this.models[index].selecteddevice = null;
    this.models[index].refurbisheddeviceid = null;
    this.models[index].productid = null;
    this.models[index].selectedrefurbisheddevice = null;

    this.models[index].producttypeid = null;
    this.models[index].quantity = null;
    this.models[index].cost = null;
    this.models[index].totalcost = null;

    this.clearCTNValues(index);
    this.clearUserValues(index);
    this.clearReportinggroupValues(index);
    this.models[index].isreplaceexistingdevice = null;
    this.models[index].isstockonly = false;
    this.setOrderTotalCost();

  }


  reCompleteMethodDevice(event: any, index: number) {
    this.orderService.getRefubrishedDeviceByFilter(event.query, null).then(data => {
      this.models[index].refubrishedDeviceFilter = data;
    });
  }

  onReSelectDevice(event: any, index: number) {

    if (event.productid != undefined) {

      let price = event.price ? event.price.toFixed(2) : 0.00.toFixed(2);
      this.models[index].productid = null;
      this.models[index].refurbisheddeviceid = event.productid;
      this.models[index].producttypeid = event.producttypeid;
      this.models[index].quantity = 1;
      this.models[index].cost = price;
      this.models[index].totalcost = price;
      this.models[index].validationMaxQuantity = event.qty;
      this.setOrderTotalCost();

      this.clearCTNValues(index);
      this.clearUserValues(index);
      this.clearReportinggroupValues(index);
      this.models[index].isreplaceexistingdevice = null;

      this.updateRefubValidationQty(event, index);
      this.validateRefubUI();
    }
  }


  onChangeQuantity(event: any, index: number) {

    let currentValue = this.models[index].quantity;
    let inputValue = 1;
    let refubId = this.models[index].refurbisheddeviceid;
    if (event) {
      inputValue = event.target.value;
      if (inputValue < 1) {
        event.target.value = 1;
      }
    }
    else {
      inputValue = currentValue;
    }
    if (refubId) {
      let maxQty = this.models[index].selectedrefurbisheddevice.qty;
      if (inputValue > maxQty) {
        this.models[index].quantity = maxQty;
      }
      if (event && event.target && inputValue > maxQty) {
        event.target.value = maxQty;
      }
      let allItems = this.models.filter(item => item.refurbisheddeviceid == refubId);
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
    let total: any = this.models[index].cost * currentValue;
    total = isNaN(total) ? "0.00" : total.toFixed(2);
    this.models[index].totalcost = total;
    this.setOrderTotalCost();
  }

  validateRefubUI() {
    // all items where qty > total
    if (this.refubQtyValidation) {
      let allInvalidItems = this.refubQtyValidation.filter(item => item.productid && item.userQty > item.totalQty);
      let allInvalidIds = allInvalidItems.map((v) => Number(v.productid));
      // find these items in line items
      let invalidLineItems = this.models.filter(item => allInvalidIds.indexOf(item.refurbisheddeviceid) !== -1);
      let validItems = this.models.filter(item => allInvalidIds.indexOf(item.refurbisheddeviceid) === -1);
      // mark all these as invalid
      invalidLineItems.forEach(item => item.refurbishedInvalid = true);
      validItems.forEach(item => item.refurbishedInvalid = false);
      this.anyRefurbishedInvalid = this.models.some(item => item.refurbishedInvalid);
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

      this.setrefubQtyValidation();
      this.validateRefubUI();
    }
  }

  setrefubQtyValidation() {

    this.refubQtyValidation = [];
    this.models.forEach(item => {
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
          localItem.totalQty = item.validationMaxQuantity;
          localItem.userQty = item.quantity;
          this.refubQtyValidation.push(localItem);
        }
      }
    });
  }

  onChangeReportingGroupEvent(reportinggroupsguidids: any, index: number) {
    if (reportinggroupsguidids != null) {
      this.models[index].reportinggroup1id = reportinggroupsguidids.reportinggroup1id;
      this.models[index].reportinggroup2id = reportinggroupsguidids.reportinggroup2id;
      this.models[index].reportinggroup3id = reportinggroupsguidids.reportinggroup3id;
      this.models[index].reportinggroup4id = reportinggroupsguidids.reportinggroup4id;
      this.models[index].reportinggroup5id = reportinggroupsguidids.reportinggroup5id;
      this.models[index].reportinggroup6id = reportinggroupsguidids.reportinggroup6id;


      this.models[index].reportinggroup1guid = reportinggroupsguidids.reportinggroup1guid;
      this.models[index].reportinggroup2guid = reportinggroupsguidids.reportinggroup2guid;
      this.models[index].reportinggroup3guid = reportinggroupsguidids.reportinggroup3guid;
      this.models[index].reportinggroup4guid = reportinggroupsguidids.reportinggroup4guid;
      this.models[index].reportinggroup5guid = reportinggroupsguidids.reportinggroup5guid;
      this.models[index].reportinggroup6guid = reportinggroupsguidids.reportinggroup6guid;
    }
  }


  onClickStockOnly(index: number) {
    //manish
    if (this.models[index].isstockonlyReadOnly === true) {
      return;
    }

    if (this.models[index].isstockonly == false) {
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].selecteddevice != undefined && this.models[index].selecteddevice != undefined && (this.models[i].selecteddevice.productid === this.models[index].selecteddevice.productid)) {
          this.models[i].isstockonlyReadOnly = false;
        }
      }
    }
    else {
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].selecteddevice != undefined && this.models[index].selecteddevice != undefined && (this.models[i].selecteddevice.productid === this.models[index].selecteddevice.productid)) {
          if (index != i) {
            this.models[i].isstockonlyReadOnly = true;
          }
        }
      }
    }




    this.clearCTNValues(index);
    this.clearUserValues(index);
    // this.clearReportinggroupValues(index);
    this.models[index].isreplaceexistingdevice = null;
    this.models[index].reportinggroup1guid = null;
    this.models[index].reportinggroup2guid = null;
    this.models[index].reportinggroup3guid = null;
    this.models[index].reportinggroup4guid = null;
    this.models[index].reportinggroup5guid = null;
    this.models[index].reportinggroup6guid = null;

    this.models[index].reportinggroup1id = null;
    this.models[index].reportinggroup2id = null;
    this.models[index].reportinggroup3id = null;
    this.models[index].reportinggroup4id = null;
    this.models[index].reportinggroup5id = null;
    this.models[index].reportinggroup6id = null;

    //this.models.forEach(function (value) {

    //}); 

  }

  completeMethodMobile(event: any, index: number) {
    return this.ctnDetailService.getMobileByFilter(event.query, true).then(data => {
      for (var i = 0; i < data.length; i++) {
        if (this.models.some(a => a.mobilenumber == data[i].mobilenumber)) {
          data.splice(i, 1);
        }
      }

      this.models[index].mobileFilterList = data;
    });
  }

  onSelectMobile(event: MobileFilter, index: number) {
    if (event.ctndetailsguid != undefined) {

      this.models[index].quantity = 1;
      let singleCost = this.models[index].cost;
      this.models[index].totalcost = singleCost;

      this.setOrderTotalCost();


      this.models[index].mobilenumber = event.mobilenumber;
      this.models[index].ctndetailid = event.ctndetailid;
      this.loader.emit(this.loadCTNDetails(event.ctndetailsguid, index));
    }
  }

  clearModelMobile(event: any, index: number) {
    this.clearCTNValues(index);
    this.clearUserValues(index);
    this.clearReportinggroupValues(index);
    this.models[index].isreplaceexistingdevice = null;
  }

  completeMethodUserAccount(event: any, index: number) {
    let query: string;
    query = event.query
    this.userService.getUsersByFilter(query).then((data) => {
      this.models[index].userFilterList = data;
    });
  }

  onSelectUserAccount(event: any, index: number) {
    this.models[index].userid = event.id;
  }

  onClearUserAccount(event: any, index: number) {

    this.clearUserValues(index);
    this.clearReportinggroupValues(index);
  }

  /**
  * Load the ctn details
  */
  loadCTNDetails(ctnGuid: string, index: number): Promise<any> {

    return this.ctnDetailService.getCTNDetailByGuid(ctnGuid).then((data) => {
      if (data != null) {

        this.models[index].reportinggroup1guid = data.reportinggroup1guid;
        this.models[index].reportinggroup2guid = data.reportinggroup2guid;
        this.models[index].reportinggroup3guid = data.reportinggroup3guid;
        this.models[index].reportinggroup4guid = data.reportinggroup4guid;
        this.models[index].reportinggroup5guid = data.reportinggroup5guid;
        this.models[index].reportinggroup6guid = data.reportinggroup6guid;


        this.models[index].reportinggroup1id = data.reportinggroup1id;
        this.models[index].reportinggroup2id = data.reportinggroup2id;
        this.models[index].reportinggroup3id = data.reportinggroup3id;
        this.models[index].reportinggroup4id = data.reportinggroup4id;
        this.models[index].reportinggroup5id = data.reportinggroup5id;
        this.models[index].reportinggroup6id = data.reportinggroup6id;

        this.models[index].name = data.name;
        this.models[index].userid = data.userid;
        this.models[index].mobilenumber = data.mobilenumber;
        //Change
        this.onChangeReportingGroup1(index).then(() => {
          this.models[index].reportinggroup1guid = data.reportinggroup1guid;
          this.models[index].reportinggroup2guid = data.reportinggroup2guid;
          this.models[index].reportinggroup3guid = data.reportinggroup3guid;
          this.models[index].reportinggroup4guid = data.reportinggroup4guid;
          this.models[index].reportinggroup5guid = data.reportinggroup5guid;
          this.models[index].reportinggroup6guid = data.reportinggroup6guid;


          this.models[index].reportinggroup1id = data.reportinggroup1id;
          this.models[index].reportinggroup2id = data.reportinggroup2id;
          this.models[index].reportinggroup3id = data.reportinggroup3id;
          this.models[index].reportinggroup4id = data.reportinggroup4id;
          this.models[index].reportinggroup5id = data.reportinggroup5id;
          this.models[index].reportinggroup6id = data.reportinggroup6id;
        });
      }
    });
  }

  clearCTNValues(index: number) {
    this.models[index].mobilenumber = null;
    this.models[index].ctndetailid = null;
    this.models[index].mobilefilter = null;
  }
  clearUserValues(index: number) {
    this.models[index].userfilter = null;
    this.models[index].userid = null;
    this.models[index].name = null;

  }

  clearReportinggroupValues(index: number) {

    this.models[index].reportinggroup1guid = null;
    this.models[index].reportinggroup2guid = null;
    this.models[index].reportinggroup3guid = null;
    this.models[index].reportinggroup4guid = null;
    this.models[index].reportinggroup5guid = null;
    this.models[index].reportinggroup6guid = null;

    this.models[index].reportinggroup1id = null;
    this.models[index].reportinggroup2id = null;
    this.models[index].reportinggroup3id = null;
    this.models[index].reportinggroup4id = null;
    this.models[index].reportinggroup5id = null;
    this.models[index].reportinggroup6id = null;
  }

  onAddNewRow() {
    //this.array.push(this.count++);
    let hardwareViewModel = new HardwareViewModel();
    if (this.reportinggroup1Array) {
      hardwareViewModel.reportinggroup1Array = this.reportinggroup1Array.slice();
    }
    if (this.reportinggroup2Array) {
      hardwareViewModel.reportinggroup2Array = this.reportinggroup2Array.slice();
    }
    if (this.reportinggroup3Array) {
      hardwareViewModel.reportinggroup3Array = this.reportinggroup3Array.slice();
    }
    if (this.reportinggroup4Array) {
      hardwareViewModel.reportinggroup4Array = this.reportinggroup4Array.slice();
    }
    if (this.reportinggroup5Array) {
      hardwareViewModel.reportinggroup5Array = this.reportinggroup5Array.slice();
    }
    if (this.reportinggroup6Array) {
      hardwareViewModel.reportinggroup6Array = this.reportinggroup6Array.slice();
    }


    this.models.push(hardwareViewModel);
  }

  onRemoveRow(index: number) {

    let removedProductItem = this.models[index];
    let removedItem = this.models[index].refurbisheddeviceid;
    if (removedItem) {
      let qty = this.models[index].quantity;
      let event = { productid: removedItem, qty: qty };
      this.updateRefubValidationQty(event, index, true);
    }
    this.models.splice(index, 1);
    this.validateRefubUI();
    this.setOrderTotalCost();

    //manish
    if (removedProductItem.selecteddevice && removedProductItem.isstockonlyReadOnly === false) {
      for (var i = 0; i < this.models.length; i++) {
        if (this.models[i].selecteddevice != undefined && (removedProductItem.selecteddevice.productid == this.models[i].selecteddevice.productid)) {
          this.models[i].isstockonlyReadOnly = false;
        }

      }
    }

  }
  save(form: NgForm) {

    let isValidForm = false;
    isValidForm = this.models.some(a => {
      return a.selecteddevice != null || a.selectedrefurbisheddevice != null;
    });

    if (isValidForm) {

      let refubInvalid = this.validateRefubQty();
      if (!refubInvalid) {
        this.loader.emit(this.orderService.saveHardwareOrder(this.models, this.orderguid).subscribe((result: any) => {
          if (result && result.success) {
            this.router.navigate(['order-confirmation'], {
              queryParams: { orderguid: result.object }
            });
          }
        }));
      }
      else {
        this.errormsg = "Quantity exceeds the stock available !!";
      }
    }


  }

  validateRefubQty() {
    if (this.refubQtyValidation) {
      let items = this.refubQtyValidation.filter(item => item.productid);
      let valid = items.some(item => item.userQty > item.totalQty);
      return valid;
    }
    return false;
  }

  navigateToTotalBillingByCallCategory(rheader: string) {
    this.router.navigate(['order-confirmation'], {
      queryParams: { orderguid: rheader }
    });
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  isCascade(): Promise<any> {
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

  onChangeReportingGroup1(index: number): Promise<any> {

    if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.ParentChild) {
      let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.models[index].reportinggroup1id)[0];
      this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1, index);
      if (selectedReportingGroup.id) {

        if (this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.id, index);
        }

        if (this.reportinggroup3Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup3).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup3, selectedReportingGroup.id, index);
        }

        if (this.reportinggroup4Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup4).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup4, selectedReportingGroup.id, index);
        }
        if (this.reportinggroup5Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup5).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup5, selectedReportingGroup.id, index);
        }
        if (this.reportinggroup6Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup6).length) {
          this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup6, selectedReportingGroup.id, index);
        }
      }

    }
    else if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {

      let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.models[index].reportinggroup1id)[0];

      //this.models[index].reportinggroup2Array = [];
      //this.models[index].reportinggroup3Array = [];
      //this.models[index].reportinggroup4Array = [];
      //this.models[index].reportinggroup5Array = [];
      //this.models[index].reportinggroup6Array = [];
      this.clearReportingGroupDropDownWhenDaisyChain(index, 2);
      if (selectedReportingGroup.id && this.reportinggroup2Active && this.isReportingGroupCascade(ReportingGroupType.ReportingGroup2).length) {
        this.clearReportingGroupDropDownWhenCascade(ReportingGroupType.ReportingGroup1, index);
        return this.loadCascadeReportingGroupDropdown(ReportingGroupType.ReportingGroup2, selectedReportingGroup.id, index);
      }
      else {
        return new Promise((resolve: any, reject: any) => { resolve(1); });
      }

    }

    return new Promise((resolve: any, reject: any) => { resolve(1); });

  }

  loadCascadeReportingGroupDropdown(childRportingGroupId: number, parentReportingGroupRecordId: number, index: number): Promise<any> {


    return this.genericService.GetReportingGroupListByChildRportingGroupId(childRportingGroupId, parentReportingGroupRecordId, true).then((data) => {
      if (data != null) {

        if (childRportingGroupId === ReportingGroupType.ReportingGroup2) {

          this.models[index].reportinggroup2Array = [];
          this.models[index].reportinggroup2Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.models[index].reportinggroup2Array.push({
            label: item.description, value: item.id, id: item.id
          }));



        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup3) {
          this.models[index].reportinggroup3Array = [];
          this.models[index].reportinggroup3Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.models[index].reportinggroup3Array.push({
            label: item.description, value: item.id, id: item.id
          }));
        }

        else if (childRportingGroupId === ReportingGroupType.ReportingGroup4) {
          this.models[index].reportinggroup4Array = [];
          this.models[index].reportinggroup4Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.models[index].reportinggroup4Array.push({
            label: item.description, value: item.id, id: item.id
          }));
        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup5) {
          this.models[index].reportinggroup5Array = [];
          this.models[index].reportinggroup5Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.models[index].reportinggroup5Array.push({
            label: item.description, value: item.id, id: item.id
          }));
        }
        else if (childRportingGroupId === ReportingGroupType.ReportingGroup6) {
          this.models[index].reportinggroup6Array = [];
          this.models[index].reportinggroup6Array.push({ label: this.placeholder, value: null });
          data.forEach(item => this.models[index].reportinggroup6Array.push({
            label: item.description, value: item.id, id: item.id
          }));
        }

      }
    });


  }

  onChangeReportingGroup(reportingGroupType: number, childReportingGroupActive: boolean, index: number): Promise<any> {

    if (this.reportingGroupCascade.IsCasCade && this.reportingGroupCascade.CascadeValue == ReportingGroupRelationshipType.DaisyChain) {
      let selectedReportingGroupID: any;
      if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
        selectedReportingGroupID = this.models[index].reportinggroup1id;
        this.clearReportingGroupDropDownWhenDaisyChain(index, 2);
      }
      else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {
        selectedReportingGroupID = this.models[index].reportinggroup2id;
        this.clearReportingGroupDropDownWhenDaisyChain(index, 3);
      }
      else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
        selectedReportingGroupID = this.models[index].reportinggroup3id;
        this.clearReportingGroupDropDownWhenDaisyChain(index, 4);
      }

      else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
        selectedReportingGroupID = this.models[index].reportinggroup4id;
        this.clearReportingGroupDropDownWhenDaisyChain(index, 5);
      }
      else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
        selectedReportingGroupID = this.models[index].reportinggroup5id;
        this.clearReportingGroupDropDownWhenDaisyChain(index, 6);
      }
      else if (reportingGroupType === ReportingGroupType.ReportingGroup6) {
        selectedReportingGroupID = this.models[index].reportinggroup6id;
      }
      //if (this.reportinggroup1Active && reportingGroupType === ReportingGroupType.ReportingGroup1) {
      //    //let selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.models[index].reportinggroup1id)[0];

      //    selectedReportingGroup = this.reportinggroup1Array.filter(x => x.value == this.models[index].reportinggroup1id)[0];
      //}
      //else if (this.reportinggroup2Active && reportingGroupType === ReportingGroupType.ReportingGroup2) {

      //    selectedReportingGroup = this.reportinggroup2Array.filter(x => x.value == this.models[index].reportinggroup2id)[0];
      //}
      //else if (this.reportinggroup3Active && reportingGroupType === ReportingGroupType.ReportingGroup3) {
      //    selectedReportingGroup = this.reportinggroup3Array.filter(x => x.value == this.models[index].reportinggroup3id)[0];
      //}

      //else if (this.reportinggroup4Active && reportingGroupType === ReportingGroupType.ReportingGroup4) {
      //    selectedReportingGroup = this.reportinggroup4Array.filter(x => x.value == this.models[index].reportinggroup4id)[0];
      //}
      //else if (this.reportinggroup6Active && reportingGroupType === ReportingGroupType.ReportingGroup5) {
      //    selectedReportingGroup = this.reportinggroup5Array.filter(x => x.value == this.models[index].reportinggroup5id)[0];
      //}
      //else if (reportingGroupType === ReportingGroupType.ReportingGroup6) {
      //    selectedReportingGroup = this.reportinggroup6Array.filter(x => x.value == this.models[index].reportinggroup6id)[0];
      //}



      let nextreportingGroupType = reportingGroupType + 1;
      if (selectedReportingGroupID && childReportingGroupActive && this.isReportingGroupCascade(nextreportingGroupType).length) {
        this.clearReportingGroupDropDownWhenCascade(reportingGroupType, index);
        return this.loadCascadeReportingGroupDropdown(nextreportingGroupType, selectedReportingGroupID, index);
      }

      else {
        return new Promise((resolve: any, reject: any) => { resolve(1); });
      }

    }
    return new Promise((resolve: any, reject: any) => { resolve(1); });
  }

  clearReportingGroupDropDownWhenCascade(id: number, index: number) {

    let reportingGroups = this.reportingGroupRelMasterArray.filter(a => a.childrportinggroupid > id);
    if (this.reportinggroup2Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup2)) {
      this.models[index].reportinggroup2id = null;
      this.models[index].reportinggroup2Array = [];
      //this.clearReportingGroup2();
    }
    if (this.reportinggroup3Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup3)) {
      this.models[index].reportinggroup3id = null;
      this.models[index].reportinggroup3Array = [];
      //this.clearReportingGroup3();
    }

    if (this.reportinggroup4Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup4)) {
      this.models[index].reportinggroup4id = null;
      this.models[index].reportinggroup4Array = [];
      //this.clearReportingGroup4();
    }
    if (this.reportinggroup5Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup5)) {
      this.models[index].reportinggroup5id = null;
      this.models[index].reportinggroup5Array = [];
      //this.clearReportingGroup5();
    }
    if (this.reportinggroup6Active && reportingGroups.some(a => a.childrportinggroupid == ReportingGroupType.ReportingGroup6)) {
      this.models[index].reportinggroup6id = null;
      this.models[index].reportinggroup6Array = [];
      //this.clearReportingGroup6();
    }
  }

  loadReportingGroupIDsWhenGUIDExist(index: number) {
    let _reportinggroup1id = this.models[index].reportinggroup1id;
    let _reportinggroup2id = this.models[index].reportinggroup2id;
    let _reportinggroup3id = this.models[index].reportinggroup3id;
    let _reportinggroup4id = this.models[index].reportinggroup4id;
    let _reportinggroup5id = this.models[index].reportinggroup5id;
    let _reportinggroup6id = this.models[index].reportinggroup6id;

    this.onChangeReportingGroup1(index).then((res: any) => {

      this.models[index].reportinggroup1id = _reportinggroup1id;
      this.models[index].reportinggroup2id = _reportinggroup2id;

      this.onChangeReportingGroup(ReportingGroupType.ReportingGroup2, this.reportinggroup3Active, index).then(() => {
        this.models[index].reportinggroup3id = _reportinggroup3id;
        this.onChangeReportingGroup(ReportingGroupType.ReportingGroup3, this.reportinggroup4Active, index).then(() => {
          this.models[index].reportinggroup4id = _reportinggroup4id;
          this.onChangeReportingGroup(ReportingGroupType.ReportingGroup4, this.reportinggroup5Active, index).then(() => {
            this.models[index].reportinggroup5id = _reportinggroup5id;
            this.onChangeReportingGroup(ReportingGroupType.ReportingGroup5, this.reportinggroup6Active, index).then(() => {
              this.models[index].reportinggroup6id = _reportinggroup6id;
            });
          });;
        });;
      });

    });


  }

  clearReportingGroupDropDownWhenDaisyChain(index: number, start: number) {
    for (var i = start; i <= 6; i++) {
      this.models[index]["reportinggroup" + i + "Array"] = [];
    }

  }

  loadReportingGroupsArrayInModel(hardwareViewModel: HardwareViewModel) {

    if (this.reportinggroup1Array) {
      hardwareViewModel.reportinggroup1Array = this.reportinggroup1Array.slice();
    }
    if (this.reportinggroup2Array) {
      hardwareViewModel.reportinggroup2Array = this.reportinggroup2Array.slice();
    }
    if (this.reportinggroup3Array) {
      hardwareViewModel.reportinggroup3Array = this.reportinggroup3Array.slice();
    }
    if (this.reportinggroup4Array) {
      hardwareViewModel.reportinggroup4Array = this.reportinggroup4Array.slice();
    }
    if (this.reportinggroup5Array) {
      hardwareViewModel.reportinggroup5Array = this.reportinggroup5Array.slice();
    }
    if (this.reportinggroup6Array) {
      hardwareViewModel.reportinggroup6Array = this.reportinggroup6Array.slice();
    }
    return hardwareViewModel;

  }

  redirectToHome() {
    this.router.navigate(['home']);
  }

}
