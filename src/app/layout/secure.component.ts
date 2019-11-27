import { Component, OnInit, OnDestroy, ApplicationRef, ChangeDetectorRef, NgZone, Renderer2, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../_services/authentication.service';
import { Features } from '../_models/features';
import { FeatureService } from "../_services/feature.service";
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ConfirmationService } from 'primengdevng8/api';
import { UserDetail } from '../_models/user-detail';
import { TitleService } from '../_services/title.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { Observable } from "rxjs/Observable";
import { GenericService } from '../_services/generic.service';
import { ThemeModel } from '../_models/theme';

import { ClientControlService } from '../_services/clientcontrol.service';
import { ThemeProvider } from '../_services/theme-provider';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { promise } from 'protractor';
import { Subject } from 'rxjs/Subject';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ModalPopupService } from '../_common/modelpopup.service';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { AppSettingService } from '../_common/appsetting.service';
import { StorageService } from '../_helper/storage.service';
import { UserService } from '../_services/user.service';
import { CustomReuseStrategy } from '../_common/custom-route-reuse-strategy';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GlobalEventsManager } from '../_common/global-event.manager';


@Component({
  //moduleId: module.id,
  selector: 'secure-app',
  templateUrl: './secure.component.html',
})

export class SecureAppComponent implements OnInit, OnDestroy {
  //currentUser: UserDetail;
  private loader: EventEmitter<any> = new EventEmitter<any>();
  backToAdminBtnDisplay: boolean;
  public pageTitle = "CommsManager";
  // listenFunc will hold the function returned by "renderer.listen"
  listenFunc: Function;
  counter: Observable<number>;
  loggedIn: Observable<boolean>;
  userDetail: UserDetail;
  usernamechar: string;
  activeMenuId: string;

  themesVisible: boolean = false;

  mobileMenuActive: boolean = false;
  subMenuActive: boolean = false;
  subMenuOpen: boolean = false;

  userinfovisible: boolean = false;

  featureList: Features[] = [];
  companyname: string;

  routerSub: any;
  themelist: ThemeModel[];
  currentheme: string = 'style1';

  //fill this property to reander sub menu
  subfeatureList: Features[] = [];
  titleSubscription: any;
  onDestroy$: Subject<any> = new Subject<any>();
  displaySession: boolean = false;
  overlayText: any;
  clickBackToAdmin = false;
  
