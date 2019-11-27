import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppSettingService } from 'src/app/_common/appsetting.service';

import { InvoiceDateWithFileListModel } from '../_models/InvoiceDateWithFileListModel';

import { GenericTupleModelBoolAndString } from '../_models/generictuplemodelboolandstring';
import 'rxjs/add/operator/toPromise';
import { InvoiceLoadMonitoring } from '../_models/invoiceloadmonitoring';
import { UploadInvoiceComboBox } from '../_models/uploadinvoicecombobox';

@Injectable({
	providedIn:'root'
})
export class UploadInvoiceService {

	/**
	 * Constructor to inject services
	 * @param http: The Http service to inject
	 */
	constructor(private http: HttpClient,private appSettingService: AppSettingService) {
	}

	/**
	 * Gets the available invoice month to upload invoice, for given company, network and billingPlatform
	 * @param networkId: The networkId
	 * @param billingPlatformId: The billingPlatform
	 */
    getInvoiceMonth(companyGuid: string, networkGuid: string, billingPlatformGuid?: string, geminiFormatType?: number): Promise<InvoiceDateWithFileListModel> {
        return this.http.get<InvoiceDateWithFileListModel>(this.appSettingService.apiurl + '/InvoiceUpload/GetValidMonthsListForInvoiceUploadAsync?networkGuid=' + networkGuid + '&billingPlatformGuid=' + billingPlatformGuid + '&geminiFormatType=' + geminiFormatType)
			.toPromise();
	}

	/**
	 * get the url of API
	 */
	getInvoiceUploadUrl() {
		return this.appSettingService.apiurl + '/InvoiceUpload/UploadInvoiceData';
	}

	/**
	 * Validates invoice files
	 * @param batchId: Current batch id
	 * @param companyGuid: selected companyGuid 
	 * @param networkGuid: selected networkGuid
	 * @param billingPlatformGuid: selected billingPlatform
	 */
    validateInvoiceFiles(batchId: string, networkGuid: string, billingPlatformGuid?: string, geminiFormatType?: number): Promise<GenericTupleModelBoolAndString> {
        return this.http.get<GenericTupleModelBoolAndString>(this.appSettingService.apiurl + '/InvoiceUpload/ValidateInvoiceFiles?batchId=' + batchId + '&networkGuid=' + networkGuid + '&billingPlatformGuid=' + billingPlatformGuid + '&geminiFormatType=' + geminiFormatType)
			.toPromise();
	}


	/**
	 * Creates a invoice upload queue for later processing
	 * @param batchId: Current batch id
	 * @param companyGuid: selected companyGuid
	 * @param networkGuid: selected networkGuid
	 * @param startDate: the start date of selected invoice date
	 * @param billingPlatformGuid: selected billingPlatform
	 */
    createQueue(batchId: string, companyGuid: string, networkGuid: string, startDate: string, billingPlatformGuid?: string, geminiFormatType?: number): Promise<boolean> {
        return this.http.get(this.appSettingService.apiurl + '/InvoiceUpload/CreateQueue?batchId=' + batchId + '&companyGuid=' + companyGuid + '&networkGuid=' + networkGuid + '&billingPlatformGuid=' + billingPlatformGuid + '&startDate=' + startDate + '&geminiFormatType=' + geminiFormatType)
			.toPromise()
			.then(response => {
				return response as boolean;
			});
	}

	/**
	 * Inserts data in InvoiceDate
	 * @param startDate: the start date of selected invoice date
	 * @param companyGuid: selected companyGuid
	 */
	insertInInvoiceDate(startDate: string, companyGuid: string): Promise<any> {
		return this.http.get(this.appSettingService.apiurl + '/InvoiceUpload/InsertInInvoiceDate?startDate=' + startDate + '&companyGuid=' + companyGuid)
			.toPromise()
			.then(response => {
				return;
			});
	}

	 /**
	 * Get data from Invoice upload table for invoice Load Monitoring
	 * @param startDate: the start date of selected invoice date
	 * @param team: selected teamid
	* @param status: selected status
	 */
	getInvoiceLoadMonitoringList(startDate: Date, team: number, status: number): Promise<InvoiceLoadMonitoring[]> {
		return this.http.get(this.appSettingService.apiurl + '/InvoiceUpload/GetInvoiceLoadMonitoringList?startDate=' + startDate + '&team=' + team + '&status=' + status)
			.toPromise()
			.then(response => {
				return response as InvoiceLoadMonitoring[];
			});
	}

	/**
   * Get data for upload invoice page combobox
   * @param startDate: the start date of selected invoice date
   * @param team: selected teamid
  * @param status: selected status
   */
	getUploadInvoiceComboBoxData(companyGuid: string, networkGuid: string, billingplatformGuid: string): Promise<UploadInvoiceComboBox> {
		return this.http.get(this.appSettingService.apiurl + '/InvoiceUpload/GetUploadInvoiceComboboxData?networkGuid=' + networkGuid + '&billingplatformGuid=' + billingplatformGuid)
			.toPromise()
			.then(response => {
				return response as UploadInvoiceComboBox;
			});
	}

}