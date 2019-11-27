import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from '../_common/appsetting.service';
import 'rxjs/add/operator/toPromise';
import { CallClassReportViewModel, CallClassReportGraphModel } from '../_models/report/call-class-report-details.model';
import { CallClassItemisedViewModel } from '../_models/report/call-class-itemised.model';
import { BillingReport } from '../_models/billing-report';
import { InvoiceItemisedViewModel } from "../_models/invoiceitemised";
import { Invoice } from '../_models/invoice';
import { ReportingGroupViewModel } from '../_models/report/ReportingGroupViewModel';
import { RoamedInternationalViewModel } from '../_models/report/roamed-international.model';
import { RoamedInternationalByCountry } from '../_models/report/roamed-international-by-country.model';
import { RoamedItemisedByCountry } from '../_models/report/roamed-itemised-by-country.model';
import { InternationalReportViewModel } from '../_models/report/international-report.model';
import { SpendUsageViewModel } from '../_models/report/spendusagemodel';
import { InvoiceCTNCharge } from '../_models/report/invoicectn-charge-report.model';
import { CallClassAnalysisByCallCategoryViewModel } from '../_models/report/call-class-analysis.model';
import { InternationalReportByDestinationViewModel } from '../_models/report/international-report-By-Destination.model';
import { NonGeographicViewModel } from '../_models/report/non-geographic.model';
import { NonGeographicItemisedViewModel } from '../_models/report/non-geographic-itemised.model';
import { TopUsageModel } from '../_models/report/topusage.model';
import { ZeroUsageViewModel } from '../_models/report/zerousage.model';
import { UtilityMethod } from '../_common/utility-method';
import { DisConnectionReportModel } from '../_models/report/disconnectionreportmodel';
import { BillingUsageTrendModel } from "../_models/report/billingusagetrendmodel";
import { DataSummaryReportViewModel } from '../_models/report/data-summary-report.model';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',

})
export class InvoiceReportService {

  constructor(private http: HttpClient, private appSettingService: AppSettingService) {
  }




  /**
  * Gets the available list records from CallClassReport Table for user company and given  
  * @param invoiceDateID:
  * @param networkGuid:
   * @param billingPlatFormGuid:
     @param mobileNumber
  */
  GetCallClassDetails(invoicedateguid: string, mobileNumber: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string, reportinggroup6guid: string, fromDate?: Date, toDate?: Date, linkType?: string, linkSourceGuid?: string, rtypeGuid?: string, invoicetariff?: string): Promise<CallClassReportViewModel[]> {

    //var invoiceTariff = invoicetariff == undefined ? "" : invoicetariff.replace("&", "%26");;
    //var dataSoc = datasoc == undefined ? "" : datasoc ;

    let _invoiceTariff = invoicetariff == undefined ? "" : encodeURIComponent(invoicetariff);

    return this.http.get<CallClassReportViewModel[]>(this.appSettingService.apiurl + '/invoice/getcallclassdetailsasync?invoicedateguid=' + invoicedateguid + '&mobileNumber=' +
      UtilityMethod.IfNull(mobileNumber, '') + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid
      + '&banGUID=' + banGuid + '&reportinggroup1guid=' + reportinggroup1guid + '&reportinggroup2guid=' + reportinggroup2guid + '&reportinggroup3guid='
      + reportinggroup3guid + '&reportinggroup4guid=' + reportinggroup4guid + '&reportinggroup5guid=' + reportinggroup5guid + '&reportinggroup6guid='
      + reportinggroup6guid + '&fromDate=' + fromDate + '&toDate=' + toDate + '&linkType=' + UtilityMethod.IfNull(linkType, '') + '&linkSourceGuid='
      + linkSourceGuid + '&rtypeGuid=' + rtypeGuid
      + '&invoicetariff=' + _invoiceTariff
      //+ '&datasoc=' + dataSoc
    )
      .toPromise();

  }

