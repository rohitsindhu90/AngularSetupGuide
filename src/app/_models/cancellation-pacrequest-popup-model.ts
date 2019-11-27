import { CTNDetailModel} from './ctn-details';

export class CancellationPACRequestModel extends CTNDetailModel {
    notes: string;
    requestdate: Date;
    transactiontype: number;
    eventtype: number;
}