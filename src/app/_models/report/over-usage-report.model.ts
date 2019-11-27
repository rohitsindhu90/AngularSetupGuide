export class OverUsageReportModel {
    public company: string;
    public network: string;
    public billingplatform: string;
    public status: string;
    public dataallowance: number;
    public actualdataused: number;
    public datausagedifference: number;
    public monthname: string;
    public companyguid: string;
    public networkguid: string;
    public billingplatformguid: string;
    public createddate: Date;
    public createddatestring:string;
    public networkid: any;
    public billingplatformid: any;
}
