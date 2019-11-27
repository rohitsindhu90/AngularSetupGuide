import { Component, Input, OnInit, EventEmitter, } from '@angular/core';
import { AssignAssetModel } from '../../_models/assign-asset-popup-model';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { AssetFilter } from '../../_models/asset/asset-filter';
import { AssetService } from '../../_services/asset.service';
import { AutoCompleteHeaderColumnMeta, ConfirmationService } from 'primengdevng8/api';
import { String } from '../../_common/utility-method';


@Component({
    selector: 'assign-asset',
    templateUrl: './assign-asset.component.html'
})

export class AssignAssetComponent implements OnInit {
    private loader: EventEmitter<any>;
    @Input() ctnguid: string;
    @Input() componentname: string;
    @Input() ctnusername: string;
    error: string;
    labelText: string;
    selectedAsset: any;

    model: AssignAssetModel = new AssignAssetModel();
    assetFilterList: AssetFilter[];

    assetheadermeta: AutoCompleteHeaderColumnMeta[] = [{ field: "device", header: 'Device', width: '50%' },
    { field: 'imei', header: 'IMEI' },
    { field: 'serialnumber', header: 'Serial Number' }
    ];


    allocationStatuslist: any[] = [{ value: "0", label: "All(Allocated or Unallocated)" }, { value: "yes", label: "Allocated(Asset with user)" }, { value: "no", label: "UnAllocated(Asset without user)" }];



    constructor(private ctndetailservice: CTNDetailService,
        private assetService: AssetService,
        private activeModal: NgbActiveModal,
        private confirmationservice: ConfirmationService,
        private globalevent: GlobalEventsManager) {
        this.loader = globalevent.busySpinner;

    }

    ngOnInit() {
        this.labelText = this.componentname;
        this.resetModelValue();

    }
    ngAfterViewChecked() {

    }

    save() {

        if (this.model.username != this.model.assetusername && this.model.assetusername != null && this.model.assetusername != undefined && this.model.assetusername.trim() != '') {

            let msg = "This device is currently allocated to {0} ";
            msg += (this.model.mobilenumber != "" ? " on " + this.model.mobilenumber + " " : "")
            msg += "\n . Are you sure you wish to continue ?";
            msg = String.Format(msg, [this.model.assetusername.toString()]);
            this.confirmationservice.confirm({
                message: msg,
                key: "modal-confirmation",
                rejectVisible: false,
                accept: () => {
                    this.assignAsset();
                }
            });

        }
        else {
            this.assignAsset();
        }
    }

    assignAsset() {
        this.loader.emit(this.ctndetailservice.AssignAsset(this.model).subscribe((res: any) => {
            if (res.success) {
                var message = "Update Successful";
                this.activeModal.close(res.success);

                this.confirmationservice.confirm({
                    message: message,
                    key: 'dialog',
                    rejectVisible: false,
                });
            }
            else {
                this.error = res.message;
            }
        }));
    }

    completeMethodAsset(event: any) {
        this.assetService.getAssetByAllocationStatus(event.query, this.model.allocationstatus, this.ctnguid).then(data => {
            this.assetFilterList = data;
        });
        //Removed by Rohit Sindhu ref TFS BugID: 19769 
        //this.onAllocationStatusChange();
    }

    onSelectAsset(event: any) {
        if (event.assetguid != undefined) {

            this.selectedAsset = event.device;

            this.assetFilterList = [];
            this.assetFilterList.push({ assetguid: event.assetguid, imei: event.imei, serialnumber: event.serialnumber, device: event.device, assetusername: event.assetusername, mobilenumber: event.mobilenumber } as AssetFilter);
            this.selectedAsset = this.assetFilterList[0];

            this.model.imei = event.imei;
            this.model.serialnumber = event.serialnumber;
            this.model.assetguid = event.assetguid;
            this.model.mobilenumber = event.mobilenumber;
            this.model.assetusername = event.assetusername;

        }
        else {
            //this.model = null;
            this.resetModelValue();
        }
    }


    clearModelAsset(event: any) {

        //this.model = new AssignAssetModel();
        this.resetModelValue();
    }

    onAllocationStatusChange() {

        this.model.serialnumber = "";
        this.model.imei = "";
        this.model.assetguid = "";
        this.selectedAsset = "";
        this.model.mobilenumber = "";
        this.model.assetusername = "";

    }

    resetModelValue() {
        let allocationstatus = "0";
        if (this.model && this.model.allocationstatus) {
            allocationstatus = this.model.allocationstatus;
        }
        this.model = new AssignAssetModel();
        this.model.allocationstatus = allocationstatus;
        this.model.ctndetailsguid = this.ctnguid;
        this.model.username = this.ctnusername;
    }

}