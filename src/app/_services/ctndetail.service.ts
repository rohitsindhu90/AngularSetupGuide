import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { UtilityMethod } from '../_common/utility-method';
import { CTNFleet } from "../_models/ctnfleet";
import { CTNDetailModel } from "../_models/ctn-details";
import { ManageFleetLinkSourceViewModel } from "../_models/managefleetlinksource";
import { MobileFilter, CareMobileFilterViewModel } from '../_models/mobile-filter';
import { CancellationPACRequestModel } from '../_models/cancellation-pacrequest-popup-model';
import { ResponseModel } from '../_models/response';
import { CTNDetailHistoryViewModel } from "../_models/ctndetailhistoryviewmodel";
import { UpdateBarsModel } from '../_models/updatebarsmodel';
import { AssignAssetModel } from '../_models/assign-asset-popup-model';
import { UnallocateModel } from '../_models/unallocatemodel';
import { CTNChangeLogColumnModel } from '../_models/ctnchangelogcolumn.model';
import { UserCTNViewModel } from '../_models/report/user-ctn-model';
import { CtnChangeReportViewModel } from '../_models/ctnchangereportviewmodel'
import { CareViewModel } from '../_models/care/care';
import { GenericTupleModelBoolAndString } from '../_models/generictuplemodelboolandstring';
import { CTNUnallocationReturn } from '../_models/ctnunallocationreturn';
import { AddBulkCTNValidateViewModel } from '../_models/bulk-upload/addbulkctnvalidateviewmodel';
import { CTNUnallocateAndReturnDetailViewModel } from '../_models/ctnunallocationreturn';
import { EditBulkCTNRequiredColumns } from '../_models/editbulkctnrequiredcolumnsmodel';
import { EditBulkCTNValidateViewModel } from '../_models/bulk-upload/editbulkctnvalidateviewmodel';

