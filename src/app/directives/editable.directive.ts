import { Directive, OnChanges, Input, Output, ElementRef } from "@angular/core";
import { ɵlooseIdentical } from '@angular/core';

import { EventEmitter } from "events";

@Directive({
    selector: '[contenteditableModel]',
    host: {
        '(blur)': 'onBlur()'
    }
})
export class ContenteditableModel implements OnChanges {
    @Input('contenteditableModel') model: any;
    @Output('contenteditableModelChange') update = new EventEmitter();

    private lastViewModel: any;


    constructor(private elRef: ElementRef) {
    }

    ngOnChanges(changes) {
        if (this.isPropertyUpdated(changes, this.lastViewModel)) {
            this.lastViewModel = this.model
            this.refreshView()
        }
    }

    onBlur() {
        var value = this.elRef.nativeElement.innerText
        this.lastViewModel = value
        this.update.emit(value)
    }

    private refreshView() {
        this.elRef.nativeElement.innerText = this.model
    }

    isPropertyUpdated(changes: { [key: string]: any }, viewModel: any): boolean {
        if (!changes.hasOwnProperty('model')) return false;
        const change = changes['model'];

        if (change.isFirstChange()) return true;
        return !ɵlooseIdentical(viewModel, change.currentValue);
    }
}