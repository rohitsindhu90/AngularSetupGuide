import { Injectable } from '@angular/core';
import { ChartHelper, } from '../_models/chart';
import { ThemeModel } from '../_models/theme';
import { GenericService } from '../_services/generic.service';
import { UserDetail } from '../_models/user-detail';
import { UserService } from './user.service';
import { AuthenticationService } from './authentication.service';
import * as $ from 'jquery';



@Injectable({
    providedIn: 'root'
})
export class ThemeProvider {

    constructor(private authService: AuthenticationService,
        private userService: UserService,
        private genericservice: GenericService) {

    }

    resetTheme() {
        this.genericservice.GetThemeList().then(res => {
            this.setTheme(res[0], false);
        })
    }
    //load stylesheet 
    loadStyleSheetFromUrl(url: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.onload = function () { resolve(); };
            link.href = url;

            let headScript = document.querySelector('script');
            headScript.parentNode.insertBefore(link, headScript);
        });
    };

    setTheme(theme: ThemeModel, saveTheme: boolean = true): Promise<string> {
        var p = new Promise<string>((resolve) => {
            var themeLink = $('link[href^="style"]'),
                newThemeURL = theme.cssname + '.css';
            this.resetCSSVar();
            if (theme.cssvar) {
                this.setCSSVar(theme.cssvar);
            }
            this.loadStyleSheetFromUrl(newThemeURL).then(r => {
                ChartHelper.ChartColor(theme.fontcolor);

                if (saveTheme) {
                    let user: UserDetail = this.authService.currentUserValue;

                    //updating local stroage with the new theme value
                    if (user) {
                        user.usertheme = theme;
                        this.authService.setUserDetail(user, false);
                    }

                    //update db with the new theme value
                    //this.userService.saveUserThemeDetails(theme.id).subscribe();

                }
                this.resetCSSVar();
                if (theme.cssvar) {
                    this.setCSSVar(theme.cssvar);
                }
                //this.resetCSSVar();
                $(themeLink).remove();

                resolve(theme.cssname);

            });


        });

        return p;

    }

    resetCSSVar() {
        document.documentElement.removeAttribute("style");
    }
    getCurrentTheme(): Promise<ThemeModel> {
        let userDetail = this.authService.currentUserValue;
        return this.genericservice.GetThemeList().then(themelist => {
            let theme: ThemeModel;
            if (userDetail && userDetail.usertheme) {
                theme = userDetail.usertheme;
            }
            else if (themelist && themelist.length > 0) {
                theme = themelist[0];
            }
            return theme;
        });
    }



    setCSSVar(cssVar: string) {
        let root: any = document.documentElement;

        let cssVarObj: any = JSON.parse(cssVar);
        let cVar: string[] = Object.keys(cssVarObj);
        for (let key of cVar) {
            root.style.setProperty('--' + key, cssVarObj[key]);
        }

    }
    updateDynamicTheme(theme: ThemeModel) {

        return this.genericservice.UpdateDynamicTheme(theme);
    }
}