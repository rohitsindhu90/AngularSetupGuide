

export class AddBulkUserValidateViewModel {
    public batchid: string;
    public adduserrawviewmodellst: AddBulkUserViewModel[];
}
export class AddBulkUserViewModel {
    //public id: number;
    //public Username: string;
    //public imei: string;
    //public serialnumber: string;
    //public purchasedate: string;
    //public supplier: string;
    //public ownership: string;
    //public mobilenumber: string;
    public id: number;
    public employeename: string;
    public email: string;
    public staffid: string;
    public status: string;
    public role: string;
    public batchid: string;
    public excelrownumber: number;
    public errormessage: string;
}