import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { DeviceDetectorService } from 'ngx-device-detector';



@Injectable({providedIn: 'root'})
export class FormValidatorUtilService {
    constructor( @Inject(DOCUMENT) private document: Document,  
    public deviceService: DeviceDetectorService){}


emailValidator(control: UntypedFormControl): {[key: string]: any} {
    var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;    
    if (control.value && !emailRegexp.test(control.value)) {
        return {invalidEmail: true};
    }
    return {invalidEmail: false};
}

matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: UntypedFormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }
}

}