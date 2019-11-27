export class CallClassItemisedViewModel {
    public eurozonedetails: EuroZoneDetails[];
    public callclassitemised: CallClassItemised[];
}
export class EuroZoneDetails {
    public eurozone: string;
    public usage: number;
}
export class CallClassItemised {
    public calldate: string;
    public calltime: string;
    public description: string;
    public mobilenumber: string;
    public username: string;
    public duration: string;
    public minutes: number;
    public datavolume: number;
    public usagecharge: number;
    public numberdialledapn: string;
    public destination: string;
    public calltype: string;
    public subcalltype: string;
    public notes: string;
    public countryoforigin: string;
    public eurozone: string;
}