// import { Injectable } from '@angular/core';
// import { ChartHelper, ChartType } from '../_models/chart';
// import { ThemeModel } from '../_models/theme';
// import { GenericService } from '../_services/generic.service';
// import { LocalStorageProvider } from './localstorageprovider';
// import { UserDetail } from '../_models/user-detail';
// import { UserService } from '../_services/user.service';

// var $ = require('jquery');

// @Injectable()
// export class ThemeProvider {
//     constructor(private userservice: UserService,
//         private genericservice: GenericService) {

//     }

//     resetTheme() {
//         this.genericservice.GetThemeList().then(res => {
//             this.setTheme(res[0], false);
//         })
//     }
//     //load stylesheet 
//     loadStyleSheetFromUrl(url: any): Promise<any> {
//         return new Promise((resolve, reject) => {
//             let link = document.createElement('link');
//             link.type = 'text/css';
//             link.rel = 'stylesheet';
//             link.onload = function () { resolve(); };
//             link.href = url;

//             let headScript = document.querySelector('script');
//             headScript.parentNode.insertBefore(link, headScript);
//         });
//     };

//     setTheme(theme: ThemeModel, saveTheme: boolean = true): Promise<string> {
//         var p = new Promise<string>((resolve) => {
//             var themeLink = $('link[href^="style"]'),
//                 newThemeURL = theme.cssname + '.css';

//             this.loadStyleSheetFromUrl(newThemeURL).then(r => {
//                 ChartHelper.ChartColor(theme.fontcolor);

//                 if (saveTheme) {
//                     let user: UserDetail = LocalStorageProvider.getUserStorage();

//                     //updating local stroage with the new theme value
//                     if (user) {
//                         user.usertheme = theme;
//                         LocalStorageProvider.setUserStorage(user);
//                     }

//                     //update db with the new theme value
//                     this.userservice.saveUserThemeDetails(theme.themeguid);

//                 }

//                 $(themeLink).remove();

//                 resolve(theme.cssname);

//             });


//         });

//         return p;

//     }
// }