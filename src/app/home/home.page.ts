import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, tap, debounceTime } from 'rxjs/operators';

const createAddressForm = (): FormGroup => {
  return new FormGroup({
    street: new FormControl(''),
    number: new FormControl(''),
    city: new FormControl(''),
    province: new FormControl(''),
  });
};



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  form: FormGroup;
  selections: number[]  = [1, 2, 3, 4, 5];
  private onDestroing: Subject<void> = new Subject<void>();

  constructor() {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      surname: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      addressSize: new FormControl(1),
      addresses: new FormArray([createAddressForm()])
    });
    
    this.form.get('addressSize').valueChanges.pipe(
      takeUntil(this.onDestroing),
      debounceTime(0),
      tap(sizeValue => {
        const addressArray = (this.form.get('addresses') as FormArray);
        console.log(sizeValue, addressArray.length);
        if (sizeValue > addressArray.length) {
          const addressToAdd = sizeValue - addressArray.length;
          for (let i = 0; i < addressToAdd; i ++) {
            console.log(addressToAdd);
            (this.form.get('addresses') as FormArray).push(createAddressForm());
          }
          return;
        }
        if (sizeValue < addressArray.length) {
          const addressToRemove = addressArray.length - sizeValue;
          for (let i = 0; i < addressToRemove; i ++) {
            (this.form.get('addresses') as FormArray).removeAt(addressArray.length - 1 - i);
          }
          return;
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.onDestroing.next();
  }
}
