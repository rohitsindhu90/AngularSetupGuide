export class ScheduleReportViewModel {
    public id: number;
    public name: string;
    public frequency: number;
    public frequencydescription: string;
    public schedulereportguid: string;
    public active: boolean;
    public schedulereportemails: ScheduleReportEmailViewModel[];
    public schedulereportrels: ScheduleReportRelViewModel[];
    public otherEmails: string;
}

export class ScheduleReportRelViewModel {
    public id: number;
    public schedulereportid: number;
    public featureid: number;
}

export class ScheduleReportEmailViewModel {
    public id: number;
    public userid: number;
    public email: string;
    public schedulereportid: number;
}

export class SavedReportViewModel {
    public reportname: string;
    public createdby: string;
    public createddate: string;
    public frequencydescription: string;
    public schedulereportguid: string;
    public recipientsemail: string;
    public active: boolean;
    public viewreport: string;
    public viewreportcount: number;
    public viewreporturl: string;
    public createddatestring: string;
}

export class ViewReportViewModel {
    public name: string;
    public url: string;
}

export class SendNowViewModel {
    public fromemail: string;
    public toemail: string;
    public latestinvoicemonth: string;
    public clientname: string;
    public reportname: string;
}