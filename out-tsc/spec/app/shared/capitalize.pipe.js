import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let CapitalizePipe = class CapitalizePipe {
    transform(value) {
        if (!value)
            return '';
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
};
CapitalizePipe = __decorate([
    Pipe({
        name: 'capitalize'
    })
], CapitalizePipe);
export { CapitalizePipe };
