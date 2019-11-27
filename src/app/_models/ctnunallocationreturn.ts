export class CTNUnallocationReturn {

    public id: number;
    public name: string;
    public request: string;
    public email: string;
    public staffid: string;
    public mobilenumber: string;
    public networkdescription: string;
    public productdescription: string;
    public reportinggroup1: string;
    public reportinggroup2: string;
    public reportinggroup3: string;
    public reportinggroup4: string;
    public reportinggroup5: string;
    public reportinggroup6: string;
    public cancellationreason: string;
    public createdDate: string;
    public returnstatus: string;
    public returnproduct: string;
    public imei: string;
}

export class CTNUnallocateAndReturnDetailViewModel extends CTNUnallocationReturn {
    public reqesutedby: string;
    public collectiondate: Date;
    public contactname: string;
    public contactnumber: string;
    public address1: string;
    public address2: string;
    public address3: string;
    public address4: string;
    public city: string;
    public postcode: string;
    public country: string;
    public addresscombined: string;
}