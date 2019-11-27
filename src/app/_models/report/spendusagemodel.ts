import { InvoiceCTNCalculationViewModel } from '../invoice';

export class SpendUsageViewModel extends InvoiceCTNCalculationViewModel{
    criteriadescription: string;
    criteriaguid: string;
    quantity: number;
    eligibleminutes: number;
    eligiblesms: number;
    eligibledata: number;
}
