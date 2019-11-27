
import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { AppComponent } from "../app.component";
import { Router, ActivatedRoute, } from '@angular/router';
import { ThemeProvider } from '../_services/theme-provider';

@Component({
    //moduleId: module.id,
    selector: 'public-app',
    templateUrl: './public.component.html'

})

export class PublicAppComponent implements OnInit, OnDestroy {

    mobileMenuActive: boolean = false;
    routerSub: any;
    constructor(
        private rootComp: AppComponent,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        // private titleService: TitleService,
        // private themeprovider:ThemeProvider
        private renderer: Renderer2,
        private themeProvider: ThemeProvider
    ) {

    }

    ngOnInit() {
        this.themeProvider.resetCSSVar();
        this.renderer.removeClass(document.body, 'body-gredient-bg');
        this.renderer.addClass(document.body, 'nebula-bg');
        // this.rootComp.cssClass = "nebula-bg";
        // this.routerSub=this.router.events
        //     .filter(event => event instanceof NavigationEnd)
        //     .map(() => this.activatedRoute)
        //     .map(route => {
        //         while (route.firstChild) route = route.firstChild;
        //         return route;
        //     })
        //     .filter(route => route.outlet === 'primary')
        //     .mergeMap(route => route.data)
        //     .subscribe((event) => {
        //         let title = TitleService.DefaultTitle;
        //         if (event['title'] && event['displayTitle'] != false) {
        //             title = event['title'];
        //         }

        //         if (event['displayTitle'] != false) {
        //             this.titleService.setTitle(title);
        //         }
        //     });

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
