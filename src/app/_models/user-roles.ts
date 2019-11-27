export class UserRole {
    id: number;
    roledescription: string;
    active: boolean;
    defaultfeatureid: number;
    deafultfeaturedescription: string;
    activeuserscount: number;
    inactiveusercount: number;
    roleguid: string;
    isallaccess: boolean;
    totaluserscount: number;
}

export class FeratureRoleList {

    featureid: number;
    featuredescription: string;
    isreadonly: boolean;
    iswriteonly: boolean;
    isvisibleonly: boolean; 
}