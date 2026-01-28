import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LocalizedTitleStrategy extends TitleStrategy {
  private readonly translate = inject(TranslateService);
  private readonly title = inject(Title);

  constructor() {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const titleKey = this.buildTitle(snapshot);
    if (titleKey) {
      this.setTitle(titleKey);

      // Subscribe to language changes to update the title
      this.translate.stream(titleKey).subscribe((translatedTitle: string) => {
        this.title.setTitle(`${translatedTitle} | Impulsa`);
      });
    } else {
      this.title.setTitle('Impulsa');
    }
  }

  private setTitle(key: string) {
    this.translate.get(key).subscribe((translated) => {
      this.title.setTitle(`${translated} | Impulsa`);
    });
  }
}
