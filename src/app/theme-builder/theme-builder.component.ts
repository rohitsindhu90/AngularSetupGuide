import { Component, SimpleChanges, OnInit, HostListener, OnDestroy, Input } from '@angular/core';
import { ThemeProvider } from '../_services/theme-provider';
import { ThemeModel } from '../_models/theme';
import { JsonPipe } from '@angular/common';
import { GlobalEventsManager } from '../_common/global-event.manager';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';
import { UtilityMethod } from '../_common/utility-method';
import { AuthenticationService } from '../_services/authentication.service';
import { UserDetail } from '../_models/user-detail';
import { Subscription } from 'rxjs/Subscription';


// const lightenDarkenColor = (col, amt) => {
//     var usePound = false;
//     if (col[0] == "#") {
//         col = col.slice(1);
//         usePound = true;
//     }
//     var num = parseInt(col, 16);
//     var r = (num >> 16) + amt;
//     if (r > 255) {
//         r = 255;
//     } else if (r < 0) {
//         r = 0;
//     }
//     var b = ((num >> 8) & 0x00FF) + amt;
//     if (b > 255) {
//         b = 255;
//     } else if (b < 0) {
//         b = 0;
//     }
//     var g = (num & 0x0000FF) + amt;
//     if (g > 255) {
//         g = 255;
//     } else if (g < 0) {
//         g = 0;
//     }
//     return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
// }

@Component({
    selector: 'theme-builder',
    styleUrls: ['./theme-builder.component.css'],
    templateUrl: "./theme-builder.component.html",
    animations: [
        // Each unique animation requires its own trigger. The first argument of the trigger function is the name
        trigger('displayState', [
            state('default', style({ right: "-40px" })),
            state('rotated', style({ right: "0px" })),
            transition('rotated => default', animate('800ms ease-out')),
            transition('default => rotated', animate('400ms ease-in'))
        ])
    ]

})
export class ThemeBuilderComponent implements OnInit, OnDestroy {

    state: string = 'default';

    themesetup: boolean;
    defalutDynamicCss: any = {
        "neon-bright": "#00e9d3",
        "neon-bright-darken-25": "#006960",
        "neon-bright-lighten-15": "#69fff1",
        "body-bg": "#212d34",
        "bg-color-base": "#006a60",
        "theme-bgcolor": "#006a60",
        "sidebar-font-color": "#fff",
        "theme-textcolor": "#fff",
        "widget-text-color": '#006a60',
        "link-color": "#fff",
        "text-color-base": "#00e9d3",
        "link-color-hover": "#00e9d3",
        "table-text-color": "#00e9d3",
        "table-header-bg": "#EEF2F4",
        "table-header-bg-darken-15": "#c2d0d7",
        "table-header-bg-darken-25": "#a4bac4",
        "table-header-bg-darken-20": "#b3c5ce",

    };
    defalutReadablekey: any = {
        "neon-bright": "Grid Search Border",
        "neon-bright-darken-25": "Grid Search Border",
        "neon-bright-lighten-15": "Grid Search Border",
        "body-bg": "body bgColor",
        "bg-color-base": "Paging Selected Color",
        "theme-bgcolor": "Menu bgColor",
        "sidebar-font-color": "Not Use",
        "theme-textcolor": "Top Menu Color",
        "widget-text-color": 'Text Color',
        "link-color": "aTag Color",
        "text-color-base": "Not Use",
        "link-color-hover": "aTag hover color",
        "table-text-color": "Grid Header text Color",
        "table-header-bg": "Grid Header bgColor",
        "table-header-bg-darken-15": "Grid Header bgColor darken-15",
        "table-header-bg-darken-25": "Grid Header bgColor darken-25",
        "table-header-bg-darken-20": "Grid Header bgColor darken-20",

    };
    dynamicCss: any;
    loader: any;
    root: any;
    //controlsKeys: { key: string, value: string }[];
    controlsKeys: any[];
    currentTheme: ThemeModel;
    userDetail: UserDetail;
    refreshThemeCSSVarSub: Subscription;

    constructor(private themeprovider: ThemeProvider,
        private globalevent: GlobalEventsManager,
        private authService: AuthenticationService) {
        this.loader = this.globalevent.busySpinner;
    }



    ngOnInit() {
        this.root = document.documentElement;
        this.userDetail = this.authService.currentUserValue;
        this.refreshThemeCSSVarSub = this.globalevent.refreshThemeCSSVar.subscribe((value: boolean) => {
            if (value) {
                this.setThemeControls();
            }
        })

        this.setThemeControls();
    }

    setThemeControls() {

        this.themeprovider.getCurrentTheme().then(theme => {
            this.currentTheme = theme;

            if (theme.cssvar != null && theme.cssvar != undefined) {
                this.dynamicCss = JSON.parse(this.currentTheme.cssvar);

            }
            else {
                this.dynamicCss = this.defalutDynamicCss;
            }
            this.controlsKeys = Object.keys(this.dynamicCss);
            //this.updateThemeAfterPageRender();
        });
    }

    darken: string = "darken";
    lighten: string = "lighten";
    onChangeHandler(color: any, key: string, isChange: boolean) {

        this.root.style.setProperty('--' + key, color);
        let controlKey = this.controlsKeys.filter(c => c != key && c.indexOf(key) != -1 && (c.indexOf(this.darken) != -1 || c.indexOf(this.lighten) != -1));

        if (controlKey != undefined && controlKey.length > 0) {
            controlKey.forEach((x: string) => {
                let keyparam = x.split('-');
                let amt: number = Number(keyparam[keyparam.length - 1]);
                let newColor = color;
                if (x.indexOf(this.darken) != -1) {
                    newColor = UtilityMethod.lightenDarkenColor(color, amt);
                }
                if (x.indexOf(this.lighten) != -1) {
                    newColor = UtilityMethod.lightenDarkenColor(color, -amt);

                }
                if (isChange) {
                    this.dynamicCss[x] = newColor;
                }
                this.root.style.setProperty('--' + x, newColor);
            });

        }
    }

    saveUpdatedTheme() {

        this.currentTheme.cssvar = JSON.stringify(this.dynamicCss);
        this.loader.emit(this.themeprovider.updateDynamicTheme(this.currentTheme).subscribe(x => {
            this.themesetup = false;
        }));
    }

    @HostListener('mouseenter', ['$event'])
    @HostListener('mouseleave', ['$event'])
    onHover(event: MouseEvent) {
        const direction = event.type === 'mouseenter' ? 'in' : 'out';
        const host = event.target as HTMLElement;
        this.state = direction == "in" ? "rotated" : "default";

    }

    updateThemeAfterPageRender() {
        this.controlsKeys.forEach((key: string) => {
            if (this.dynamicCss[key]) {
                this.onChangeHandler(this.dynamicCss[key], key, false);
            }

        })
    }

    ngOnDestroy() {
        this.refreshThemeCSSVarSub.unsubscribe();
    }

    getReadAbleNameOfVarCss(key:string){
        return this.defalutReadablekey[key];
    }
}


