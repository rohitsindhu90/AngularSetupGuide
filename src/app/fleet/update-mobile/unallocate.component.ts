import { Component, Input, OnInit, EventEmitter, ChangeDetectorRef, } from '@angular/core';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { UnallocateModel } from '../../_models/unallocatemodel';
import { AddressService } from '../../_services/address.service';
import { AddressModel } from '../../_models/address'
import { RegexExpression } from '../../_common/regex-expression';
import { ClientControlService } from '../../_services/clientcontrol.service';
import { ClientControlEnum } from '../../_services/enumtype';

@Component({
    selector: 'unallocate',
    templateUrl: './unallocate.component.html'
})

export class UnallocateComponent implements OnInit {
    private loader: EventEmitter<any>;
    @Input() ctnguid: string;
    @Input() componentname: string;
    error: string;
    labelText: string;
    minDate: Date = new Date();
    model: UnallocateModel = new UnallocateModel();
    returndeviceoption: SelectItem[];
    addresslist: SelectItem[];
    mobilenumberregx: RegExp = RegexExpression.mobilenumber;



    constructor(private ctndetailservice: CTNDetailService,
        private activeModal: NgbActiveModal,
        private globalevent: GlobalEventsManager,
        private addressService: AddressService,
        private clientcontrolservice: ClientControlService,
        private confirmationservice: ConfirmationService,
        private cdRef: ChangeDetectorRef) {
        this.loader = globalevent.busySpinner;
    }

    ngOnInit() {
        this.labelText = this.componentname;
        this.model.ctndetailsguid = this.ctnguid;
        this.model.returningdevice = 0;
        this.minDate.setDate(this.minDate.getDate() + 2);
        this.addresslist = [];
        let process1 = this.loadAddress();
        let process2 = this.clientcontrolservice.GetClientControlByKey(ClientControlEnum.ReturningDevice).then(r => {
            if (r.active) {
                this.loadAssetAttached();
            }
            else {
                this.model.returningdevice = 0;
            }
        });
        this.loader.emit(Promise.all([process1, process2]));
    }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    loadAddress(): Promise<any> {
        return this.addressService.getAddressList(true).then(data => {
            this.addresslist.push({ label: "Select", value: null });
            data.forEach(item =>
                this.addresslist.push({ label: item.addresscombined, value: item.addressid })
            );
            this.model.newaddress = new AddressModel();
        });
    }

    loadAssetAttached(): Promise<any> {

        return this.ctndetailservice.isAssetAttached(this.model.ctndetailsguid).then(data => {

            if (data) {
                this.returndeviceoption = [{ label: 'No', value: 0 }];
                this.returndeviceoption.push({ label: 'Yes', value: 1 });
            }
        });
    }

    save() {
        this.loader.emit(this.ctndetailservice.unallocateCTN(this.model).then(res => {
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

    chkChange() {

        this.model.selectedaddress = null;
    }
}