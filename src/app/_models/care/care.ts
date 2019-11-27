export class CareViewModel {
    id: number;
    mobilenumber: string;
    iccid: string;
    userid: number;
    staffid: string;
    emailaddress: string;
    name: string;
    reportinggroup1id: number;
    reportinggroup2id: number;
    reportinggroup3id: number;
    reportinggroup4id: number;
    reportinggroup5id: number;
    reportinggroup6id: number;

    reportinggroup1description: string;
    reportinggroup2description: string;
    reportinggroup3description: string;
    reportinggroup4description: string;
    reportinggroup5description: string;
    reportinggroup6description: string;
    productid: number;
    productdescription: string;
    imei: string;
    supplierid: number;
    supplierdescription: string;
    issuetypeid: number;
    reportreasonid: number;
    reporttypeid: number;
    notes: string;

    faultdescription: string;
    requestedby: string;
    careref: string;
    createddate: Date;
    issuetypedescription: string;
    reporttypedescription: string;
    networkimagesmall: string;
    networkdescription: string;
    billingplatformdescription: string;
    reportreason: string;
    createddatestringformat: string;
    networkfaultdetaillist: NetworkFaultDetailViewModel[]
}

export class NetworkFaultDetailViewModel {
    faultdate?: Date;
    mobilenumber?: string;
    faulttime?: Date;
    faultdatetimestring: string;
}