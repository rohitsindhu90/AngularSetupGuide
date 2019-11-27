import { SixMonthSpendAnalysisLineChartModel } from './sixmonthspendanalysislinechart';
import { LastMonthSpendAnalysisPieChartModel } from './lastmonthspendanalysispiechart';
import { LastMonthUsagePieChartModel } from './lastmonthusagepiechart';
import { HighestSpendingCTNList } from './highestspendingctnlist';
import { SixMonthAverageSpendByTariffLineChartModel } from './sixmonthaveragespendbytarifflinechart';
import { SixMonthUsageAnalysisBarChartModel } from './sixmonthsusageanalysisbarchart';
import { LastMonthUsageUKBarChartModel } from './lastmonthusageukbarchart';
import { LastMonthUsageInternationalBarChartModel } from './lastmonthusageinternationalbarchart';
import { LastMonthUsageRoamedBarChartModel } from './lastmonthusageroamedbarchart';

export class DashboardChart {
    monthyeardescription: string;
    sixmonthspendanalysislinechartviewmodel: SixMonthSpendAnalysisLineChartModel;
    sixmonthaveragespendbytarifflinechartviewmodel: SixMonthAverageSpendByTariffLineChartModel;
    lastmonthspendanalysispiechartviewmodel: LastMonthSpendAnalysisPieChartModel;
    lastmonthusagepiechartviewmodel: LastMonthUsagePieChartModel;
    highestspendingctnlist: HighestSpendingCTNList[];

    sixmonthusageanalysisbarchartviewmodel: SixMonthUsageAnalysisBarChartModel;
    lastmonthusageukbarchartviewmodel: LastMonthUsageUKBarChartModel;
    lastmonthusageinternationalbarchartviewmodel: LastMonthUsageInternationalBarChartModel;
    lastmonthusageroamedbarchartviewmodel: LastMonthUsageRoamedBarChartModel;
    highestminuteuserlist: HighestSpendingCTNList[];
    highesttextuserlist: HighestSpendingCTNList[];
    highestdatauserlist: HighestSpendingCTNList[];

    averageusesmodel: AverageUsesModel[];
    averageusesdatamodel: AverageUsesModel[];

    datalimitexceedingmobilesviewmodel: DataLimitExceedingMobilesViewModel;
    mostexpensiveviewmodel: MostExpensiveViewModel;

    totaldatacost: number;
    totalroamedcost: number;


    sixmonthactivitychartviewmodel: SixMonthSpendAnalysisLineChartModel;  
    activityconnection: ActivityGrid[];
    activitychangerequest: ActivityGrid[];
    activitydisconnection: ActivityGrid[];
    activityunallocation: ActivityGrid[];
    activitycare: ActivityGrid[];
    showobservation: boolean;

}

export class ActivityGrid {
    descripton: string;
    quantity: number;
}

export class AverageUsesModel {
    descripton: string;
    quantity: number;
}

export class MostExpensiveViewModel {
    public mobilenumber: string;
    public charges: number;
    public username: string;
    public calldate: Date;
    public reportheader: string;

    public date: string;
    public time: string;
}

export class DataLimitExceedingMobilesViewModel {
    public dataexceedinglimit: number;
    public charges: number;
    public count: number;
}