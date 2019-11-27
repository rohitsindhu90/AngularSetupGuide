import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({ providedIn: 'root' })
export class TitleService {
    private titleSubject: BehaviorSubject<any>;
    public titleUpdate$: Observable<any>;

    constructor(private title: Title) {
        this.titleSubject = new BehaviorSubject<any>('CommsManager');
        this.titleUpdate$ = this.titleSubject.asObservable();
    }

    public get DefaultTitle() {
        return this.titleSubject.value;
    }

    setTitle(title: string) {
        // this.title.setTitle(title);
        // if (force == true) {
        this.titleSubject.next(title);
        // }
    }

    getTitle(): string {
        return this.title.getTitle();
    }




}