export class CompanyMaintenanceViewModel {
    companyguid: string;
    teamid: number;
    companydescription: string;
    active?: boolean;
    bdmlist: number[] = [];
    sysadminsupportuserlist: number[] = [];
    invoiceuploademailuserlist: string[] = [];
}
