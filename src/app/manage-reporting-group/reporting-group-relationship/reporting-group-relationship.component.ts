import { Component, OnInit, EventEmitter } from '@angular/core'
import { NgForm } from '@angular/forms';
import { GlobalEventsManager } from "../../_common/global-event.manager";
import { ReportingGroupRel, ReportingGroupRelDetail } from 'src/app/_models/reportinggrouprelmodel';
import { ReportingGroupService } from 'src/app/_services/reporting-group.service';
import { ConfirmationService } from 'primengdevng8/api';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportingGroupBaseViewModel } from 'src/app/_models/reporting-group-base';

@Component({
    selector: 'reporting-group-relationship',
    templateUrl: './reporting-group-relationship.component.html'
})


export class ReportingGroupRelComponent implements OnInit {
    private loader: EventEmitter<any>;

    reportingGroupRelSet: number;
    selectedRelation: number;
    rgGroupDetails: ReportingGroupRel[];
    sourceHeaderNames: string[] = [];
    targetHeaderNames: string[] = [];

    saveDisabled: boolean = false;

    constructor(
        private globalEventsManager: GlobalEventsManager,
        private reportingGroupService: ReportingGroupService,
        private confirmationservice: ConfirmationService,
        private activeModal: NgbActiveModal
    ) {
        this.loader = globalEventsManager.busySpinner;
    }


    ngOnInit() {
        let p1 = this.getReportingGroupRelationShip();
        //let p2 = this.loadRelData();
        this.loader.emit(Promise.all([p1]).then((data) => { this.loader.emit(this.loadRelData()) }));
    }

    setRelation(): Promise<any> {
        return this.reportingGroupService.setRelation(this.selectedRelation).then((data) => {
            if (data) {
                this.reportingGroupRelSet = 1;
            }
        })
    }

    getReportingGroupRelationShip(): Promise<any> {
        return this.reportingGroupService.getReportingGroupRelationShip().then((data) => {
            if (data && data != 0) {
                this.selectedRelation = data;
                this.reportingGroupRelSet = 1;
            }
            else {
                this.reportingGroupRelSet = 0;
            }
        })
    }

    loadRelData(): Promise<any> {

        if (this.reportingGroupRelSet == 1) {
            let item = new Promise((resolve, reject) => {
                this.reportingGroupService.getReportingGroupRel().then((data: any) => {
                    if (data && data.length) {
                        this.rgGroupDetails = [];
                        this.sourceHeaderNames = [];
                        this.targetHeaderNames = [];

                        data.forEach((item: any) => {
                            let rgRel = new ReportingGroupRel();
                            let parent = new ReportingGroupRelDetail();
                            parent.items = [];
                            parent.items.push({ label: '---Please Select---', value: null });
                            item.items.forEach((rg: any) => {
                                parent.items.push({ label: rg.description, value: rg.reportinggroupguid });
                            });
                            parent.item = new ReportingGroupBaseViewModel();
                            parent.item.reportinggroupdisplayname = item.item.reportinggroupdisplayname;
                            parent.item.id = item.item.id;
                            parent.item.reportinggroupguid = item.item.reportinggroupguid;
                            parent.selecteditem = new ReportingGroupBaseViewModel()
                            parent.selecteditem.reportinggroupguid = null;
                            rgRel.parentitem = parent;


                            let child = new ReportingGroupRelDetail();
                            child.childitems = []
                            item.childitems.forEach((rg: any, index: number) => {
                                let rgItem = new ReportingGroupBaseViewModel();
                                rgItem.description = rg.description;
                                rgItem.id = rg.id;
                                rgItem.reportinggroupguid = rg.reportinggroupguid;
                                rgItem.reportinggroupdisplayname = rg.reportinggroupdisplayname;
                                if (index == 0) {
                                    this.sourceHeaderNames.push(rg.reportinggroupdisplayname);
                                    this.targetHeaderNames.push(rg.reportinggroupdisplayname);
                                    child.item = new ReportingGroupBaseViewModel();
                                    child.item.reportnggroupmasterid = rg.reportnggroupmasterid;
                                }
                                child.childitems.push(rgItem);
                            });
                            child.selecteditems = [];
                            
                            child.childname = item.childname;
                            child.ischildrequired = item.ischildrequired;
                            rgRel.childitem = child;
                            this.rgGroupDetails.push(rgRel);
                        });
                        resolve();
                    }
                });
            });
            return item;
        }
    }

