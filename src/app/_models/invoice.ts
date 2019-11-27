import {CallClassViewModel } from './report/call-class-report.model'

export class InvoiceCTNCalculationViewModel {
    public agreedlinerental: number;
    public monthlinerental: number;
    public totalusagecost: number;
    public totalcost: number;
    public usagecredit: number;
    public linerentalcredit: number;
    public totallinerental: number;
    public othercredits: number;
    public othercharges: number;
    public othercharge: number;
    public usagecharge: number;
}

export class Invoice extends InvoiceCTNCalculationViewModel{
    public invoicedateid: number;
    public invoicectnguid: string;
    public invoicedateguid: string;
    public mobilenumber: string;
    public invoicetariff: string;
    public cmtariff: string;
    public employeename: string;
    public username: string;
    public reportinggroup1: string;
    public reportinggroup2: string;
    public reportinggroup3: string;
    public reportinggroup4: string;
    public reportinggroup5: string;
    public reportinggroup6: string;

    public ban: string;
    public banguid: string;
    public ben: number;
    public bendescription: string;
    public eligibleminutes: number;
    public eligiblesms: number;
    public eligibledata: number;
   
    public nousage: boolean;
    public eligiblempay: number;
    public networkid: number;
    public billingplatformid: number;
    public networkdescription: string;
    public networkimagesmall: string;
    public billingplatformdescription: string;
    public networkguid: string;
    public billingplatformguid: string;
    public benguid: string;
    public description: string;
    public count: number;
    public linktype: string;
    public linksourceguid: string;
    public minutescost: number;
    public minutesduration: string;
    public data: number;
    public datacost: number;
    public text: number;
    public textcost: number;
    public roameddata: number;
    public roamedduration: string;
    public roamedcost: number;
    public device: number;
    public staffid: string;
}

export class InvoiceCTNGraphViewModel extends InvoiceCTNCalculationViewModel {
    public networkid: number;
    public networkdescription: string;
    public calltype: string;
    public description: string;
}