import { PermissionSetGroupRecordRel } from './permissionsetgrouprecordrel';
import { PermissionSetGroupRel } from './permissionsetgrouprel';

export class PermissionSetGroupMaintenance extends PermissionSetGroupRel {
    public recorddetails: PermissionSetGroupRecordRel[];
}