    addSelected(e: any, i: number) {

    }

    removeSelected(e: any, i: number) {

    }

    save(form: NgForm) {
        this.saveDisabled = true;
        let model = this.setModel();

        var saveflag: boolean = false;
        for (var i = 0; i < model.length; i++) {
            if (model[i].selecteditem.reportinggroupguid !=null) {
                saveflag = true;
                break;
            }
        }

        if (saveflag == false) {
            this.confirmationservice.confirm({
                message: "Please Select Parent Reporting Group",
                key: "dialog",
                rejectVisible: false,
                accept: () => {
                    this.saveDisabled = false;
                }
            });
        }
        else {
            this.loader.emit(this.reportingGroupService.SaveReportingGroupRel(model).then((data) => {

                if (data) {
                    this.confirmationservice.confirm({
                        message: "Record Saved Successfully",
                        key: "dialog",
                        rejectVisible: false,
                        accept: () => {
                            this.saveDisabled = false;
                            //form.resetForm();
                            //location.reload();
                        }
                    });
                }


            }));
        }

     
    }

    setModel() {
        let rgList:  any[] = [];
        this.rgGroupDetails.forEach((item) => {
            let childItems: any[] = [];
            item.childitem.selecteditems.forEach((childItem) => {
                childItems.push({
                    'reportinggroupguid': childItem.reportinggroupguid                  
                });
            });
            rgList.push({
                'selecteditem': {
                    'reportinggroupguid': item.parentitem.selecteditem.reportinggroupguid                    
                },
                'selecteditems': childItems,
                'childname':item.childitem.childname
            });
            
        });
        return rgList;
    }

    onChangeDD(index: number) {
        let p = new Promise((resolve, reject) => {
            let currentItem = this.rgGroupDetails[index].parentitem.selecteditem ? this.rgGroupDetails[index].parentitem.selecteditem.reportinggroupguid : null;
            this.reportingGroupService.getReportingGroupRelDetails(this.rgGroupDetails[index].parentitem.item.id, this.rgGroupDetails[index].childitem.item.reportnggroupmasterid, currentItem)
                .then((data: any) => {
                    let child = new ReportingGroupRelDetail();
                    child.childitems = []
                    child.selecteditems = [];
                    data.item1.childitems.forEach((rg: any, index: number) => {
                        let rgItem = new ReportingGroupBaseViewModel();
                        rgItem.description = rg.description;
                        rgItem.id = rg.id;
                        rgItem.reportinggroupguid = rg.reportinggroupguid;
                        
                        //rgItem.reportinggroupdisplayname = rg.reportinggroupdisplayname;
                        if (index == 0) {
                            // this.sourceHeaderNames.push(rg.reportinggroupdisplayname);
                            // this.targetHeaderNames.push(rg.reportinggroupdisplayname);
                            child.item = new ReportingGroupBaseViewModel();
                            child.item.reportnggroupmasterid = rg.reportnggroupmasterid;
                        }
                        
                    
                        child.childitems.push(rgItem);
                    });
                    
                    child.childname = data.item1.childname;
                    child.ischildrequired = data.item1.ischildrequired;

                    data.item2.childitems.forEach((rg: any, index: number) => {
                        let rgItem = new ReportingGroupBaseViewModel();
                        rgItem.description = rg.description;
                        rgItem.id = rg.id;
                        rgItem.reportinggroupguid = rg.reportinggroupguid;
                        //rgItem.reportinggroupdisplayname = rg.reportinggroupdisplayname;
                        if (index == 0) {
                            // this.sourceHeaderNames.push(rg.reportinggroupdisplayname);
                            // this.targetHeaderNames.push(rg.reportinggroupdisplayname);
                            child.item = new ReportingGroupBaseViewModel();
                            child.item.reportnggroupmasterid = rg.reportnggroupmasterid;
                        }                
                        child.selecteditems.push(rgItem);
                    });
                    this.rgGroupDetails[index].childitem = child;
                    
                    this.rgGroupDetails[index].childitem.childname = child.childname;
                    this.rgGroupDetails[index].childitem.ischildrequired = child.ischildrequired;
                    resolve();
                });

        });
        this.loader.emit(p)
    }

    saveRel() {
        let p1 = this.setRelation().then((data) => {
            this.loadRelData();
        });
        this.loader.emit(Promise.all([p1]));

    }
}