  GetCallClassDetailsGraph(invoicedateguid: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string, reportinggroup6guid: string, fromDate?: Date, toDate?: Date, linkType?: string, linkSourceGuid?: string, rtypeGuid?: string): Promise<CallClassReportGraphModel[]> {
    return this.http.get<CallClassReportGraphModel[]>(this.appSettingService.apiurl + '/invoice/GetCallClassDetailsGraphAsync?invoicedateguid=' + invoicedateguid + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGUID=' + banGuid + '&reportinggroup1guid=' + reportinggroup1guid + '&reportinggroup2guid=' + reportinggroup2guid + '&reportinggroup3guid=' + reportinggroup3guid + '&reportinggroup4guid=' + reportinggroup4guid + '&reportinggroup5guid=' + reportinggroup5guid + '&reportinggroup6guid=' + reportinggroup6guid + '&fromDate=' + fromDate + '&toDate=' + toDate + '&linkType=' + UtilityMethod.IfNull(linkType, '') + '&linkSourceGuid=' + linkSourceGuid + '&rtypeGuid=' + rtypeGuid)
      .toPromise();

  }

  GetCallClassReportByCallCategory(invoicedateguid: string, networkGuid: string, billingPlatFormGuid: string, benguid: string, reportHeader: string, banguid: string,
    reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string, reportinggroup6guid: string,
    fromDate?: Date, toDate?: Date, linktype?: string, linksourceguid?: string, rtypeguid?: string): Promise<CallClassAnalysisByCallCategoryViewModel[]> {
    return this.http.get<CallClassAnalysisByCallCategoryViewModel[]>(this.appSettingService.apiurl + '/invoice/GetCallClassReportByCallCategory?invoicedateguid=' + invoicedateguid + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid +
      '&benguid=' + benguid + '&reportHeader=' + reportHeader + '&banGuid=' + banguid +
      '&reportinggroup1guid=' + reportinggroup1guid + '&reportinggroup2guid=' + reportinggroup2guid + '&reportinggroup3guid=' + reportinggroup3guid + '&reportinggroup4guid=' + reportinggroup4guid + '&reportinggroup5guid=' + reportinggroup5guid + '&reportinggroup6guid=' + reportinggroup6guid +
      '&fromDate=' + fromDate + '&toDate=' + toDate + '&linkType=' + linktype + '&linkSourceGuid=' + linksourceguid + '&rtypeGuid=' + rtypeguid)
      .toPromise();

  }

  GetCallClassItemised(invoicedateguid: string, mobilenumber: string, reportHeader: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banguid: string, reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string, reportinggroup6guid: string, fromDate?: Date, toDate?: Date): Promise<CallClassItemisedViewModel> {
    return this.http.get<CallClassItemisedViewModel>(this.appSettingService.apiurl + '/Invoice/GetCallClassItemised?invoicedateguid=' + invoicedateguid + '&mobileNumber=' + mobilenumber + '&reportHeader=' + reportHeader + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benGuid + '&banGuid=' + banguid + '&reportinggroup1guid=' + reportinggroup1guid + '&reportinggroup2guid=' + reportinggroup2guid + '&reportinggroup3guid=' + reportinggroup3guid + '&reportinggroup4guid=' + reportinggroup4guid + '&reportinggroup5guid=' + reportinggroup5guid + '&reportinggroup6guid=' + reportinggroup6guid + '&fromDate=' + fromDate + '&toDate=' + toDate)
      .toPromise();

  }

  GetCallClassDetailsByLinkSource(linktype: string, linksourceguid: string, rtypeguid: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string, reportinggroup6guid: string, fromDate?: Date, toDate?: Date): Promise<CallClassReportViewModel[]> {
    return this.http.get<CallClassReportViewModel[]>(this.appSettingService.apiurl + '/invoice/GetCallClassDetailsByLinkSource?linktype=' + linktype + '&linksourceguid=' + linksourceguid + '&rtypeguid=' + rtypeguid + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGUID=' + banGuid + '&reportinggroup1guid=' + reportinggroup1guid + '&reportinggroup2guid=' + reportinggroup2guid + '&reportinggroup3guid=' + reportinggroup3guid + '&reportinggroup4guid=' + reportinggroup4guid + '&reportinggroup5guid=' + reportinggroup5guid + '&reportinggroup6guid=' + reportinggroup6guid + '&fromDate=' + fromDate + '&toDate=' + toDate)
      .toPromise();

  }

  GetCOlumnTypeByReportHeader(reportHeader: string): Promise<number> {
    return this.http.get<number>(this.appSettingService.apiurl + '/ReportHeader/GetCOlumnTypeByReportHeader?reportHeader=' + reportHeader)
      .toPromise();

  }


  GetBillingReportDetails(networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, reportinggroup1Guid: string, reportinggroup2Guid: string
    , reportinggroup3Guid: string
    , reportinggroup4Guid: string
    , reportinggroup5Guid: string
    , reportinggroup6Guid: string
    , mobilenumber: string

  ): Promise<BillingReport[]> {
    return this.http.get<BillingReport[]>(this.appSettingService.apiurl + '/Dashboard/GetBillingReportAsync?networkGuid=' + networkGuid
      + '&billingPlatFormGuid=' + billingPlatFormGuid
      + '&benGuid=' + benGuid
      + '&banGuid=' + banGuid
      + '&reportinggroup1Guid=' + reportinggroup1Guid
      + '&reportinggroup2Guid=' + reportinggroup2Guid

      + '&reportinggroup3Guid=' + reportinggroup3Guid
      + '&reportinggroup4Guid=' + reportinggroup4Guid
      + '&reportinggroup5Guid=' + reportinggroup5Guid
      + '&reportinggroup6Guid=' + reportinggroup6Guid
      + '&mobilenumber=' + mobilenumber

    )
      .toPromise();

  }

  GetZeroUsageReport(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benGUID: string, banGUID: string, ): Promise<ZeroUsageViewModel[]> {
    return this.http.get<ZeroUsageViewModel[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNZeroUsage?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + banGUID)
      .toPromise();

  }

  GetZeroUsageReportByMonth(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benGUID: string, banGUID: string, ): Promise<ZeroUsageViewModel[]> {
    return this.http.get<ZeroUsageViewModel[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNZeroUsageByMonth?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + banGUID)
      .toPromise();

  }

  GetPremiumRateNumberReport(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benguid: string, ban: string): Promise<InvoiceItemisedViewModel[]> {
    return this.http.get<InvoiceItemisedViewModel[]>(this.appSettingService.apiurl + '/invoice/GetPremiumReateNumberReport?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&ban=' + ban)
      .toPromise();

  }
  GetPremiumRateNumberDetailByDialledNumber(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benguid: string, numberDialledAPN: string, ban: string): Promise<Invoice[]> {
    return this.http.get<Invoice[]>(this.appSettingService.apiurl + '/invoice/GetPremiumRateNumberDetailByDialledNumber?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&numberDialledAPN=' + numberDialledAPN + '&ban=' + ban)
      .toPromise();

  }

  GetRoamedOrInternationalReportDetails(FromDate: Date, ToDate: Date, SubCallType: string, CallType: string, zone: string,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<RoamedInternationalViewModel[]> {
    return this.http.get<RoamedInternationalViewModel[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNBySubCallType?FromDate=' + FromDate + '&ToDate=' + ToDate + '&SubCallType=' + SubCallType + '&CallType=' + CallType + '&zone=' + zone +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&ban=' + ban)
      .toPromise();

  }

  GetMostDialledNumberReport(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benguid: string, topvalue: number, ban: string): Promise<InvoiceItemisedViewModel[]> {
    return this.http.get<InvoiceItemisedViewModel[]>(this.appSettingService.apiurl + '/invoice/GetMostDialledNumberReport?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&topvalue=' + topvalue + '&ban=' + ban)
      .toPromise();

  }

  GetMostDialledNumberDetail(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benguid: string, ban: string, numberDialledAPN: string): Promise<Invoice[]> {
    return this.http.get<Invoice[]>(this.appSettingService.apiurl + '/invoice/GetMostDialledNumberDetail?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benguid=' + benguid + '&ban=' + ban + '&numberDialledAPN=' + numberDialledAPN)
      .toPromise();

  }

  GetTopUsageReport(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benGUID: string, ban: string, filtertype: number, topRecord: number): Promise<TopUsageModel[]> {
    return this.http.get<TopUsageModel[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNTopUsage?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + ban + '&filtertype=' + filtertype + '&topRecord=' + topRecord)
      .toPromise();

  }

  GetSpendUsageData(fromDate: Date, toDate: Date, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, criteria: string): Promise<SpendUsageViewModel[]> {
    return this.http.get<SpendUsageViewModel[]>(this.appSettingService.apiurl + '/invoice/GetSpendUsageDataAsync?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkGuid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGUID=' + banGuid + '&criteria=' + criteria)
      .toPromise();

  }


  GetInvoiceCTNChargeReport(fromDate: Date, toDate: Date, chargegroupguid: string, networkguid: string, billingPlatFormGuid: string, benGUID: string, banguid: string): Promise<InvoiceCTNCharge[]> {
    return this.http.get<InvoiceCTNCharge[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNChargeReport?fromDate=' + fromDate + '&toDate=' + toDate + '&chargeGroupGuid=' + chargegroupguid + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + banguid)
      .toPromise();


  }

  GetInvoiceCTNChargeDetailsReport(fromDate: Date, toDate: Date, chargegroupguid: string, chargedescription: string, networkguid: string, billingPlatFormGuid: string, benGUID: string, banguid: string): Promise<InvoiceCTNCharge[]> {
    return this.http.get<InvoiceCTNCharge[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceCTNChargeDetailsReport?fromDate=' + fromDate + '&toDate=' + toDate + '&chargeGroupGuid=' + chargegroupguid + '&chargedescription=' + chargedescription + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + banguid)
      .toPromise();

  }

  GetInvoiceHandsetTotalReport(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benguid: string, banGuid: string): Promise<Invoice[]> {
    return this.http.get<Invoice[]>(this.appSettingService.apiurl + '/invoice/GetInvoiceHandsetTotalReport?fromDate=' + fromDate + '&toDate=' + toDate + '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&BenGUID=' + benguid + '&banGuid=' + banGuid)
      .toPromise();

  }

  getReportingGroupDetails(active?: boolean): Promise<ReportingGroupViewModel[]> {
    return this.http.get<ReportingGroupViewModel[]>(this.appSettingService.apiurl + '/report/GetReportingGroupDetailsAsync?active=' + active)
      .toPromise();

  }

  GetInternationalReportDetails(FromDate: Date, ToDate: Date, CallType: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<InternationalReportViewModel[]> {
    return this.http.get<InternationalReportViewModel[]>(this.appSettingService.apiurl + '/report/GetInternationalReportData?FromDate=' + FromDate + '&ToDate=' + ToDate + '&callType=' + CallType +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGuid=' + ban)
      .toPromise();

  }


  GetInternationalReportByDestinationDetails(FromDate: Date, ToDate: Date, CallType: string,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string): Promise<InternationalReportByDestinationViewModel[]> {
    return this.http.get<InternationalReportByDestinationViewModel[]>(this.appSettingService.apiurl + '/report/GetInternationalByDestinationReportData?FromDate=' + FromDate + '&ToDate=' + ToDate + '&CallType=' + CallType +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGuid=' + banGuid)
      .toPromise();

  }

  GetRoamedByCountryDetails(FromDate: Date, ToDate: Date, SubCallType: string, CallType: string, zone: string,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<RoamedInternationalByCountry[]> {
    return this.http.get<RoamedInternationalByCountry[]>(this.appSettingService.apiurl + '/report/GetRoamedReportByCountry?FromDate=' + FromDate + '&ToDate=' + ToDate + '&SubCallType=' + SubCallType + '&CallType=' + CallType + '&zone=' + zone +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&ban=' + ban)
      .toPromise();

  }

  GetRoamedItemsiedByCountry(countryoforigin: string, FromDate: Date, ToDate: Date, SubCallType: string, CallType: string, zone: string,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<RoamedItemisedByCountry[]> {
    return this.http.get<RoamedItemisedByCountry[]>(this.appSettingService.apiurl + '/report/GetRoamedItemsiedByCountry?countryoforigin=' + countryoforigin + '&FromDate=' + FromDate + '&ToDate=' + ToDate + '&SubCallType=' + SubCallType + '&CallType=' + CallType + '&zone=' + zone +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&ban=' + ban)
      .toPromise();

  }

  GetInternationalReportByDestinationDrillDownDetails(FromDate: Date, ToDate: Date, CallType: string, networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string, selectedDestination: string, checkBoxDestinations: any)
    : Promise<InternationalReportViewModel[]> {

    var obj = {
      "FromDate": FromDate,
      "ToDate": ToDate,
      "CallType": CallType,
      "networkGuid": networkGuid,
      "billingPlatFormGuid": billingPlatFormGuid,
      "benGuid": benGuid,
      "banGuid": banGuid,
      "selectedDestination": selectedDestination,
      "checkBoxDestinations": checkBoxDestinations
    };

    var body = JSON.stringify(obj);
    return this.http.post<InternationalReportViewModel[]>(this.appSettingService.apiurl + '/report/GetInternationalReportByDestinationDetailData', body).toPromise();


  }

  GetNongeograpicDetails(FromDate: Date, ToDate: Date,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<NonGeographicViewModel[]> {
    return this.http.get<NonGeographicViewModel[]>(this.appSettingService.apiurl + '/report/GetNongeographicDetails?FromDate=' + FromDate + '&ToDate=' + ToDate +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&ban=' + ban)
      .toPromise();

  }



  GetDestinationsForInternationalReportByDestinationDrillDownDetails(FromDate: Date, ToDate: Date, CallType: string,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, banGuid: string): Promise<InternationalReportByDestinationViewModel[]> {

    return this.http.get<InternationalReportByDestinationViewModel[]>(this.appSettingService.apiurl + '/report/GetDestinationsForInternationalReportByDestinationDetailData?FromDate=' + FromDate + '&ToDate=' + ToDate + '&CallType=' + CallType +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&banGuid=' + banGuid)
      .toPromise();

  }

  GetNongeographicItemised(diallednumber: string, FromDate: Date, ToDate: Date,
    networkGuid: string, billingPlatFormGuid: string, benGuid: string, ban: string): Promise<NonGeographicItemisedViewModel[]> {
    return this.http.get<NonGeographicItemisedViewModel[]>(this.appSettingService.apiurl + '/report/GetNongeographicItemised?diallednumber=' + diallednumber + '&FromDate=' + FromDate + '&ToDate=' + ToDate +
      '&networkGuid= ' + networkGuid + ' &billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGuid + '&ban=' + ban)
      .toPromise();

  }


  GetMobileNumberByUserId(): Promise<string[]> {

    return this.http.get<string[]>(this.appSettingService.apiurl + '/dashboard/GetMobileNumberByUserId')
      .toPromise();


  }

  GetBillingHistoricalUsageDataAsync(networkGuid: string, billingPlatFormGuid: string, benID: number, banID: number, reportinggroup1ID: number, reportinggroup2ID: number
    , reportinggroup3ID: number, reportinggroup4ID: number, reportinggroup5ID: number, reportinggroup6ID: number): Promise<CallClassReportViewModel[]> {
    return this.http.get<CallClassReportViewModel[]>(this.appSettingService.apiurl + '/invoice/getbillinghistoricalusagedataasync?networkGuid=' + networkGuid +
      '&billingPlatFormGuid=' + billingPlatFormGuid +
      '&benID=' + benID +
      '&banID=' + banID +
      '&reportinggroup1ID=' + reportinggroup1ID +
      '&reportinggroup2ID=' + reportinggroup2ID +
      '&reportinggroup3ID=' + reportinggroup3ID +
      '&reportinggroup4ID=' + reportinggroup4ID +
      '&reportinggroup5ID=' + reportinggroup5ID +
      '&reportinggroup6ID=' + reportinggroup6ID)
      .toPromise();

  }

  GetDisConnectionReport(fromDate: string, toDate: string): Promise<DisConnectionReportModel[]> {
    return this.http.get<DisConnectionReportModel[]>(this.appSettingService.apiurl + '/report/GetDisConnectionReportAsync?FromDate=' + fromDate + '&ToDate=' + toDate)
      .toPromise();

  }
  GetBillingUsageTrendReport(fromDate: Date, toDate: Date, networkGuid: string, billingPlatFormGuid: string, benID: number, banID: number, reportinggroup1ID: number, reportinggroup2ID: number
    , reportinggroup3ID: number, reportinggroup4ID: number, reportinggroup5ID: number, reportinggroup6ID: number): Promise<BillingUsageTrendModel[]> {
    return this.http.get<BillingUsageTrendModel[]>(this.appSettingService.apiurl + '/invoice/GetBillingUsageTrendReportAsync?fromDate=' + fromDate + '&toDate=' + toDate
      + '&networkGuid=' + networkGuid +
      '&billingPlatFormGuid=' + billingPlatFormGuid +
      '&benID=' + benID +
      '&banID=' + banID +
      '&reportinggroup1ID=' + reportinggroup1ID +
      '&reportinggroup2ID=' + reportinggroup2ID +
      '&reportinggroup3ID=' + reportinggroup3ID +
      '&reportinggroup4ID=' + reportinggroup4ID +
      '&reportinggroup5ID=' + reportinggroup5ID +
      '&reportinggroup6ID=' + reportinggroup6ID)
      .toPromise();

  }
  GetBillingAverageTrendReport(fromDate: Date, toDate: Date, networkGuid: string, billingPlatFormGuid: string, benID: number, banID: number, reportinggroup1ID: number, reportinggroup2ID: number
    , reportinggroup3ID: number, reportinggroup4ID: number, reportinggroup5ID: number, reportinggroup6ID: number): Promise<BillingUsageTrendModel[]> {
    return this.http.get<BillingUsageTrendModel[]>(this.appSettingService.apiurl + '/invoice/GetBillingAverageTrendReportAsync?fromDate=' + fromDate + '&toDate=' + toDate
      + '&networkGuid=' + networkGuid +
      '&billingPlatFormGuid=' + billingPlatFormGuid +
      '&benID=' + benID +
      '&banID=' + banID +
      '&reportinggroup1ID=' + reportinggroup1ID +
      '&reportinggroup2ID=' + reportinggroup2ID +
      '&reportinggroup3ID=' + reportinggroup3ID +
      '&reportinggroup4ID=' + reportinggroup4ID +
      '&reportinggroup5ID=' + reportinggroup5ID +
      '&reportinggroup6ID=' + reportinggroup6ID)
      .toPromise();

  }

  getDataSummaryReport(fromDate: Date, toDate: Date, networkID: number, billingPlatFormID: number, benID: number, banID: number, reportinggroup1ID: number, reportinggroup2ID: number
    , reportinggroup3ID: number, reportinggroup4ID: number, reportinggroup5ID: number, reportinggroup6ID: number): Promise<DataSummaryReportViewModel[]> {
    return this.http.get<DataSummaryReportViewModel[]>(this.appSettingService.apiurl + '/Report/GetDataSummaryReportAsync?fromdate=' + fromDate + '&todate=' + toDate
      + '&networkID=' + networkID +
      '&billingPlatFormID=' + billingPlatFormID +
      '&benID=' + benID +
      '&banID=' + banID +
      '&reportinggroup1ID=' + reportinggroup1ID +
      '&reportinggroup2ID=' + reportinggroup2ID +
      '&reportinggroup3ID=' + reportinggroup3ID +
      '&reportinggroup4ID=' + reportinggroup4ID +
      '&reportinggroup5ID=' + reportinggroup5ID +
      '&reportinggroup6ID=' + reportinggroup6ID)
      .toPromise();

  }

  getDataHistoryReportByCTN(fromDate: Date, toDate: Date, networkguid: string, billingPlatFormGuid: string, benGUID: string, banGUID: string,
    reportinggroup1guid: string, reportinggroup2guid: string, reportinggroup3guid: string, reportinggroup4guid: string, reportinggroup5guid: string,
    reportinggroup6guid: string): Observable<any[]> {
    return this.http.get<any[]>(this.appSettingService.apiurl + '/invoice/GetDataHistoryReportByCTN?fromDate=' + fromDate + '&toDate=' + toDate +
      '&networkGuid=' + networkguid + '&billingPlatFormGuid=' + billingPlatFormGuid + '&benGuid=' + benGUID + '&banGUID=' + banGUID +
      '&reportingGroup1Guid=' + reportinggroup1guid + '&reportingGroup2Guid=' + reportinggroup2guid + '&reportingGroup3Guid=' +
      reportinggroup3guid + '&reportingGroup4Guid=' + reportinggroup4guid + '&reportingGroup5Guid=' + reportinggroup5guid + '&reportingGroup6Guid=' + reportinggroup6guid);
  }
}
