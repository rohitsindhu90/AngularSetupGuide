import { InvoiceCTNRaw } from './invoicectnraw';
import { InvoiceCTNDetailRaw } from './invoicectndetailraw';
import { InvoiceCTNChargeRaw } from './invoicectnchargeraw';
import { InvalidInvoiceNotesViewModel } from './invalidinvoicenotesviewmodel';

export class InvalidInvoiceRawViewModel {
    public invoicectnrawlist: InvoiceCTNRaw[];
    public invoicectndetailrawlist: InvoiceCTNDetailRaw[];
    public invoicectnchargerawlist: InvoiceCTNChargeRaw[];
    public invalidinvoicenotesviewmodellist: InvalidInvoiceNotesViewModel[];
}