@Injectable({
    providedIn:'root'
})
export class CTNDetailService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    getFleetDetails(activemobile: boolean, cancelledmobile: boolean, linkType: string, linkSourceGuid: string, rtypeGuid: string): Promise<CTNFleet[]> {
        return this.http.get<CTNFleet[]>(this.appSettingService.apiurl + '/ctndetail/GetFleetDetails?activeMobile=' + UtilityMethod.IfNull(activemobile, false) + '&cancelledMobile=' + UtilityMethod.IfNull(cancelledmobile, false)
            + '&linkType=' + linkType + '&linkSourceGuid=' + linkSourceGuid + '&rtypeGuid=' + rtypeGuid
        )
            .toPromise();
    }

    getFleetDetailsByGroup(activemobile: boolean, cancelledmobile: boolean, linkType: string, linkSourceGuid: string, rtypeGuid: string): Promise<ManageFleetLinkSourceViewModel[]> {
        return this.http.get<ManageFleetLinkSourceViewModel[]>(this.appSettingService.apiurl + '/ctndetail/GetFleetDetailsByGroup?activeMobile=' + UtilityMethod.IfNull(activemobile, false) + '&cancelledMobile=' + UtilityMethod.IfNull(cancelledmobile, false)
            + '&linkType=' + linkType + '&linkSourceGuid=' + linkSourceGuid + '&rtypeGuid=' + rtypeGuid
        )
            .toPromise();
    }

    getCTNDetailByGuid(ctnGuid: string): Promise<CTNDetailModel> {
        return this.http.get<CTNDetailModel>(this.appSettingService.apiurl + '/ctndetail/GetCTNDetailsByGuid?ctnGuid=' + ctnGuid
        )
            .toPromise();
    }

    //this will load the the list of users from user table
    getMobileByFilter(name: string, active: boolean = null, isLiveStatusOnly: boolean = false): Promise<MobileFilter[]> {
        return this.http.get<MobileFilter[]>(this.appSettingService.apiurl + '/ctndetail/LoadUserListByFilterAsync?name=' + name + "&active=" + active + '&isLiveStatusOnly=' + isLiveStatusOnly)
            .toPromise();
    }

    //this will load the the list of users from user table
    getEligibleSharedTariffAsync(sharedTariffLeadGuid?: string, tariffGuid?: string): Promise<MobileFilter[]> {
        return this.http.get<MobileFilter[]>(this.appSettingService.apiurl + '/ctndetail/LoadEligibleSharedTariffAsync?sharedTariffLeadGuid=' + sharedTariffLeadGuid + '&tariffGuid=' + tariffGuid)
            .toPromise();
    }

    saveCTNDetails(model: CTNDetailModel) {

        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/SaveCTNDetails', model);
    }



    updateCTNDetailsCancellationPACRequest(model: CancellationPACRequestModel): Promise<ResponseModel> {
        let body = JSON.stringify(model);
        return this.http.post<ResponseModel>(this.appSettingService.apiurl + '/ctndetail/UpdateCTNDetailsCancellationPACRequest', body)
            .toPromise();
    }

    getCTNHistory(ctnGuid: string): Promise<CTNDetailHistoryViewModel[]> {
        return this.http.get<CTNDetailHistoryViewModel[]>(this.appSettingService.apiurl + '/ctndetail/GetCTNHistoryDetails?ctnGuid=' + ctnGuid)
            .toPromise();
    }

    loadBarStatus(ctnguid: string): Promise<UpdateBarsModel> {
        return this.http.get<UpdateBarsModel>(this.appSettingService.apiurl + '/ctndetail/LoadBarStatus?ctnGuid=' + ctnguid)
            .toPromise();
    }

    updateCTNBars(model: UpdateBarsModel): Promise<ResponseModel> {
        let body = JSON.stringify(model);
        return this.http.post<ResponseModel>(this.appSettingService.apiurl + '/ctndetail/UpdateCTNBars', body)
            .toPromise();
    }

    unallocateCTN(model: UnallocateModel): Promise<ResponseModel> {
        let body = JSON.stringify(model);
        return this.http.post<ResponseModel>(this.appSettingService.apiurl + '/ctndetail/Unallocate', body)
            .toPromise();
    }

    isAssetAttached(ctnguid: string): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/ctndetail/IsAssetAttached?ctnGuid=' + ctnguid)
            .toPromise();
    }

    CheckIfMobileNumberExist(mobilenumber: string): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/ctndetail/CheckIfMobileNumberExist?mobilenumber=' + mobilenumber)
            .toPromise();
    }

    CheckIfSIMNumberExist(mobilenumber: string, simnumber: string) {
        return this.http.get<string>(this.appSettingService.apiurl + '/ctndetail/CheckIfMobileNumberExist?mobilenumber=' + mobilenumber + '&SIMNumber=' + simnumber)
            .toPromise();
    }

    AssignAsset(model: AssignAssetModel) {

        let body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/ctndetail/AssignAsset', body);
    }

    GetEffectiveDateColumn(): Promise<CTNChangeLogColumnModel[]> {
        return this.http.get<CTNChangeLogColumnModel[]>(this.appSettingService.apiurl + '/ctndetail/GetEffectiveDateColumn')
            .toPromise();
    }
    //addAsset(addAsset: AddAsset) {


    //    var body = JSON.stringify(addAsset);
    //    return this.http.post(this.appSettingService.apiurl+ '/Asset/AddAsset', body)
    //        .map((response: Response) => response.json());
    //}
    GetUserCTNDetails(userGuid: string): Promise<UserCTNViewModel> {
        return this.http.get<UserCTNViewModel>(this.appSettingService.apiurl + '/ctndetail/GetUserCTNDetails?userGuid=' + userGuid)
            .toPromise();
    }

    LoadMobileChangeReport(fromdate: string, todate: string) {
        return this.http.get<CtnChangeReportViewModel[]>(this.appSettingService.apiurl + '/Report/LoadMobileChangeReport?fromdate=' + fromdate + '&todate=' + todate)
            .toPromise();
    }
    //this will load the the list of users from user table
    getMobileForCareFilter(text: string, active: boolean = null): Promise<CareMobileFilterViewModel[]> {
        return this.http.get<CareMobileFilterViewModel[]>(this.appSettingService.apiurl + '/ctndetail/LoadMobileListForCareFilterAsync?text=' + text + "&active=" + active)
            .toPromise();
    }

    getCTNDetailByGuidForCareEnquiryAsync(ctnGuid: string): Promise<CareViewModel> {
        return this.http.get<CareViewModel>(this.appSettingService.apiurl + '/ctndetail/GetCTNDetailByGuidForCareEnquiryAsync?ctnGUID=' + ctnGuid
        )
            .toPromise();
    }

    getSpareNumberReport(allocated: boolean, networkguid: string, billingplatformguid: string): Promise<any> {
        return this.http.get<any>(this.appSettingService.apiurl + '/CTNDetail/GetSpareNumberReport?allocated=' + allocated + '&networkguid=' + networkguid + '&billingplatformguid=' + billingplatformguid).
            toPromise();
    }

    /**
	 * get<> the url of API
	 */
    getBulkAddCTNUploadUrl() {
        return this.appSettingService.apiurl + '/CTNDetail/UploadAddBulkCTNData';
    }

    getEditBulkCTNUploadUrl() {
        return this.appSettingService.apiurl + '/CTNDetail/UploadEditBulkCTNData';
    }

    validateHeaderAddBulkCTNFiles(batchId: string): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/CTNDetail/ValidateHeaderAddBulkCTNFileAsync?batchId=' + batchId)
            .toPromise();
    }

    validateHeaderEditBulkCTNFiles(batchId: string): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/CTNDetail/ValidateHeaderEditBulkCTNFileAsync?batchId=' + batchId)
            .toPromise();
    }

    insertInRawTable(batchId: string): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/CTNDetail/InsertINRawTablesAsync?batchId=' + batchId)
            .toPromise();
    }

    insertEditCTNInRawTable(batchId: string, selectedColumns: EditBulkCTNRequiredColumns[]): Promise<GenericTupleModelBoolAndString> {
        let body = {
            batchId: batchId,
            selectedColumns: selectedColumns
        }
        return this.http.post<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/CTNDetail/InsertEditCTNInRawTablesAsync', body)
            .toPromise();
    }

    validateAddBulkCTNData(batchId: string): Promise<AddBulkCTNValidateViewModel> {
        return this.http.get<AddBulkCTNValidateViewModel>(this.appSettingService.apiurl + '/CTNDetail/ValidateAddBulkCTNDataAsync?batchId=' + batchId)
            .toPromise();
    }

    validateEditBulkCTNData(batchId: string): Promise<EditBulkCTNValidateViewModel> {
        //let body = {
        //    batchID: batchId
        //}
        let body = JSON.stringify(batchId);
        return this.http.post<EditBulkCTNValidateViewModel>(this.appSettingService.apiurl + '/CTNDetail/ValidateEditBulkCTNDataAsync', body)
            .toPromise();
    }


    getTrackUnallocateReport(Startdate: string, todate: string, IsReturingProduct: boolean): Promise<CTNUnallocationReturn[]> {
        return this.http.get<CTNUnallocationReturn[]>(this.appSettingService.apiurl + '/Report/LoadUnallocatedAndReturn?startdate=' + Startdate + '&enddate=' + todate + '&isreturingproduct=' + IsReturingProduct).
            toPromise();
    }

    InsertBulkCTNDataInCTNDetail(batchid: string) {

        var body = JSON.stringify(batchid);
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/InsertBulkCTNDataInCTNDetailAsync', body);
    }

    InsertEditBulkCTNDataInCTNDetail(batchid: string) {

        var body = JSON.stringify(batchid);
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/InsertEditBulkCTNDataInCTNDetailAsync', body);
    }

    GetAddBulkCTNProtoType() {
        let options = { responseType: 'Blob' as 'json' };
        return this.http.get(this.appSettingService.apiurl + '/CTNDetail/GetAddBulkCTNProtoType', options);
    }

    getEditBulkCTNProtoType() {
        let options = { responseType: 'Blob' as 'json' };
        return this.http.get(this.appSettingService.apiurl + '/CTNDetail/GetEditBulkCTNProtoType', options);
    }

    getTrackUnallocateDetailReport(unallocatereturnid: number): Promise<CTNUnallocateAndReturnDetailViewModel> {
        return this.http.get<CTNUnallocateAndReturnDetailViewModel>(this.appSettingService.apiurl + '/Report/LoadUnallocatedAndReturnDetails?unallocatereturnid=' + unallocatereturnid).
            toPromise();
    }

    //getEditCTNColumnDeails(): Promise<EditBulkCTNRequiredColumns[]> {
    //    return this.http.get<>(this.appSettingService.apiurl+ '/CTNDetail/GetEditCTNColumnListAsync').
    //        toPromise().
    //        then(data => data.json() as EditBulkCTNRequiredColumns[]);
    //}

    showBars(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/CTNDetail/ShowBars')
            .toPromise();
    }

    ShowCtnNotes(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/CTNDetail/ShowCtnNotes')
            .toPromise();
    }

    CheckIsSpareReallocateActive(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/CTNDetail/CheckIsSpareReallocateActive')
            .toPromise();
    }

    deleteSpareNumber(mobilenumber: string) {
        var body = JSON.stringify(mobilenumber);
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/DeleteSpareNumber', body);
    }

    updateSpareNumberOrderRefNumber(orderrefno: string, mobilenumber: string) {

        let item = {
            orderrefno: orderrefno,
            mobilenumber: mobilenumber
        };
        return this.http.post(this.appSettingService.apiurl + '/CTNDetail/UpdateSpareNumberOrderRefNumber', item);
    }


}