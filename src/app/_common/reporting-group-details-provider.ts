import { Column } from '../_models/primeng-datatable';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';



export class ReportingGroupDetailsProvider {

    static GetColumns(data: ReportingGroupViewModel[]): Column[] {
        let columns: Column[]=[];
        data.forEach(x => {
            columns.push({
                field: x.description.toLowerCase(),
                header: x.displayname,
                hidden: false,
                filter: true,
                sortable: true,
                ddfilter: false,
                ddfilterarray: [],
                dd_selectedarray: [],
                filtermode: "contains",
                guid : x.reportinggroupguid,                
            });

        });
        return columns;

    }

}