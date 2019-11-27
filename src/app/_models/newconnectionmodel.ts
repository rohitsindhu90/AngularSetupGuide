import { NewConnectionLineItemModel } from './newconnectionlineitem';
import { UserFilter } from '../_models/user-filter';
import { SelectItem } from 'primengdevng8/api';

export class NewConnectionModel {
    orderid: number;
    networkguid: string;
    billingplatformguid: string;
    connectiontypeid: number;
    tariffguid: string;
    ordertypeid: number;
    mobilenumber: string;
    banguid: string;
    pacnumber: string;
    benguid: string;
    requestedportdate: string;
    userguid: number;
    useremail: string;
    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;
    lineitems: NewConnectionLineItemModel[];
    useexistingsim: boolean;
    simnumber: string;
    userfilter: UserFilter;
    orderguid: string;
    reportinggroup1id: number;
    reportinggroup2id: number;
    reportinggroup3id: number;
    reportinggroup4id: number;
    reportinggroup5id: number;
    reportinggroup6id: number;
}

export interface SelectItemCustom extends SelectItem {
    id: number;
}