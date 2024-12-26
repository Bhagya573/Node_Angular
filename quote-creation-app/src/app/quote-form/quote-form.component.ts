import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteService } from '../services/quote.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-form',
  templateUrl: './quote-form.component.html',
  styleUrls: ['./quote-form.component.css'],
})
export class QuoteFormComponent implements OnInit {
  quoteForm: FormGroup;
  quoteTypes: string[] = [];
  warrantyTermsOptions = ['12', '24', '36'];
  warrantyHoursOptions = ['500', '1000'];

  constructor(
    private fb: FormBuilder,
    private quoteService: QuoteService,
    private router: Router
  ) {
    this.quoteForm = this.fb.group({
      quoteName: ['', [Validators.required]],
      customerName: ['', [Validators.required]],
      quoteType: ['', [Validators.required]],
      serialNumber: ['', []],
      planNumber: ['', []],
      warrantyTerms: ['12', [Validators.required]],
      warrantyHours: ['500', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getQuoteTypes();
    this.quoteForm.get('quoteType')?.valueChanges.subscribe(value => {
      this.updateSerialPlanValidation(value);
    });
  }

  updateSerialPlanValidation(quoteType: string): void {
    const serialNumberControl = this.quoteForm.get('serialNumber');
    const planNumberControl = this.quoteForm.get('planNumber');
    
    if (quoteType === 'NEW') {
      serialNumberControl?.setValidators([Validators.required]);
      planNumberControl?.setValidators([Validators.required]);
    } else {
      serialNumberControl?.clearValidators();
      planNumberControl?.clearValidators();
    }

    serialNumberControl?.updateValueAndValidity();
    planNumberControl?.updateValueAndValidity();
  }

  getQuoteTypes(): void {
    this.quoteService.getQuoteTypes().subscribe({
      next: (data) => {
        this.quoteTypes = data.quoteTypes;
      },
      error: (error) => {
        console.error('Error fetching quote types:', error);
      },
    });
  }

  onSubmit(): void {
    if (this.quoteForm.invalid) {
      this.validateAllFormFields(this.quoteForm);
      return;
    }

    const formValue = this.quoteForm.value;
    const quoteData = {
      quoteName: formValue.quoteName,
      customerName: formValue.customerName,
      quoteType: formValue.quoteType,
      serialNumber: formValue.serialNumber,
      planNumber: formValue.planNumber,
      warrantyTerms: formValue.warrantyTerms,
      warrantyHours: formValue.warrantyHours,
    };

    this.quoteService.createQuote(quoteData).subscribe({
      next: () => {
        this.router.navigate(['/quote-list']);
      },
      error: (error) => {
        console.error('Error submitting quote:', error);
      }
    });
  }

  validateAllFormFields(formGroup: FormGroup): void {
    for (const control of Object.values(formGroup.controls)) {
      control.markAsTouched({ onlySelf: true });
    }
  }
  
}



