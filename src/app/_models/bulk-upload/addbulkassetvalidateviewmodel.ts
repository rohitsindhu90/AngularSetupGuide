

export class AddBulkAssetValidateViewModel {
    public batchid: string;
    public addassetrawviewmodellst: AddBulkAssetViewModel[];
}
export class AddBulkAssetViewModel {
    public id: number;
    public assetname: string;
    public imei: string;
    public serialnumber: string;
    public purchasedate: string;
    public supplier: string;
    public ownership: string;
    public mobilenumber: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
}