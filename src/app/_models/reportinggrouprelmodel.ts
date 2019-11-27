import { ReportingGroupBaseViewModel } from './reporting-group-base';
import { SelectItem } from 'primengdevng8/api';

export class ReportingGroupRel {
    parentitem: ReportingGroupRelDetail
    childitem: ReportingGroupRelDetail
}

export class ReportingGroupRelDetail {
    item: ReportingGroupBaseViewModel
    items: SelectItem[];
    selecteditem: ReportingGroupBaseViewModel;
    selecteditems: ReportingGroupBaseViewModel[];
    childitems: ReportingGroupBaseViewModel[];
    childname: string;
    ischildrequired: boolean;
}

