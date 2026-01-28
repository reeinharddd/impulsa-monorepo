import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private readonly _isMobile = signal<boolean>(false);

  // Public readonly signal
  readonly isMobile = this._isMobile.asReadonly();

  constructor() {
    this.detectDevice();
  }

  private detectDevice(): void {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Simple regex for mobile detection
    if (
      /android/i.test(userAgent) ||
      (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream)
    ) {
      this._isMobile.set(true);
    } else {
      this._isMobile.set(false);
    }
  }
}
