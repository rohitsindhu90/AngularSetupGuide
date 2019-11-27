export class PermissionSet
{
    public id: number;
    public permissionsetguid: string;
    public description: string;
    public active: boolean;
    public type: string;
    public typeid: number;
}

export class PermissionSetNew {
    public permissionsetid: number;
    public description: string;
    public recordid: number;
    public typeid: number;
    public typename: string;
}


export class AccessType {
    public id: number;
    public description: string;
    
}