export class AddAsset {
    productid: number;
    imei: string;
    serialnumber: string;
    assetsupplierguid: string;
    assetownershipid: number;
    ctndetailguid: string;
    simnumber: string;
    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;
    userguid: string;
    email: string;
    staffid: string;
    dateassigned?: Date;
    purchasedate?: Date;
    purchaseprice?: number;
    ponumber: string;
    ordernumber: string;
    assetguid: string;
    productdescription: string;
    isaddandassignasset: boolean;
    userid: number;
    reportinggroup1id: number;
    reportinggroup2id: number;
    reportinggroup3id: number;
    reportinggroup4id: number;
    reportinggroup5id: number;
    reportinggroup6id: number;
    registerid: string;
}

export class UpdateAssetViewModel extends AddAsset {
    device: string;
    mobilenumber: string;
    employeename: string;
    networkdescription: string;
    billingplatformdescription: string;
    assetlocationdescription: string;
    assetstatusdescription: string;

    employeeemail: string;
    employeestaffid: string;
    assetownershipdescription: string;
    reportinggroup1description: string;
    reportinggroup2description: string;
    reportinggroup3description: string;
    reportinggroup4description: string;
    reportinggroup5description: string;
    reportinggroup6description: string;
    dateassigneddisplay: string;
    ordernumber: string;
    purchasedatedisplay: string;
    supplierdescription: string;
    assetlocationid: number;
    assetstatusid: number;
    isuserdeattch: boolean;
    isctndeattch: boolean;
    selectedmobilemployeename: string;
    optionselection: boolean;
    iseditonly: boolean = false;
    note: string;
}