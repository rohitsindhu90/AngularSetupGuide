export class OrderConfirmViewModel {

    productlist: ProductViewModel[];
    tariffdescription: string;
    tariffprice: number;
    tariffquantity: number;
    totalcost: number;

    orderstatus: number;
    orderguid: string;
    ispoactive: boolean;
    isporequired: boolean;
    purchaseordernumber: string;
    orderreferencenumber: string;
    saletypeid: number;
    ordertypeid: number;
    ispaymentmethodactive: boolean;
    paymentmethodid: number;
    isauthorizedbyactive: boolean;
    isauthorizedbyrequired: boolean
    authorizedby: string;
    deliveryfao: string;
    contactnumber: string;
    contactemail: string;
    isotheraddress: boolean;
    deliveryaddressid: number;
    otheraddress1: string;
    otheraddress2: string;
    otheraddress3: string;
    otheraddress4: string;
    othertown: string;
    othercounty: string;
    othercountry: string;
    otherpostcode: string;
    completeaddress: string;
    deliverynotes: string;
    issaveaddress: boolean;
    addressshortname: string;
}


export class ProductViewModel {
    productid: number;
    productdescription: string;
    quantity: number

}