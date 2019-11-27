import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { AssetSummaryViewModel, AssetDropdownViewModel } from '../_models/asset/asset-summary';
import { AssetLinkSourceViewModel } from '../_models/asset/asset-linksource';
import { AssetOwnership } from '../_models/asset/assetownership';
import { AssetChangeLogViewModel } from '../_models/asset/asset-changelog';
import { AssetFilter } from '../_models/asset/asset-filter';
import { AddAsset, UpdateAssetViewModel } from '../_models/asset/addasset';

import { AssetStatus } from '../_models/asset/assetstatus';
import { AssetLocation } from '../_models/asset/assetlocation';
import { AssetChangeReportViewModel } from '../_models/assetchangereportviewmodel';
import { GenericTupleModelBoolAndString } from '../_models/generictuplemodelboolandstring';
import { AddBulkAssetValidateViewModel } from '../_models/bulk-upload/addbulkassetvalidateviewmodel';
import { ProductViewModel } from '../_models/order/orderconfirmviewmodel';
import { RefurbishedProduct } from '../_models/refurbishedproduct';

@Injectable({
    providedIn: 'root'
})
export class AssetService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    GetAssetSummaryData(iscompanyowned: boolean, isemployeeowned: boolean, isarchivedasset: boolean, linktype: string, linksourceguid: string, rtypeguid: string): Promise<AssetSummaryViewModel[]> {
        return this.http.get<AssetSummaryViewModel[]>(this.appSettingService.apiurl + '/asset/GetAssetSummaryData?IsCompanyOwned=' + iscompanyowned + '&IsEmployeeOwned=' + isemployeeowned + '&IsArchived=' + isarchivedasset
            + '&linktype=' + linktype
            + '&linksourceguid=' + linksourceguid
            + '&rtypeguid=' + rtypeguid
        ).toPromise();
    }

    GetAssetFleetGroupBy(iscompanyowned: boolean, isemployeeowned: boolean, isarchivedasset: boolean, linktype: string, linksourceguid: string, rtypeguid: string): Promise<AssetLinkSourceViewModel[]> {
        return this.http.get<AssetLinkSourceViewModel[]>(this.appSettingService.apiurl + '/asset/GetAssetFleetGroupBy?IsCompanyOwned=' + iscompanyowned + '&IsEmployeeOwned=' + isemployeeowned + '&IsArchived=' + isarchivedasset
            + '&linktype=' + linktype
            + '&linksourceguid=' + linksourceguid
            + '&rtypeguid=' + rtypeguid
        ).toPromise();
    }

    GetOwnershipList(): Promise<AssetOwnership[]> {
        return this.http.get<AssetOwnership[]>(this.appSettingService.apiurl + '/asset/GetOwnershipListAsync')
            .toPromise();
    }

    addAsset(addAsset: AddAsset) {


        var body = JSON.stringify(addAsset);
        return this.http.post(this.appSettingService.apiurl + '/Asset/AddAsset', body);
    }

    GetAssetDetails(assetGuid: string): Promise<UpdateAssetViewModel> {
        return this.http.get<UpdateAssetViewModel>(this.appSettingService.apiurl + '/asset/GetAssetDetails?assetGuid=' + assetGuid
        )
            .toPromise();
    }

    GetAllAssets(): Promise<AssetDropdownViewModel[]> {
        return this.http.get<AssetDropdownViewModel[]>(this.appSettingService.apiurl + '/asset/GetAllAssets'
        )
            .toPromise();
    }

    GetAssetChangeLog(assetguid: string): Promise<AssetChangeLogViewModel[]> {
        return this.http.get<AssetChangeLogViewModel[]>(this.appSettingService.apiurl + '/asset/GetAssetChangeLog?assetguid=' + assetguid
        )
            .toPromise();
    }

    IsShowPOAgainstAssetActive(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/asset/IsShowPOAgainstAssetActive'
        )
            .toPromise();
    }

    getAssetByFilter(name: string): Promise<AssetFilter[]> {
        return this.http.get<AssetFilter[]>(this.appSettingService.apiurl + '/asset/LoadAssetListByFilterAsync?name=' + name)
            .toPromise();
    }

    getAssetStatusList(): Promise<AssetStatus[]> {
        return this.http.get<AssetStatus[]>(this.appSettingService.apiurl + '/asset/GetAssetStatusListAsync')
            .toPromise();
    }

    getAssetLocationByAssetStatusID(assetStatusID: number): Promise<AssetLocation[]> {
        return this.http.get<AssetLocation[]>(this.appSettingService.apiurl + '/asset/GetAssetLocationListAsync?assetStatusID=' + assetStatusID)
            .toPromise();
    }

    getAssetOwnership(assetStatusID: number): Promise<AssetLocation[]> {
        return this.http.get<AssetLocation[]>(this.appSettingService.apiurl + '/asset/GetAssetLocationListAsync?assetStatusID=' + assetStatusID)
            .toPromise();
    }

    updateAsset(model: UpdateAssetViewModel) {
        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/asset/UpdateAsset', model);
    }


    getAssetByAllocationStatus(text: string, allocationstatus: string, ctnguid: string): Promise<AssetFilter[]> {
        return this.http.get<AssetFilter[]>(this.appSettingService.apiurl + '/asset/LoadAssetListByAllocationStatusAsync?text=' + text + '&allocationStatus=' + allocationstatus + '&ctnDetailGuid=' + ctnguid)
            .toPromise();
    }

    loadAssetChangeReport(fromdate: string, todate: string) {
        return this.http.get<AssetChangeReportViewModel[]>(this.appSettingService.apiurl + '/Report/LoadAssetChangeReport?fromdate=' + fromdate + '&todate=' + todate)
            .toPromise();
    }


    reassignAsset(model: UpdateAssetViewModel) {
        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/asset/ReassignAssetAsync', model);
            
    }

    getBulkAddAssetUploadUrl() {
        return this.appSettingService.apiurl + '/Asset/UploadAddBulkAssetDataAsync';
    }

    validateHeaderAddBulkAssetFiles(batchId: string): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/Asset/ValidateHeaderAddBulkAssetFileAsync?batchId=' + batchId)
            .toPromise();
    }

    insertInAddBulkAssetRawTable(batchId: string): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/Asset/InsertInAddBulkAssetRawTableAsync?batchId=' + batchId)
            .toPromise();
    }

    validateAddBulkAssetData(batchId: string): Promise<AddBulkAssetValidateViewModel> {
        return this.http.get<AddBulkAssetValidateViewModel>(this.appSettingService.apiurl + '/Asset/ValidateAddBulkAssetDataAsync?batchId=' + batchId)
            .toPromise();
    }

    GetAddBulkAssetProtoType() {
        let options = { responseType: 'Blob' as 'json' };
        return this.http.get(this.appSettingService.apiurl + '/Asset/GetAddBulkAssetProtoTypeAsync', options);
    }
    InsertBulkAssetDataInAsset(batchid: string) {

        var body = JSON.stringify(batchid);
        return this.http.post(this.appSettingService.apiurl + '/Asset/InsertBulkAssetDataInAssetAsync', body);
    }

    ShowSupplier(): Promise<boolean> {

        return this.http.get<boolean>(this.appSettingService.apiurl + '/asset/ShowSupplier')
            .toPromise();
    }

    loadDistinctAssetProductList(): Promise<ProductViewModel[]> {

        return this.http.get<ProductViewModel[]>(this.appSettingService.apiurl + '/asset/LoadDistinctAssetProductListAsync')
            .toPromise();
    }
    getIMEIByProductID(productID: number, imei: string): Promise<RefurbishedProduct[]> {

        return this.http.get<RefurbishedProduct[]>(this.appSettingService.apiurl + '/asset/GetIMEIByProductIDAsync?productID=' + productID + '&imei=' + imei)
            .toPromise();
    }
    addRefurbishedProduct(model: RefurbishedProduct) {
        var body = JSON.stringify(model);
        return this.http.post(this.appSettingService.apiurl + '/asset/AddRefurbishedProductAsync', model);
    }
    loadRefurbishedAssetList(productID: number, allocationType: boolean): Promise<RefurbishedProduct[]> {
        return this.http.get<RefurbishedProduct[]>(this.appSettingService.apiurl + '/asset/LoadRefurbishedAssetListAsync?productID=' + productID + '&allocationType=' + allocationType)
            .toPromise();
    }

    loadRefurbishedAssetProductList(): Promise<RefurbishedProduct[]> {
        return this.http.get<RefurbishedProduct[]>(this.appSettingService.apiurl + '/asset/LoadRefurbishedAssetProductListAsync')
            .toPromise();
    }

    isAssetRegisterIDActive(): Promise<boolean> {
        return this.http.get<boolean>(this.appSettingService.apiurl + '/asset/IsAssetRegisterIDActiveAsync')
            .toPromise();
    }
}

