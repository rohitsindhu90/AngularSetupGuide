import { DeviceFilter } from '../../_models/order/DeviceFilter';
import { MobileFilter } from "../../_models/mobile-filter";
import { UserFilter } from '../../_models/user-filter';
import { RefubrishedDeviceFilter } from '../../_models/order/RefubrishedDeviceFilter';

export class HardwareViewModel {
    public isrefurbished: boolean;
    public productid?: number;
    public refurbisheddeviceid?: number;
    public cost: number;
    public quantity: number = 0;
    public totalcost: number;
    public isstockonly: boolean = false;
    public mobilenumber: string;
    //public userguid: string;
    public name: string;
    public reportinggroup1id?: number;
    public reportinggroup2id?: number;
    public reportinggroup3id?: number;
    public reportinggroup4id?: number;
    public reportinggroup5id?: number;
    public reportinggroup6id?: number;
    public isreplaceexistingdevice?: boolean = null;
    public ctndetailid: number;
    public producttypeid?: number;
    public userid: number;

    public reportinggroup1guid: string;
    public reportinggroup2guid: string;
    public reportinggroup3guid: string;
    public reportinggroup4guid: string;
    public reportinggroup5guid: string;
    public reportinggroup6guid: string;


    public selecteddevice: any;

    public deviceFilterList: DeviceFilter[];
    public deviceFilter: DeviceFilter;


    public selectedrefurbisheddevice: any;
    public refubrishedDeviceFilter: RefubrishedDeviceFilter[];

    public mobilefilter: any;
    public mobileFilterList: MobileFilter[];
    public userFilterList: UserFilter[];
    public userfilter: UserFilter;
    public ordertotalcost: number;

    public refurbishedInvalid: boolean;
    public validationMaxQuantity: number;

    reportinggroup1Array: any[];
    reportinggroup2Array: any[];
    reportinggroup3Array: any[];
    reportinggroup4Array: any[];
    reportinggroup5Array: any[];
    reportinggroup6Array: any[];


    public isstockonlyReadOnly: boolean = false;
}
