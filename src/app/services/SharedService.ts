import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
    ukData;
    constructor() {
        this.ukData = {};
    }
    setUserData(val: object) {
        this.ukData = val;
        console.log(this.ukData);
    }
    getUserData() {
        console.log(this.ukData);
        return this.ukData;
    }
}