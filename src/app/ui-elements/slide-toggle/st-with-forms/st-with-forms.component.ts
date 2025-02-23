import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-st-with-forms',
    imports: [
        MatSlideToggleModule,
        FormsModule,
        MatButtonModule,
        ReactiveFormsModule
    ],
    templateUrl: './st-with-forms.component.html',
    styleUrl: './st-with-forms.component.scss'
})
export class StWithFormsComponent {

    private _formBuilder = inject(FormBuilder);

    isChecked = true;
    formGroup = this._formBuilder.group({
        enableWifi: '',
        acceptTerms: ['', Validators.requiredTrue],
    });

    alertFormValues(formGroup: FormGroup) {
        alert(JSON.stringify(formGroup.value, null, 2));
    }

}