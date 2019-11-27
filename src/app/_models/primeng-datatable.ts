import { SelectItem } from 'primengdevng8/api';
export class Column {
    field: string;
    header: string;
    sortable: boolean;
    hidden: boolean;
    filter: boolean;
    ddfilter: boolean;
    ddfilterarray: SelectItem[];
    dd_selectedarray: SelectItem[];
    filtermode: string;
    guid?: string;
}