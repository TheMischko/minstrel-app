import { Component, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputType } from '../../../models/input-model';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  label = input<string>();
  placeholder = input<string>();
  type = input<InputType>('text');

  inputControl = new FormControl<string>('');

  classList: { [key: string]: boolean } = {
    'form-field': true,
    'input-text': this.type() === 'text',
    'input-textarea': this.type() === 'textarea',
    'input-number': this.type() === 'number',
    'input-disabled': this.inputControl.disabled,
  };

  writeValue(value: string): void {
    this.inputControl.setValue(value);
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputControl.disable();
      return;
    }
    this.inputControl.enable();
  }

  registerOnChange(fn: (_: any) => any): void {
    this.inputControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: (_: any) => any): void {
    return;
  }
}
