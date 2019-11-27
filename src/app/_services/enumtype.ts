export enum Roles {
    SuperUser = 1,
    PurchaseUser = 2,
    DepartmentUser = 3,
    SupportUser = 4,
    FinanceUser = 5,
    CareUser = 6,
    EndUser = 7,
    AdminSuperUser = 8,
    AdminDispatchUser = 9,
    FinanceRestrictedUser = 10

}

export enum LinkType {
    ReportingGroup1 = 0,
    ReportingGroup2 = 1,
    ReportingGroup3 = 2,
    ReportingGroup4 = 3,
    ReportingGroup5 = 4,
    ReportingGroup6 = 5,
    Network = 6,
    BAN = 7,
    BEN = 8

}

export enum ReportHeaderColumnType {
    Volume = 1,

    Data = 2,

    Duration = 3
}
export enum FeatureTab {
    Company = 14
}
export enum CompanyUserRule {
    Email,
    Staffid
}

export enum FeatureType {
    Menu = 1,
    Feature = 2,
    Controls = 3
}


export enum ReportingGroupType {
    ReportingGroup1 = 1,
    ReportingGroup2,
    ReportingGroup3,
    ReportingGroup4,
    ReportingGroup5,
    ReportingGroup6
}

export enum Feature {
    Unallocate = 80,
    Cancellation = 81,
    PACRequest = 82,
    UpdateBars = 83,
    AssignAsset

}

export enum CTNStatus {
    Live = 1,
    Quarantine = 2,
    Spare = 3,
    PendingCancellation = 4,
    PACRequested = 5,
    PortedOut = 6,
    Cancelled = 7
}

export enum Transationtype {
    Termination = 1,
    PACRequest = 2
}

export enum CTNEventMaster {
    Reallocate = 1,

    ReportingGroup1Change = 2,

    ReportingGroup2Change = 3,

    ReportingGroup3Change = 4,

    ReportingGroup4Change5,

    ReportingGroup5Change = 6,

    ReportingGroup6Change = 7,

    AssetChange = 8,

    SimNumberChange = 9,

    Cancellation = 10,

    PACRequest = 11,

    InternationalBar = 12,

    DataBar = 13,

    RoamingBar = 14
}

export enum ClientEnum {
    clientname = 1,
    logoname,
    supportlogoname,
    logoimage,
    supportlogoimage,
    newusername,
    newpassword,
    username,
    forgetpassword,
    linktypevalue,
    quarantinedays,
    partialcancelleddays,
    unknown,
    notavailable,
    staffiddisplayname,
    clienturl,
    supportnumber,
    clientemail,
    ahrefid,
    chatid,
    initid,
    creditenddate = 22,
    reportinggrouprelationshiptype,
    agreementcheckexception,
    invoicemonth,
    passwordregexp,
    passwordmessge
}

export enum DesignCategoryEnum {
    SystemRelatedSetup = 1,
    Functionality,
    Fields,
    UserRelated,
    AccountRelated,
    Obersavations

}

export enum ClientControlEnum {
    ParentChildTariffShare = 1,
    CostAdjustment,
    Quantity,
    DateAllocated,
    ReallocateSpare,
    RefurbishedDevice,
    ReplaceDevice,
    ReturningDevice,
    SpareNumber,
    AuthorisedBy,
    PONumber,
    ShowPOagainstAsset,
    EndUserWelcomeEmail,
    MobileOnly,
    BulkManualCredit,
    TwoFactorAuthentication,
    PaymentMethods,
    Email,
    InvoiceEmailEndUser,
    CompanyInformation,
    DashboardPDFExport,
    BarActiveRule,
    PONumberRequired,
    CTNNotes,
    InvoiceEmailAdminTeam,
    SupplierInAssetFleet,
    TotalBillingCallCost = 26,
    AccountCreditInInvoice,
    ShowObservations,
}

export enum CallTypeEnum {
    SMS = 1,
    DATA = 2,
    Voice = 3,
    MPAY = 4
}

export enum OrderStatus {
    Partial = 1,
    Confirmed = 2,
    Dispatched = 3,
    Cancelled = 4,
    PartialDispatch = 5
}


export enum BillingPlatformType {
    Gemini = 1,
    Zygo = 2,
    MyVodafone = 3

}


export enum NetworkType {
    Vodafone = 1,
    O2 = 2,
    EE = 3
}

export enum ProductType {
    Handset = 1,
    Tablet = 2,
    Dongle = 3,
    Accessories = 4,
    SIM = 5,
    WifiOnly = 6,
}

export enum AssetStatus {
    InUse = 1,
    Spare = 2,
    Restoration = 3,
    Lost = 4,
    Stolen = 5,
    BuyBack = 6,
    Repair = 7,
    Recycled = 8,
    PendingReturn = 9,
    PendingDelivery = 10,
    PremiumCareStock = 11,
    Obsolete = 12,
    Faulty = 13,
}

export enum AssetOwnership {
    Company = 1,
    Employee,
    Onecom,
}

export enum ReportingGroupRelationshipType {
    DaisyChain = 1,
    ParentChild = 2,
    Custom = 3
}

export enum GeminiFormatType {
    VEDFormat = 1,
    IViewFormatCSV,
    IViewFormatExcel
}

export enum NewClientValidationDataType {
    Invalid,
    Valid,
    All
}