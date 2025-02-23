import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function usernameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = /^[a-zA-Z0-9_.]+$/.test(control.value);
    return valid ? null : { invalidUsername: true };
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;  // Return null if no value, validation will be done by other required validator
    }

    const hasMinLength = value.length >= 8;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialCharacter = /[@$!%*?&]/.test(value);

    const valid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialCharacter;
    return valid ? null : { invalidPassword: true };
  };
}

export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control || control.value === "" ||  control.value === undefined || control.value === null) {
      return { invalidUrl: true }; // Return null if control or value is not defined
    }

    const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    const value = control.value;

    if (!value) {
      return null;  // Return null if no value, validation will be done by other required validator
    }

    if (!urlRegex.test(value)) {
      return { invalidUrl: true };
    }

    return null; // Valid URL
  };
}