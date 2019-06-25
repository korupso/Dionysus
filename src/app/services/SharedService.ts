import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    ukData = null;
    constructor() {
        this.ukData = {};
    }
    setUKData(val: object) {
        this.ukData = val;
        console.log(this.ukData);
    }
    getUKData() {
        console.log(this.ukData);
        return this.ukData;
    }
}