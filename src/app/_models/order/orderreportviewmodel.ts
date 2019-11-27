export class OrderReportViewModel {
    public orderlist: OrderViewModel[];
    public newconnectioncount: number;
    public portconnectioncount: number;
    public spareconnectioncount: number;
    public hardwarecount: number;
    public accessoriescount: number;

    public stockcount: number;
}
export class OrderViewModel {
    public ordertypeid: number;
    public date: Date;
    public dateformatstring: string;
    public ponumber: string;
    public contactnumber: string;
    public deliveryfaoemail: string;
    public orderreferencenumber: string;
    public totalcost: number;
    public inccostvat: number;
    public deliveryfao: string;
    public orderstatus: number;
    public orderstatusstring: string;
    public deliveryaddress: string;
    public createdby: string;
    public orderdetails: OrderDetailViewModel[];
    public totalqunatity: number;
    public orderlines: number;
    public ordertypedesc: number;
}
export class OrderDetailViewModel {
    public saletypeid: number;
    public ordertype: string;
    public employeename: string;
    public employeeemail: string;
    public staffid: string;
    public networkdescription: string;
    public reportinggroup1description: string;
    public reportinggroup2description: string;
    public reportinggroup3description: string;
    public reportinggroup4description: string;
    public reportinggroup5description: string;
    public reportinggroup6description: string;
    public bendescription: string;
    public device: string;
    public quantity: number;
    public totalprice: number;
    public totalpriceincvat: number;
    public tariffname: string;
    public tariffcost: string;
}
