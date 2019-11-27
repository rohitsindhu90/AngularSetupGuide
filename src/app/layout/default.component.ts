
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { TitleService } from '../_services/title.service';
import { Router, ActivatedRoute, NavigationEnd, } from '@angular/router';
import { ThemeProvider } from '../_services/theme-provider';
//let kendostyle = String(require('../kendo-theme.scss'));


@Component({
    //moduleId: module.id,
    selector: 'default-app',
    templateUrl: './default.component.html'

})

export class DefaultAppComponent implements OnInit, OnDestroy {

    public pageTitle = "CommsManager";
    mobileMenuActive: boolean = false;
    routerSub: any;
    constructor(
        private router: Router,
        private renderer: Renderer2,
        private activatedRoute: ActivatedRoute,
        private themeprovider: ThemeProvider,
        private titleService: TitleService) {
        this.routerSub = this.router.events
            .filter(event => event instanceof NavigationEnd)
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

                    this.pageTitle = title;
                }
                // else {
                //     this.pageTitle = this.titleService.getTitle();
                // }

                if (event['displayTitle'] != false) {
                    this.titleService.setTitle(title);
                }
            });

    }

    ngOnInit() {
        this.themeprovider.resetCSSVar();
        this.renderer.addClass(document.body, 'nebula-bg');

    }

    toggleMenu(e: any) {
        this.mobileMenuActive = !this.mobileMenuActive;
        e.preventDefault();
    }

    ngOnDestroy() {
        if (this.routerSub) {
            this.routerSub = null;
        }
    }


}
