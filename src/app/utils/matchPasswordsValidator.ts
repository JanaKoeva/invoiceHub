import { AbstractControl, ValidatorFn } from '@angular/forms';


export function matchPasswordValidator(field1: string, field2: string): ValidatorFn {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const control1 = group.get(field1);
    const control2 = group.get(field2);

    if (control1 && control2 && control1.value !== control2.value) {
      return { passwordMismatch: true }; 
    }
    return null; 
  };
}