  constructor(
    private authenticationService: AuthenticationService,
    private storageservice: StorageService,
    private featureService: FeatureService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private titleService: TitleService,
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2,
    private genericservice: GenericService,
    private themeprovider: ThemeProvider,
    private app: ApplicationRef,
    private zone: NgZone,
    private modalpopupservice: ModalPopupService,
    private clientControlService: ClientControlService,
    private idle: Idle,
    private keepalive: Keepalive,
    private appSetting: AppSettingService,
    private changeDetect: ChangeDetectorRef,
    private userservice: UserService,
    private activeModal: NgbActiveModal,
    private globalEvent: GlobalEventsManager,

  ) {

    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        let title = this.titleService.DefaultTitle;
        this.pageTitle = "";
        if (event['title'] && event['displayTitle'] != false) {
          title = event['title'];
        }

        if (event['displayTitle'] != false) {
          this.titleService.setTitle(title);
        }

      });

  }



  ngOnInit() {

    this.setupAutoLogout();

    this.getAvilableTheme();

    this.storageservice.changes.pipe(takeUntil(this.onDestroy$), distinctUntilChanged((prev: any, curr: any) =>
      (prev.key != curr.key && prev.key != this.authenticationService.localStorageKey && curr.key != this.authenticationService.localStorageKey)
      && (prev.value != undefined && curr.value != undefined && JSON.parse(prev.value)['id'] === JSON.parse(curr.value)['id'])))
      // .pipe(
      //     map(x => {
      //     // if (x.key == this.authenticationService.localStorageKey) {
      //     //     return x;
      //     // }
      // })
      // )
      .subscribe((x: any) => {
        // console.log('document focus: ' + document.hasFocus());
        // console.log('document visibilityState: ' + document.visibilityState);

        this.clickBackToAdmin = this.authenticationService.getBackToAdminFlag();

        if ((document.visibilityState == "hidden" && this.authenticationService.currentUserValue != undefined && this.authenticationService.currentUserValue.companydetails != null)
          || (this.clickBackToAdmin && document.visibilityState == "hidden")) {
          this.RefreshTabConfirmation();
        }

        window.addEventListener('storage', (event) => {
          let userDetails = this.authenticationService.currentUserValue;
          if (userDetails == undefined) {
            this.router.navigate(['/']);
          }
        }, false);

      });

    this.authenticationService.currentUser.pipe(takeUntil(this.onDestroy$),
      distinctUntilChanged((prev: UserDetail, curr: UserDetail) => (
        curr != null && (prev.companydetails == curr.companydetails && prev.usertheme == curr.usertheme))))
      .subscribe(x => {
        if (x) {
          this.userDetail = x;
          this.renderer.removeClass(document.body, 'nebula-bg');
          this.renderer.addClass(document.body, 'body-gredient-bg');
          //===Load User Themes as well
          this.getAvilableTheme();
          this.loadFeature();
          this.initTheme();

          this.loadUserProfile();
          this.globalEvent.refreshThemeCSSVar.next(true);
        }
        CustomReuseStrategy.clearCompSnapshot();

      });

    /*this event expects the resonse from globalEventsManager which emits reloadMenu.
      based on the resopnse it loads the menu from api */
    // this.reloadSubscription = this.globalEventsManager.reloadMenu.subscribe((mode: any, error: any, complete: any) => {
    //     if (mode) {
    //         // CustomReuseStrategy.clearCompSnapshot();
    //         // this.userDetail = LocalStorageProvider.getUserStorage();
    //         this.loader.emit(this.userService.saveAdminUserInClient(this.userDetail).then((data: UserDetail) => {
    //             this.featureList = undefined;
    //             let userProfile: UserDetail = data;
    //             userProfile.usertheme = this.userDetail.usertheme;
    //             userProfile.companydetails = this.userDetail.companydetails;
    //             userProfile.ClientInfo = this.userDetail.ClientInfo;
    //             // LocalStorageProvider.setUserStorage(userProfile);
    //         }).then(() => {
    //             this.loadFeature();
    //             this.loadUserProfile();
    //         }));
    //     }
    //     else {
    //         this.loadFeature();
    //         this.loadUserProfile();
    //     }
    // });

    // this.rootComp.cssClass = "body-gredient-bg";

    // let process1 = this.loadFeature()
    // let process2 = this.loadUserProfile();
    // let process3 = this.loadTheme();


    // Promise.all([process1, process2, process3]);

    // this.routerSub = this.router.events.subscribe(event=>{
    //     debugger;
    //     if(event instanceof NavigationEnd){

    //     }
    // })
    // .filter(event => event instanceof NavigationEnd)
    // .map(() => this.activatedRoute)
    // .map(route => {
    //     debugger;
    //     while (route.firstChild) route = route.firstChild;
    //     return route;
    // })
    // .filter(route => route.outlet === 'primary')
    // .mergeMap(route => route.data)
    // .subscribe((event) => {
    //     debugger;
    //     let title = TitleService.DefaultTitle;
    //     this.pageTitle = "";
    //     if (event['title'] && event['displayTitle'] != false) {
    //         title = event['title'];

    //         this.pageTitle = title;
    //     }
    //     else {
    //         this.pageTitle = this.titleService.getTitle();
    //     }

    //     if (event['displayTitle'] != false) {
    //         this.pageTitle = title;
    //         // this.titleService.setTitle(title);
    //     }

    // });
    this.forcePageTitleUpdateSubscription();
    // this.autoReset();
  }

  //Auto Time out setting using ng Idle
  setupAutoLogout() {

    let maxtimeout: number = this.appSetting.autologoutintervaltimeout;
    let timeout: number = this.appSetting.autologoutsetTimeout;

    this.idle.setIdle(maxtimeout - 300);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(timeout);

    // sets the ping interval to 15 seconds
    this.keepalive.interval(maxtimeout - (maxtimeout / 8));

    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.watch();

    this.idle.onIdleEnd.subscribe(() => {
      this.displaySession = false;
      // console.log('No longer idle Test.');
      this.changeDetect.detectChanges();
    });

    this.idle.onTimeout.subscribe(() => {
      // console.log('Timed out!');
      // console.log(new Date());
      this.idle.stop();
      this.logout();
    });

    this.idle.onIdleStart.subscribe(() => console.log('You\'ve gone idle!'));

    this.idle.onTimeoutWarning.subscribe((countdown) => {
      this.displaySession = true;
      this.overlayText = "Your online session will expire in " + countdown + " seconds.";
      // console.log('You will time out in ' + countdown + ' seconds!');
    });

    this.keepalive.onPing.subscribe(() => {
      // console.log(new Date());
      // console.log('token refreshed');
      this.RefreshToken();
    });

  }

  forcePageTitleUpdateSubscription() {
    this.titleSubscription = this.titleService.titleUpdate$.subscribe((t: string) => {
      if (t) {
        this.pageTitle = t;
      }
    });
  }

  loadFeature() {


    this.featureService.getFeatureList()
      .then(list => {
        this.featureList = list;
        //this.featureList.filter(x => (x.subfeatures.length > 0 && x.subfeatures.filter(c => c.reportinggroupdisplayname && c.reportinggroupdisplayname.length >= 0)).length > 0).forEach(x => {
        //    x.subfeatures.filter(s=>s.reportinggroupdisplayname && s.reportinggroupdisplayname.length >= 0).forEach(item => {




        //        //this.router.config[1].children.unshift({ path: item.routepath.substr(1), component: ManagerReportingGroupComponent, canActivate: [CompanyAuthGuard], data: { shouldDetach: false } });
        //        this.router.config[1].children.unshift({ path: item.routepath.substr(1).substr(0, (item.routepath.lastIndexOf('/') - 1)) + "/:rid", component: ManagerReportingGroupComponent, canActivate: [CompanyAuthGuard], data: { shouldDetach: false } });

        //    });
        //});



        //this.router.config.forEach((x, i) => {


      });
  }


  // autoReset() {
  //     // let DOMevents = ['mousemove', 'mousedown', 'keypress', 'wheel', 'touchstart', 'scroll', 'click'];
  //     this.listenFunc = this.renderer.listen('document', 'click', (event: any) => {
  //         this.RefreshToken();
  //         this.store.dispatch({ type: RESET });

  //     });
  //     //this.listenFunc = this.renderer.listen('document', 'mousemove', (event: any) => {
  //     //    this.store.dispatch({ type: RESET });
  //     //});
  //     //this.listenFunc = this.renderer.listen('document', 'mousedown', (event: any) => {
  //     //    this.store.dispatch({ type: RESET });
  //     //});

  //     this.listenFunc = this.renderer.listen('document', 'keypress', (event: any) => {
  //         this.RefreshToken();
  //         this.store.dispatch({ type: RESET });
  //     });
  //     this.listenFunc = this.renderer.listen('document', 'wheel', (event: any) => {
  //         this.store.dispatch({ type: RESET });
  //     });
  //     this.listenFunc = this.renderer.listen('document', 'scroll', (event: any) => {
  //         this.store.dispatch({ type: RESET });
  //     });
  //     this.listenFunc = this.renderer.listen('document', 'touchstart', (event: any) => {
  //         this.store.dispatch({ type: RESET });
  //     });
  // }

  reloadFeature() {
    this.authenticationService.setBackToAdminClick(true);
    this.featureList = undefined;
    this.companyname = null;

    //modify localstorage to remove selected compnay details 
    let userProfile: UserDetail = this.authenticationService.currentUserValue;
    //clear company deatils from localStorage
    userProfile.companydetails = undefined;
    userProfile.ClientInfo = undefined;
    userProfile.isclient = false;
    userProfile.forceload = true;
    if(userProfile.usertheme){
      userProfile.usertheme.cssvar = null;
    }
    
    this.authenticationService.setUserDetail(userProfile);
    //set local storage
    // LocalStorageProvider.setUserStorage(userProfile);

    this.RefreshToken(true);
    //reload userdetails object
    //this.userDetail = LocalStorageProvider.getUserStorage();
    //this.loadFeature();
    this.router.navigate(['/company']);

  }

  RefreshToken(forceload: boolean = false) {

    let userDetails = this.authenticationService.currentUserValue;
    if (userDetails != null) {
      if (!forceload) {
        var tokencreateddatetime = userDetails.tokencreateddatetime;
        let d2: any = new Date(tokencreateddatetime);
        //let d1: any = new Date().toISOString();
        let now = new Date();
        let d1: any = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
        var minutes = ((d1 - d2) / 60);
        if (minutes > (this.appSetting.apirefreshtokentime)) {
          this.authenticationService.refreshToken();
        }
      }
      else {
        this.authenticationService.refreshToken();
      }
    }

  }

  loadUserProfile() {
    this.userDetail = this.authenticationService.currentUserValue;
    this.usernamechar = (this.userDetail.name ? this.userDetail.name.charAt(0).toUpperCase() : '') + (this.userDetail.name ? this.userDetail.name.charAt(this.userDetail.name.indexOf(' ') + 1).toUpperCase() : '');

    //this will load the company name
    if (this.userDetail && this.userDetail.isclient) {
      if (this.userDetail && !this.userDetail.ClientInfo) {
        this.clientControlService.GetClientDetail().then(res => {
          this.userDetail.ClientInfo = res;
          this.companyname = this.userDetail.ClientInfo.filter(x => x.key == "ClientName")[0].value;
          this.authenticationService.setUserDetail(this.userDetail);
        });
      }
      else {
        this.companyname = this.userDetail.ClientInfo.filter(x => x.key == "ClientName")[0].value;
      }
    }
    else {
      this.companyname = null;
    }
  }


  getAvilableTheme() {

    return this.genericservice.GetThemeList().then(res => {
      this.themelist = res;
    });
  }

  initTheme() {
    let userTheme = this.getUserTheme().then(x => {
      if (x) {
        this.toggleTheme(x, false);
      }
    });
  }

  getUserTheme(): Promise<ThemeModel> {
    var p = new Promise<ThemeModel>((resolve) => {

      if (this.userDetail && this.userDetail.usertheme) {
        resolve(this.userDetail.usertheme);
      }

    });
    return p;
  }
  // getTheme():Promise<ThemeModel> {
  //     let 
  //     let theme: ThemeModel;
  //     debugger;
  //     if (this.userDetail && this.userDetail.usertheme) {
  //         theme = this.userDetail.usertheme;
  //     }
  //     else if (this.themelist && this.themelist.length > 0) {
  //         theme = this.themelist[0];
  //     }
  //     if (theme) {
  //         this.toggleTheme(theme, false);
  //     }
  // }

  logout() {

    this.authenticationService.logout();
    CustomReuseStrategy.clearCompSnapshot();


    this.router.navigateByUrl('/login');
  }

  togglemenuitem(id: string) {
    if (this.activeMenuId == id) {
      this.activeMenuId = "null";
    }
    else {
      this.activeMenuId = id;
    }
  }

  toggleMenu(e: any) {
    this.mobileMenuActive = !this.mobileMenuActive;
    e.preventDefault();
  }

  onMenuClick(menuid: string, featureList: Features[], e?: any, submenudropdown?: any) {
    if (this.activeMenuId == menuid) {
      this.activeMenuId = null;
    }
    else {
      this.activeMenuId = menuid;
    }
    if (!featureList.length) {
      this.mobileMenuActive = false;
    }


  }

  subMenuEvent(e: any) {
    this.subMenuOpen = e;
  }


  toggleTheme(theme: ThemeModel, save: boolean = true) {

    this.themeprovider.setTheme(theme, save).then(r => {
      this.currentheme = r;
    });

  }


  //debug(): any {
  //    return JSON.stringify(this.featureList);
  //}

  confirm() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to log out?',
      accept: () => {
        this.logout();
      }
    });
  }

  RefreshTabConfirmation() {

    this.authenticationService.setBackToAdminClick(false);
    this.confirmationService.confirm({
      key: 'infoDialog',
      message: 'Logged in user changed , session needs to be refreshed',
      accept: () => {
        this.activeModal.dismiss();
        let userProfile: UserDetail = this.authenticationService.currentUserValue;
        if (typeof userProfile === 'undefined') {
          this.router.navigate(['/']);
        }
        else if (userProfile.companydetails) {
          this.authenticationService.setUserDetail(userProfile, false);
          this.loader.emit(this.userservice.saveAdminUserInClient(userProfile).then((data: UserDetail) => {
            let userDetail: UserDetail = data;
            userDetail.usertheme = userProfile.usertheme;
            userDetail.companydetails = userProfile.companydetails;
            userDetail.ClientInfo = userProfile.ClientInfo;
            this.authenticationService.setUserDetail(userProfile);
            this.router.navigate(['/home']);
          }));
        }
        else {
          userProfile.companydetails = undefined;
          userProfile.ClientInfo = undefined;
          userProfile.isclient = false;
          userProfile.forceload = true;
          this.authenticationService.setUserDetail(userProfile)
          this.router.navigate(['/company']);
        }
      }
    });
  }


  changepassword() {
    this.modalpopupservice.displayViewInPopup("Change Password", <any>ChangePasswordComponent, "", "md");
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub = null;
    }
    if (this.titleSubscription) {
      this.titleSubscription = null;

    }
    this.onDestroy$.next();
    this.onDestroy$.complete();

    this.idle.stop();
    // this.reloadSubscription.unsubscribe();

    // Removes "listen" listener
    // this.listenFunc();
  }

}
