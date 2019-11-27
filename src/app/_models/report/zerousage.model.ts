export class ZeroUsageViewModel {
    mobilenumber: string;

    networkdescription: string;

    networkimagesmall: string;

    billingplatformdescription: string;

    employeename: string;

    reportinggroup1description: string;

    reportinggroup2description: string;

    reportinggroup3description: string;

    reportinggroup4description: string;

    reportinggroup5description: string;

    reportinggroup6description: string;

    bandescription: string;

    bendescription: string;

    ctndetailsguid: string;

    totalcost: number;

    benguid: string;

    banguid: string;

    tariffdescription: string;

    monthwisedetails: MonthWiseDetails[];

    nousagemonthcount: number;

    tariffcost: number;
    device: string;
    statusdescription: string;
}
export class MonthWiseDetails {
    public mobilenumber: string;
    public bendetailid: number;
    public startdate: Date;
    public month: string;
    public nousage: boolean;
    public nousagestring: string;
} 