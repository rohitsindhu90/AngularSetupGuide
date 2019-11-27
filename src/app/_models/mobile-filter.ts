
export class MobileFilter {
    ctndetailid: number;
    ctndetailsguid: string;
    mobilenumber: string;
    status: string;
    staffname: string;
    reportinggroup: string;
    //   userguid: string;
}


export class CareMobileFilterViewModel extends MobileFilter {
    imeinumber: string;
    productdescription: string;

}