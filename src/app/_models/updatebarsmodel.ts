import { CTNDetailModel } from './ctn-details';

export class UpdateBarsModel extends CTNDetailModel {
    internationalbarauthorizedby: string;
    roamingbarauthorizedby: string;
    databarauthorizedby: string;
    eventtype: string;
}