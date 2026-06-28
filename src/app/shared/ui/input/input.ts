import { Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  styleUrl: './input.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class InputComponent implements FormValueControl<string> {
  readonly placeholder = input.required<string>();
  readonly type = input.required<string>();
  readonly error = input<string>('');

  readonly value = model('');
}
