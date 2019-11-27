import { CTNDetailModel } from './ctn-details';
import { AddressModel } from '../_models/address';

export class UnallocateModel extends CTNDetailModel {
    returningdevice: number;
    unallocatereason: string;
    collectiondate: Date;
    selectedaddress: number;
    otheraddress: boolean;
    contactname: string;
    contactnumber: string;
    addresslist: AddressModel[];
    newaddress: AddressModel
}