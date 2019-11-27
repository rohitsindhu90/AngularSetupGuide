export class NewCompanySetUpViewModel {
    public name: string;
    public dns: string;
    public ip: string;
    public emailcc: string;
    public emailto: string;
    public batchid: string;
    public isemailenable: boolean;
}


export class NewClientValidateViewModel {
    public newcompanysetupmodel: NewCompanySetUpViewModel;
    public lstmaindataimportviewmodel: NewClientMainDataImportViewModel[];
    public lstaddressimportviewmodel: NewClientAddressImportViewModel[];
    public lsttariffimportviewmodel: NewClientTariffImportViewModel[];
    public lstproductimportviewmodel: NewClientProductImportViewModel[];
}

export class NewClientMainDataImportViewModel {
    public id: number;
    public mobilenumber: string;
    public name: string;
    public staffid: string;
    public email: string;
    public reportinggroup1: string;
    public reportinggroup2: string;
    public reportinggroup3: string;
    public reportinggroup4: string;
    public reportinggroup5: string;
    public reportinggroup6: string;
    public device: string;
    public imei: string;
    public serialnumber: string;
    public sim: string;
    public tariff: string;
    public network: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
    public billingplatform: string;
    public ben: string;
    public ban: string;
}
export class NewClientAddressImportViewModel {
    public id: number;
    public addressshortname: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public address4: string;
    public city: string;
    public county: string;
    public country: string;
    public postcode: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
}
export class NewClientTariffImportViewModel {
    public id: number;
    public tariffname: string;
    public linerental: string;
    public cashback: string;
    public voiceordata: string;
    public network: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
    public billingplatform: string;
    public tariffstatus: string;
}
export class NewClientProductImportViewModel {
    public id: number;
    public productname: string;
    public cost: string;
    public connectiontype: string;
    public producttype: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
}