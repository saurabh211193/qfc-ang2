import { FormGroup } from '@angular/forms';

export class GlobalValidator {
  static readonly EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  static readonly PINCODE_REGEX = /^\d{6}$/;
  static readonly PHONE_REGEX = /^[6-9]\d{9}$/;
  static readonly NAME_REGEX = /^[A-Za-z .-]{1,40}$/;

  static validateForm(form: FormGroup, validationMessages: ValidationMessages, isSubmitted = false): FormErrors {
    const formErrors: FormErrors = {};
    for (const field of Object.keys(validationMessages)) {
      // clear previous error message (if any)
      formErrors[field] = '';
      const control = form.get(field);

      if (control && control.errors && (!control.valid && control.touched && control.dirty && form.invalid || isSubmitted)) {
        const messages = validationMessages[field];
        for (const key of Object.keys(control.errors)) {
          formErrors[field] = messages[key];
          break;
        }
      }
    }
    return formErrors;
  }
}

export abstract class FormErrors {
  [key: string]: string;
}
export abstract class ValidationMessages {
  [key: string]: { [key: string]: string };
}

export interface ValidationResult {
  [key: string]: boolean;
}
