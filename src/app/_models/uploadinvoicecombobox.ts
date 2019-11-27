import { Company } from '../_models/company';
import { Network } from '../_models/network';
import { BillingPlatform } from '../_models/billingplatform';
import { InvoiceDateWithFileListModel } from '../_models/InvoiceDateWithFileListModel';

export class UploadInvoiceComboBox {
    companylist: Company[] = [];
    networklist: Network[] = [];
    billingplatformlist: BillingPlatform[] = [];
    invoicemonthlist: InvoiceDateWithFileListModel = new InvoiceDateWithFileListModel();
}
