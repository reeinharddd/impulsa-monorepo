import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ui-section-title',
  imports: [NgClass],
  templateUrl: './section-title.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionTitleComponent {
  title = input.required<string>();
  subtitle = input<string>();
  align = input<'center' | 'left'>('center');
}
