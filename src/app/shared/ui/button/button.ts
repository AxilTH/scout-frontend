import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.scss',
  encapsulation: ViewEncapsulation.Emulated,
})
export class ButtonComponent {
  readonly backgroundColor = input.required<string>();
  readonly textColor = input.required<string>();
  readonly text = input.required<string>();
}
