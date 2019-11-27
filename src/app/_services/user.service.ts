/// <reference path="../_models/features.ts" />
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map'

import { UserDetail } from '../_models/user-detail';
import { ResetPassword } from '../_models/resetpassword';
import { UserRole } from '../_models/user-roles';
import { AuthenticationService } from './authentication.service';
import { UserFilter } from '../_models/user-filter';
import { FeatureRoleRelHierarchicalViewModel } from '../_models/features';
import { ChangePassword } from '../_models/change-password';

import { GenericTupleModelBoolAndString } from '../_models/generictuplemodelboolandstring';
import { AddBulkUserValidateViewModel } from '../_models/bulk-upload/addbulkuservalidateviewmodel';
import { AppSettingService } from '../_common/appsetting.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient,
    private authenticationService: AuthenticationService,
    private appSetting: AppSettingService,
    private router: Router) {

  }

  //this will load the the list of users from user table
  getUsers(): Promise<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.appSetting.apiurl}/user/LoadUserListAsync`)
      .toPromise();

  }

  sendResetPasswordRequest(username: string) {
    var body = JSON.stringify({ Username: username });
    // get users from api
    return this.http.post<string>(`${this.appSetting.apiurl}/Login/SendResetPasswordRequestAsync`, body)
  }



  logout() {
    //this.activeModal.close();
    //this.activeModal.close();
    //this.activeModal.dismiss();
    //this.activeModal.dismiss();
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }



  LoadUserProfile(userId: number): Promise<UserDetail> {
    // add authorization header with jwt token
    // get users from api
    return this.http.get<UserDetail>(`${this.appSetting.apiurl}/user/LoadUserProfileAsyncByUserID?userID=` + userId)
      .toPromise();

  }
  setPassword(resetPassword: ResetPassword) {
    var body = JSON.stringify(resetPassword);
    // sets the user password
    return this.http.post(`${this.appSetting.apiurl}/Login/SetPassword`, body);

  }

  validateSetPassword(guid: string) {
    // validates the passed in (query strign parameter) guid, to check if it's a valid request
    return this.http.get(`${this.appSetting.apiurl}/Login/ValidateSetPassword?guid=` + guid);

  }


  saveUser(userDetail: UserDetail) {
    var body = JSON.stringify(userDetail);

    return this.http.post(`${this.appSetting.apiurl}/user/SaveUser`, body);

  }

  saveUserThemeDetails(themeID: string) {
    var body = JSON.stringify(themeID);
    return this.http.post(`${this.appSetting.apiurl}/generic/SaveUserTheme`, body);
  }

  getRoleList(): Promise<UserRole[]> {
    // get users from api
    return this.http.get<UserRole[]>(`${this.appSetting.apiurl}/user/LoadRoleListAsync`)
      .toPromise();


  }

  getAllRoleList(): Promise<UserRole[]> {
    return this.http.get<UserRole[]>(`${this.appSetting.apiurl}/user/LoadAllRoleList`)
      .toPromise();


  }

  getClientUserRuleAsync(): Promise<string> {
    return this.http.get<string>(`${this.appSetting.apiurl}/user/GetClientUserRuleAsync`)
      .toPromise();

  }

  saveAdminUserInClient(userDetail: UserDetail): Promise<UserDetail> {
    var body = JSON.stringify(userDetail);

    return this.http.post<UserDetail>(`${this.appSetting.apiurl}/user/SaveAdminUserInClient`, body)
      .toPromise();

  }


  getCompanyUserRelAsync(userId: number): Promise<number[]> {
    return this.http.get<number[]>(`${this.appSetting.apiurl}/user/GetCompanyUserRelAsync?userID=` + userId)
      .toPromise();

  }

  //this will load the the list of users from user table
  getUsersByFilter(name: string, inculdedRecordID?: number): Promise<UserFilter[]> {  //
    return this.http.get<UserFilter[]>(`${this.appSetting.apiurl}/user/LoadUserListByFilterAsync?name=` + name + '&inculdedRecordID=' + inculdedRecordID)
      .toPromise();

  }
  // to get the saved feature by user id and role id
  LoadFeatureTreeViewByUserRole(roleID: number, userID: number, routeURL?: string, featureTypeID?: number): Promise<FeatureRoleRelHierarchicalViewModel[]> {
    return this.http.get<FeatureRoleRelHierarchicalViewModel[]>(`${this.appSetting.apiurl}/user/LoadFeatureRoleTreeViewByUserIDAsync?roleID=` + roleID + '&userID=' + userID + '&routeURL=' + routeURL + '&featureTypeID=' + featureTypeID)
      .toPromise();

  }

  // to check StaffID Exists by userID, staffID
  checkStaffIDExists(userID: number, staffID: string): Promise<any> {
    return this.http.get(`${this.appSetting.apiurl}/user/CheckStaffIDExists?userID=` + userID + '&staffID=' + staffID)
      .toPromise();

  }
  // to Check Email Address Exists
  checkEmailAddressExists(userID: number, emailAddress: string): Promise<any> {
    return this.http.get(`${this.appSetting.apiurl}/user/CheckEmailAddressExists?userID=` + userID + '&emailAddress=' + emailAddress)
      .toPromise();

  }

  // to Check username Exists
  checkUsernameExists(userID: number, username: string): Promise<any> {
    return this.http.get(`${this.appSetting.apiurl}/user/CheckUsernameExists?userID=` + userID + '&username=' + username)
      .toPromise();

  }

  changePassword(changePassword: ChangePassword) {
    var body = JSON.stringify(changePassword);
    // sets the user password
    return this.http.post<any>(`${this.appSetting.apiurl}/user/ChangePassword`, body);

  }

  GetUserListWithCTNCount(roleGuid: string): Promise<UserDetail[]> {
    return this.http.get<UserDetail[]>(`${this.appSetting.apiurl}/user/GetUserListWithCTNCount?roleGuid=` + roleGuid)
      .toPromise();

  }
  getBulkAddUserUploadUrl() {
    return `${this.appSetting.apiurl}/user/UploadAddBulkUserDataAsync`;
  }

  validateHeaderAddBulkUserFiles(batchId: string): Promise<GenericTupleModelBoolAndString> {
    return this.http.get<GenericTupleModelBoolAndString>(`${this.appSetting.apiurl}/User/ValidateHeaderAddBulkUserFileAsync?batchId=` + batchId)
      .toPromise();

  }

  insertInAddBulkUserRawTable(batchId: string): Promise<GenericTupleModelBoolAndString> {
    return this.http.get<GenericTupleModelBoolAndString>(`${this.appSetting.apiurl}/User/InsertInAddBulkUserRawTableAsync?batchId=` + batchId)
      .toPromise();
  }

  validateAddBulkUserData(batchId: string): Promise<AddBulkUserValidateViewModel> {
    return this.http.get<AddBulkUserValidateViewModel>(`${this.appSetting.apiurl}/User/ValidateAddBulkUserDataAsync?batchId=` + batchId)
      .toPromise();

  }

  GetAddBulkUserProtoType() {
    // const options = {
    //     // have to explicitly give as 'blob' or 'json'
    //     responseType: 'blob'
    // };

    // return this.http.get('', {
    //     headers: new HttpHeaders({
    //         'Authorization': '{data}',
    //         'Content-Type': 'application/json',
    //     }),
    //     responseType: ResponseContentType.Blob 
    // });


    return this.http.get(`${this.appSetting.apiurl}/User/GetAddBulkUserProtoTypeAsync`, { responseType: 'Blob' as 'json' });

  }

  InsertBulkUserDataInUser(batchid: string) {
    var body = JSON.stringify(batchid);
    return this.http.post(this.appSetting.apiurl + '/User/InsertBulkUserDataInUserAsync', body);
  }

  CheckIsEmailRequired(): Promise<boolean> {
    return this.http.get<boolean>(this.appSetting.apiurl + '/User/CheckIsEmailRequired')
      .toPromise();
  }

  IsEndUserWelcomeEmailActive(): Promise<boolean> {
    return this.http.get<boolean>(this.appSetting.apiurl + '/User/IsEndUserWelcomeEmailActive')
      .toPromise();
  }


  getUsersForScheduleReport(): Promise<UserDetail[]> {
    return this.http.get<UserDetail[]>(this.appSetting.apiurl + '/User/GetUsersForScheduleReportAsync')
      .toPromise();
  }
}
