import { Component, Input, OnInit, EventEmitter, } from '@angular/core';
import { UpdateBarsModel } from '../../_models/updatebarsmodel';
import { CTNDetailService } from '../../_services/ctndetail.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../../_common/global-event.manager';
import { SelectItem, ConfirmationService } from 'primengdevng8/api';
import { UtilityMethod } from '../../_common/utility-method';


@Component({
    selector: 'update-bars',
    templateUrl: './update-bars.component.html'
})

export class UpdateBarsComponent implements OnInit {
    private loader: EventEmitter<any>;
    @Input() ctnguid: string;
    @Input() componentname: string;
    loading: boolean = true;
    error: string;
    labelText: string;
    statuslist: SelectItem[] = [{ label: 'Un-Barred', value: '0' }, { label: 'Barred', value: '1' }]
    model: UpdateBarsModel = new UpdateBarsModel();
    original_model: UpdateBarsModel = new UpdateBarsModel();
    internationalrequired: boolean = null;
    roamingrequired: boolean = null;
    datarequired: boolean = null;

    constructor(private ctndetailservice: CTNDetailService,
        private activeModal: NgbActiveModal,
        private confirmationservice: ConfirmationService,
        private globalevent: GlobalEventsManager) {
        this.loader = globalevent.busySpinner;

    }

    ngOnInit() {

        this.labelText = this.componentname;
        this.model.ctndetailsguid = this.ctnguid;
        this.loadBarStatus(this.ctnguid);
    }
    ngAfterViewChecked() {

    }
    loadBarStatus(ctnguid: string) {
        this.loader.emit(this.ctndetailservice.loadBarStatus(ctnguid).then(data => {
            this.model = data;
            this.original_model = JSON.parse(JSON.stringify(data));
            this.loading = false;
        }));
    }

    save(f: any) {
        if (this.checkIsAnyChange()) {
            this.loader.emit(this.ctndetailservice.updateCTNBars(this.model).then(res => {
                if (res.success) {
                    //this.activeModal.close(res.success);
                    this.confirmationservice.confirm({
                        message: res.message,
                        key: 'modal-confirmation-dialog',
                        rejectVisible: false,
                        accept: () => {
                            if (res.success) {
                                this.activeModal.close(true);

                            }
                        }
                    });
                }
                else {
                    this.error = res.message;
                }
            }));

        }
        else {
            this.confirmationservice.confirm({
                message: "No Value Change",
                key: 'modal-confirmation-dialog',
                rejectVisible: false,
                accept: (params: any) => {
                    this.loading = false;
                }
            });
        }
    }

    checkIsAnyChange() {
        if (this.model.internationalbarauthorizedby) {
            this.model.internationalbarauthorizedby = this.model.internationalbarauthorizedby.trim();
        }
        if (this.model.roamingbarauthorizedby) {
            this.model.roamingbarauthorizedby = this.model.roamingbarauthorizedby.trim();
        }
        if (this.model.databarauthorizedby) {
            this.model.databarauthorizedby = this.model.databarauthorizedby.trim();
        }
        if (
            (UtilityMethod.IfNull(this.model.internationalbarauthorizedby, '') !== UtilityMethod.IfNull(this.original_model.internationalbarauthorizedby))
            ||
            (this.model.internationalbarred !== this.original_model.internationalbarred)
            ||
            (UtilityMethod.IfNull(this.model.roamingbarauthorizedby) !== UtilityMethod.IfNull(this.original_model.roamingbarauthorizedby))
            ||
            (this.model.roamingbarred !== this.original_model.roamingbarred)
            ||
            (UtilityMethod.IfNull(this.model.databarauthorizedby) !== UtilityMethod.IfNull(this.original_model.databarauthorizedby))
            ||
            (this.model.databarred !== this.original_model.databarred)

        ) {
            return true;
        }

        return false;
    }
    //internationalChange(event: any) {
    //    let originalvalue = this.original_model['internationalbarred'];
    //    let currentvalue = this.model['internationalbarred'];
    //    if (originalvalue != currentvalue) {
    //        this.internationalrequired = true;
    //    }
    //    else {
    //        this.internationalrequired = null;
    //    }
    //}

    //roamingChange(event: any) {
    //    let originalvalue = this.original_model['roamingbarred'];
    //    let currentvalue = this.model['roamingbarred'];
    //    if (originalvalue != currentvalue) {
    //        this.roamingrequired = true;
    //    }
    //    else {
    //        this.roamingrequired = null;
    //    }
    //}

    //dataChange(event: any) {
    //    let originalvalue = this.original_model['databarred'];
    //    let currentvalue = this.model['databarred'];
    //    if (originalvalue != currentvalue) {
    //        this.datarequired = true;
    //    }
    //    else {
    //        this.datarequired = null;
    //    }
    //}


}