import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-step',
  templateUrl: './step.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepComponent {
  number = input.required<number | string>();
  title = input.required<string>();
  description = input.required<string>();
}
