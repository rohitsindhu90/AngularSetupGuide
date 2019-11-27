import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Router, ActivatedRoute } from '@angular/router';
import { UserDetail } from '../_models/user-detail';
import { UtilityMethod } from '../_common/utility-method';
import { AppSettingService } from '../_common/appsetting.service';
import { StorageService } from '../_helper/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<UserDetail>;
  public currentUser: Observable<UserDetail>;
  localStorageKey: string = "currentUser";
  ipValidationErrorMsg: string = '';
  constructor(private http: HttpClient,
    private router: Router,
    private storageservice: StorageService,
    private route: ActivatedRoute,
    private appSettingService: AppSettingService) {
    this.currentUserSubject = new BehaviorSubject<UserDetail>(JSON.parse(localStorage.getItem(this.localStorageKey)));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserDetail {
    return localStorage.getItem(this.localStorageKey) != undefined ? JSON.parse(localStorage.getItem(this.localStorageKey)) : undefined;
    //return this.currentUserSubject.value;
  }

  login(username: string, password: string): Promise<any> {
    this.ipValidationErrorMsg = '';
    let twofactor: boolean;
    let body = JSON.stringify({ Username: username, Password: password });
    let promiseLogin = new Promise((resolve, reject) => {
      // check whether IP validation is required
      this.http.get<boolean>(`${this.appSettingService.apiurl}/clientconfig/IsIPValidationRequired`).subscribe(isValidationRequired => {
        if (isValidationRequired) {
          // get public ip
          this.http.get<any>(this.appSettingService.publicIPURL).subscribe(res => {
            if (res.ip) {
              // match current IP against whitelisted IPs
              this.http.get<any>(`${this.appSettingService.apiurl}/clientconfig/MatchCurrentLoggedInIP?publicip=` + res.ip).subscribe(response => {
                if (response.isipmatched) {
                  this.http.post<UserDetail>(`${this.appSettingService.apiurl}/login/CheckAuthenticationAsync`, body)
                    .toPromise().then((user: UserDetail) => {
                      // login successfull if there's a jwt token in the response
                      if (user) {
                        if ((user.isclient && !user.adminuser) || !user.isclient) {
                          if (user.isclient) {
                            if (!user.isagreementaccepted) {
                              resolve(5); // agreement not accepted
                            }
                            // get the value of two factor authentication
                            this.http.get<boolean>(`${this.appSettingService.apiurl}/clientconfig/TwoFactorEnabled?username=` + username).toPromise().then(res => {
                              twofactor = res;
                              if (twofactor) {
                                // check if email verified, only if two factor is in role!
                                if (!user.emailverified)
                                  resolve(4);
                                else {
                                  // check last login ip
                                  this.http.get<string[]>(`${this.appSettingService.apiurl}/Login/GetLastAndCurrentLoginIP?username=` + username).toPromise().then(data => {
                                    let ips = data;
                                    let lastIP = ips[0];
                                    let currentIP = ips[1];
                                    let item = { resolveStatus: 3, userDetail: user };
                                    if (lastIP == currentIP) {
                                      this.setUserDetail(user);
                                    }
                                    resolve((lastIP != currentIP) ? item : 1);
                                  });
                                }
                              }
                              else {
                                this.setUserDetail(user);
                                resolve(1); // sucessfull
                              }
                            });
                          }
                          else {
                            this.setUserDetail(user);
                            resolve(1);
                          }
                        }
                        else {
                          //admin user can not login to client portal
                          resolve(2);
                        }
                      }
                      else {
                        resolve(0);  // UserName Or Password Not Matched
                      }
                    });
                }
                else {
                  this.ipValidationErrorMsg = response.validationmessage;
                  resolve(6); // IP validation message
                }
              });
            }
          });
        }
        else {
          this.http.post<UserDetail>(`${this.appSettingService.apiurl}/login/CheckAuthenticationAsync`, body)
            .toPromise().then((user: UserDetail) => {
              // login successfull if there's a jwt token in the response
              if (user) {
                if ((user.isclient && !user.adminuser) || !user.isclient) {
                  if (user.isclient) {
                    if (!user.isagreementaccepted) {
                      resolve(5); // agreement not accepted
                    }
                    // get the value of two factor authentication
                    this.http.get<boolean>(`${this.appSettingService.apiurl}/clientconfig/TwoFactorEnabled?username=` + username).toPromise().then(res => {
                      twofactor = res;
                      if (twofactor) {
                        // check if email verified, only if two factor is in role!
                        if (!user.emailverified)
                          resolve(4);
                        else {
                          // check last login ip
                          this.http.get<string[]>(`${this.appSettingService.apiurl}/Login/GetLastAndCurrentLoginIP?username=` + username).toPromise().then(data => {
                            let ips = data;
                            let lastIP = ips[0];
                            let currentIP = ips[1];
                            let item = { resolveStatus: 3, userDetail: user };
                            if (lastIP == currentIP) {
                              this.setUserDetail(user);
                            }
                            resolve((lastIP != currentIP) ? item : 1);
                          });
                        }
                      }
                      else {
                        this.setUserDetail(user);
                        resolve(1); // sucessfull
                      }
                    });
                  }
                  else {
                    this.setUserDetail(user);
                    resolve(1);
                  }
                }
                else {
                  //admin user can not login to client portal
                  resolve(2);
                }
              }
              else {
                resolve(0);  // UserName Or Password Not Matched
              }
            });
        }
      });

    });
    return promiseLogin;
  }

  ipValidationForResetPassword(): Promise<any> {
    this.ipValidationErrorMsg = '';
    let ipPromise = new Promise((resolve, reject) => {
      this.http.get<boolean>(`${this.appSettingService.apiurl}/clientconfig/IsIPValidationRequired`).subscribe(isValidationRequired => {
        if (isValidationRequired) {
          this.http.get<any>(this.appSettingService.publicIPURL).subscribe(res => {
            if (res.ip) {
              this.http.get<any>(`${this.appSettingService.apiurl}/clientconfig/MatchCurrentLoggedInIP?publicip=` + res.ip).subscribe(response => {
                if (response.isipmatched) {
                  resolve(0);
                }
                else {
                  this.ipValidationErrorMsg = response.validationmessage;
                  resolve(1);
                }
              });
            }
          });
        }
        else {
          resolve(0);
        }
      });
    });
    return ipPromise;
  }

  // loginObservable(username: string, password: string) {
  //   let twofactor: boolean;
  //   let body = JSON.stringify({ Username: username, Password: password });
  //   return this.http.post<UserDetail>(`${this.appSettingService.apiurl}/login/CheckAuthenticationAsync`, body)
  //     .pipe(map(user => {
  //       // store user details and jwt token in local storage to keep user logged in between page refreshes
  //       if(user){
  //         if ((user.isclient && !user.adminuser) || !user.isclient) {
  //           if (user.isclient) {
  //             if (!user.isagreementaccepted) {
  //               return 5;
  //             }
  //             // get the value of two factor authentication
  //             this.http.get<boolean>(`${ this.appSettingService.apiurl }/clientconfig/TwoFactorEnabled?username=` + username).pipe(map(res=>{
  //               twofactor =res ;
  //               if (twofactor) {
  //                 // check if email verified, only if two factor is in role!
  //                 if (!user.emailverified)
  //                   return 4;
  //                 else {
  //                   // check last login ip
  //                  this.http.get<string[]>(`${ this.appSettingService.apiurl }/Login/GetLastAndCurrentLoginIP?username=` + username).pipe(map(data => {
  //                     let ips = data;
  //                     let lastIP = ips[0];
  //                     let currentIP = ips[1];
  //                     let item = { resolveStatus: 3, userDetail: user };
  //                     if (lastIP == currentIP) {
  //                       this.setUserDetail(user);
  //                     }
  //                     return (lastIP != currentIP) ? item : 1;
  //                   }));
  //                 }
  //               }
  //               else {
  //                 this.setUserDetail(user);
  //                 return 1; // sucessfull
  //               }
  //             }));

  //           }
  //           else{
  //             this.setUserDetail(user);
  //             return 1;
  //           }
  //         }
  //       }
  //     }));
  // }

  logout() {
    // remove user from local storage to log user out
    this.clearLocalStorage();
    this.currentUserSubject.next(null);
  }

  clearLocalStorage() {
    this.storageservice.clear(this.localStorageKey);
    // localStorage.removeItem(this.localStorageKey);
    // this.stop();
  }

  setUserDetail(user: UserDetail, fireSubscribe: boolean = true) {
    this.storageservice.store(this.localStorageKey, user);
    // this.start();
    if (fireSubscribe) {
      this.currentUserSubject.next(user);
    }
    return user;

  }

  setBackToAdminClick(flag: boolean) {
    this.storageservice.store('clickedBackToAdmin', flag);
  }

  getBackToAdminFlag(): boolean {
    return JSON.parse(localStorage.getItem('clickedBackToAdmin'));
  }

  verifyEmail(guid: string): Promise<boolean> {
    //let body = JSON.stringify({ guid: guid });
    return this.http.post<boolean>(`${this.appSettingService.apiurl}/login/VerifyEmail?guid=` + guid, null).toPromise();
  }

  sendOTP(username: string): Promise<boolean> {
    //let body = JSON.stringify({ username: username });
    return this.http.post<boolean>(`${this.appSettingService.apiurl}/login/SendOTP?username=` + username, null).toPromise();
  }

  sendVerificationMail(username: string): Promise<boolean> {
    //let body = JSON.stringify({ Username: username });
    return this.http.post<boolean>(`${this.appSettingService.apiurl}/login/SendVerificationMail?username=` + username, null).toPromise();
  }

  regenerateToken(username: string): Promise<UserDetail> {
    //var body = JSON.stringify({ username: username });

    return this.http.get<UserDetail>(`${this.appSettingService.apiurl}/user/RefreshTokenByUserName?username=` + UtilityMethod.IfNull(username, ''))
      .toPromise();
  }

  refreshToken(username?: string): Promise<any> {
    return this.regenerateToken(username).then(data => {
      let userDetails = this.currentUserValue;
      if (userDetails.companydetails != undefined) {
        data.companydetails = userDetails.companydetails;
      }
      this.setUserDetail(data);

    });
  }

  navigateToMainPage() {
    let userprofile = this.currentUserValue;
    //======Added To Resolve Landing Page Issue for Old Client                
    if (userprofile && userprofile.landingpage && userprofile.termconditionflag) {

      if (this.route.snapshot.queryParams['returnUrl'] != undefined && this.route.snapshot.queryParams['returnUrl'] != '') {
        this.router.navigate([this.route.snapshot.queryParams['returnUrl']]);
      }
      else {
        this.router.navigate([userprofile.landingpage]);
      }

    }
    else {

      if (this.route.snapshot.queryParams['returnUrl'] != undefined && this.route.snapshot.queryParams['returnUrl'] != '') {
        this.router.navigate([this.route.snapshot.queryParams['returnUrl']]);
      }
      else {
        this.router.navigate(["/home"]);
      }

    }

  }

  verifyOTP(username: string, pin: string): Promise<boolean> {
    // let body = JSON.stringify({ Username: username });
    return this.http.post<boolean>(this.appSettingService.apiurl + '/login/VerifyOTP?username=' + username + '&PIN=' + pin, null).toPromise();
  }
  // private start(): void {
  //   window.addEventListener("storage", this.storageEventListener.bind(this));
  // }

  // private storageEventListener(event: StorageEvent) {
  //   debugger;
  //   console.log(event);
  //   if (event.storageArea == localStorage && event.key== this.localStorageKey) {
  //     let v;
  //     try { v = JSON.parse(event.newValue); }
  //     catch (e) { v = event.newValue; }
  //   }
  // }

  // private stop(): void {
  //   window.removeEventListener("storage", this.storageEventListener.bind(this));
  // }

}
