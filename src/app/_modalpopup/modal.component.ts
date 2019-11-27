import { Component, Input, ViewChild, ComponentFactoryResolver, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { Router, Route, } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { AccessDeniedComponent } from '../error/access-denied.component';
import { AccessRightService } from '../_services/access-right.service';
var $ = require('jquery');

@Component({
    selector: 'ngbd-modal-content',
    templateUrl: "./modal.component.html"
})
export class NgbdModalContent {
    @ViewChild('container', { read: ViewContainerRef, static: false }) target: ViewContainerRef;
    cmpRef: ComponentRef<Component>;
    private isViewInitialized: boolean = false;


    @Input() modaltitle: string;
    @Input() modalbody: string;
    @Input() type: Type<Component>;
    @Input() param: any;

    guardedroute: Route[];

    constructor(public activeModal: NgbActiveModal,
        private router: Router,
        private accessrightservice: AccessRightService,
        private componentFactoryResolver: ComponentFactoryResolver,
    ) {
        this.guardedroute = this.router.config[1].children.filter(x => x.canActivate && x.canActivate.length > 0);
    }

    updateComponent() {
        setTimeout(() => {
            if (!this.isViewInitialized) {
                return;
            }
            if (this.cmpRef) {
                // when the `type` input changes we destroy a previously 
                // created component before creating the new one
                this.cmpRef.destroy();
            }
            let componentName = this.type.name.toLowerCase();
            let cmpRoute: Route[] = this.guardedroute.filter(x => x.component.name.toLowerCase() == componentName);
            let url = '';
            if (cmpRoute && cmpRoute.length > 0) {
                this.accessrightservice.checkAccess(cmpRoute[0], url).then(res => {
                    if (res) {
                        this.loadComponent();
                    }
                    else {
                        //setting Error Component to loaded in popup 
                        // this.type = AccessDeniedComponent;
                        this.param = { "ispopup": true };
                        this.loadComponent();
                    }
                });

            }
            else {
                this.loadComponent();
            }


        });
    }

    loadComponent() {
        let factory = this.componentFactoryResolver.resolveComponentFactory(this.type);
        this.cmpRef = this.target.createComponent(factory);
        if (this.param) {
            let keys = Object.keys(this.param);
            for (let key of keys) {
                this.cmpRef.instance[key] = this.param[key];
            }
        }
    }

    ngOnChanges() {
        this.updateComponent();
    }

    ngAfterViewInit() {
        if (this.type) {
            this.isViewInitialized = true;
            this.updateComponent();
        }
    }

    ngOnDestroy() {
        if (this.cmpRef) {
            this.cmpRef.destroy();
            if ($('.modal:visible').length) {
                $('body').addClass('modal-open');
            }
        }
    }


}
