
import { ReportingGroupType } from "../../_services/enumtype";

export class ReportingGroupViewModel {
    public id: number;
    public reportinggroupguid: string;
    public description: string;
    public displayname: string;
    public active: boolean;
    public isrequired: boolean;
    public ponumber: boolean;
    public reportinggrouptypecollection: ReportingGroupTypeViewModel[];
}

export class ReportingGroupTypeViewModel {
    public id: number;
    public typeguid: string;
    public typeabbr: string;
    public typedescription: string;
}