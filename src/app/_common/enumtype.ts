export enum AdminRole {
    SuperUser = 1,
    SystemAdmin = 2,
    SupportUser = 3,
    BDM = 4
}
export enum ClientRole {
    SuperUser = 1
    , SystemAdmin
    , SupportUser
    , BDM
    , Administrator
    , StandardUser
    , EndUser
    , SuperUserClient
    , PurchaseUser
    , DepartmentUser
    , SupportUserClient
    , FinanceUser
    , CareUser
    , AdminDispatchUser
    , FinanceRestrictedUser
}
export enum CompanyUserRule {
    Email,
    Staffid,
    Username,
    Others
}
export enum OrderType {
    New = 1,
    Port,
    Spare
}

export enum CareIssueTypeEnum {
    Device = 1,
    Network = 2,
    Other = 3,
}