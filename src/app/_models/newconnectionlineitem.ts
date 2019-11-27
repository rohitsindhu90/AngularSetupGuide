import { DeviceFilter } from './order/DeviceFilter';

export class NewConnectionLineItemModel {
    productid: number;
    producttypeid: number;
    refurbisheddeviceid: number;
    device: any;
    refurbisheddevice: any
    refurbisheddevicetypeid: number;
    quantity: number;
    validationmaxquantity: number;
    devicefilter: DeviceFilter[];
    refurbishedinvalid: boolean;
}