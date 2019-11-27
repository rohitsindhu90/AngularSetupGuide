export class Features {
    featureid: number;
    featurename: string;
    routepath: string;
    menuicon: string;
    menureadonly: boolean;
    islandingpage: boolean;
    active: boolean;
    reportinggroupdisplayname: string;
    subfeatures: Features[];
}

export class FeatureRoleRelHierarchicalViewModel {
    public data: FeatureRoleRelTreeViewModel;
    public children: FeatureRoleRelHierarchicalViewModel[];
}

export class FeatureRoleRelTreeViewModel {
    public roleid: number;
    public featureid: number;
    public featuredescription: string;
    public featurekey: string;
    public routeurl: string;
    public isreadonly: boolean;
    public iswriteonly: boolean;
    public isvisibleonly: boolean;
    public menuicon: string;
    public parentid: number;
    public active: boolean;
}