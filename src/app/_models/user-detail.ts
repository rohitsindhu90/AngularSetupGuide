import { Company } from './company'
import { ThemeModel } from './theme'
import { Client } from './client'
import { PermissionSet, PermissionSetNew, AccessType } from './access-group/permissionset';

export class UserDetail {
    id: number;
    name: string;
    username: string;
    password: string;
    emailaddress: string;
    staffid: string;
    active: boolean;
    role: string;
    companyguid: string;
    userbasetoken: string
    activedescription: string;
    roleid: number;
    tokencreateddatetime: Date;
    companyarray: number[] = [];
    permissionsetarray: number[] = [];
    
    presmissionsetid: number;
    companyid: number;
    userguid: string;
    usertheme: ThemeModel;
    companydetails: Company;
    ClientInfo: Client[];
    isallpermissionaccess: boolean;
    isclient: boolean;
    landingpage: string;
    featureList: FeatureUserRoleRel[];
    userruletype: string;
    isemailrequired: boolean;
    tempDNSName: string;
    adminuser: boolean;
    status: string;
    ctncount: string;
    emailverified: string;
    termconditionflag: boolean;
    isagreementaccepted: boolean;
    jsversionnumber: string;
    permissionsetarrayNew: PermissionSetNew[] = [];
    accesstypearray: number[] = [];
    forceload:boolean;
}

export class FeatureUserRoleRel {

    featureid: number;
    featuredescription: string;
    isreadonly: boolean;
    iswriteonly: boolean;
    isvisibleonly: boolean;
}