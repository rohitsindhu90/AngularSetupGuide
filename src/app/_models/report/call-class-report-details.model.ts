import { Invoice } from '../invoice';
export class CallClassReportViewModel extends Invoice {
    username: string;
    //department: string;
    //costcentre: string;
    //ben: number;
    //currenttariff: string;
    //mobilenumber: string;

    //invoicectn: Invoice;
    gprscost: number;
    gprsdata: number;
    roamedgprscost: number;
    roamedgprsdata: number;
    roamedcost: number;
    //roamedduration: number;
    intlukcost: number;
    intlukduration: number;
    smsoutforeignlegcost: number;
    smsoutforeignlegvolumne: number;
    roamedincomingsmscost: number;
    roamedincomingsmsvolume: number;
    nationalcost: number;
    nationalduration: number;
    samenetworkcost: number;
    samenetworkduration: number;
    othernetworkcost: number;
    othernetworkduration: number;
    directoryenquiriescost: number;
    directoryenquiriesduration: number;
    smsoutcost: number;
    smsoutvolume: number;
    premiumsmscost: number;
    premiumsmsvolume: number;
    voicemailcost: number;
    voicemailduration: number;
    premiumcallcost: number;
    premiumcallduration: number;
    roamingreceivedcost: number;
    roamingreceivedduraiton: number;
    personalnumbercost: number;
    personalnumberduration: number;
    othercost: number;
    otherduration: number;
    mmsoutcost: number;
    mmsoutvolume: number;
    mpaycost: number;
    mpayvolume: number;
    bundleeligibilitycost: number;
    bundleeligibilitydata: number;
    withincompanycost: number;
    withincompanyduration: number;
    uncategorisedcost: number;
    uncategorisedduration: number;
    total: number;
    datasoc: string;
    totalcallcost: number;
    bandescription: string;
    benguid: string;
    ctncount: number;
    averageperctn: number;

    reportinggroup1guid: string;
    reportinggroup2guid: string;
    reportinggroup3guid: string;
    reportinggroup4guid: string;
    reportinggroup5guid: string;
    reportinggroup6guid: string;
}


export class CallClassReportGraphModel {
    reportdescription: string;
    usagecharge: number;
    datavolume: number;
    minutes: number;
    volume: number;
    transcount: number;
    duration: string;
}






