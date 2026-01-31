import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogoComponent } from './logo.component';

describe('LogoComponent', () => {
  let component: LogoComponent;
  let fixture: ComponentFixture<LogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('logoSrc computed', () => {
    it('should return icon-light.svg by default', () => {
      expect(component.logoSrc()).toBe('/assets/images/icon-light.svg');
    });

    it('should return logo-light.svg when type is full', () => {
      component.typeInput = 'full';
      fixture.detectChanges();
      expect(component.logoSrc()).toBe('/assets/images/logo-light.svg');
    });

    it('should return icon-dark.svg when variant is dark', () => {
      component.variantInput = 'dark';
      fixture.detectChanges();
      expect(component.logoSrc()).toBe('/assets/images/icon-dark.svg');
    });

    it('should return logo-dark.svg when type is full and variant is dark', () => {
      component.typeInput = 'full';
      component.variantInput = 'dark';
      fixture.detectChanges();
      expect(component.logoSrc()).toBe('/assets/images/logo-dark.svg');
    });

    it('should return icon-mono.svg when variant is mono', () => {
      component.variantInput = 'mono';
      fixture.detectChanges();
      expect(component.logoSrc()).toBe('/assets/images/icon-mono.svg');
    });
  });

  describe('altText computed', () => {
    it('should return appropriate alt text for icon light', () => {
      expect(component.altText()).toBe('Impulsa Icon (light theme)');
    });

    it('should return appropriate alt text for full logo dark', () => {
      component.typeInput = 'full';
      component.variantInput = 'dark';
      fixture.detectChanges();
      expect(component.altText()).toBe('Impulsa Logo (dark theme)');
    });

    it('should return appropriate alt text for mono icon', () => {
      component.variantInput = 'mono';
      fixture.detectChanges();
      expect(component.altText()).toBe('Impulsa Icon (mono theme)');
    });
  });

  describe('rendering', () => {
    it('should render img element with correct src', () => {
      const img = fixture.nativeElement.querySelector('img');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe('/assets/images/icon-light.svg');
    });

    it('should apply custom classes', () => {
      component.classInput = 'h-10 w-10 custom-class';
      fixture.detectChanges();
      const img = fixture.nativeElement.querySelector('img');
      expect(img.classList.contains('h-10')).toBe(true);
      expect(img.classList.contains('w-10')).toBe(true);
      expect(img.classList.contains('custom-class')).toBe(true);
    });

    it('should have draggable=false', () => {
      const img = fixture.nativeElement.querySelector('img');
      expect(img.getAttribute('draggable')).toBe('false');
    });

    it('should have select-none class', () => {
      const img = fixture.nativeElement.querySelector('img');
      expect(img.classList.contains('select-none')).toBe(true);
    });
  });
});
