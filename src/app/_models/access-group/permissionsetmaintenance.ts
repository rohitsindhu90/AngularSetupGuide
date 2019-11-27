import { PermissionSet } from './permissionset';
import { PermissionSetGroupRel } from './permissionsetgrouprel';
import { UserDetail } from '../user-detail';

export class PermissionSetMainteneance extends PermissionSet {
    public accesstypeid: number[];
    public accesstypedetail: PermissionSetGroupRel[];
    public userdetails: UserDetail[];
}