import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ProductLibrary } from '../../_models/admin/productlibrary';
import { AppSettingService } from 'src/app/_common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ProductLibraryService {

    constructor(private http: HttpClient, private appSettingService: AppSettingService) {
    }

    GetProductLibraryList(): Promise<ProductLibrary[]> {
        return this.http.get<ProductLibrary[]>(this.appSettingService.apiurl + '/ProductLibrary/GetProductLibraryListAsync')
            .toPromise();
    }



}


