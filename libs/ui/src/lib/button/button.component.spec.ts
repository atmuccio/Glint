import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintButtonComponent } from './button.component';
import { GlintStyleZoneComponent } from '../core/style-zone/style-zone.component';
import { ZoneTheme } from '../core/tokens/zone-theme.model';

@Component({
  selector: 'glint-test-button-host',
  standalone: true,
  imports: [GlintButtonComponent, GlintStyleZoneComponent],
  template: `
    <glint-style-zone [theme]="zoneTheme">
      <glint-button
        [severity]="severity"
        [disabled]="disabled"
        [loading]="loading"
        [variant]="variant"
      >Click me</glint-button>
    </glint-style-zone>
  `,
})
class TestButtonHostComponent {
  zoneTheme: Partial<ZoneTheme> = {};
  severity: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' = 'primary';
  disabled = false;
  loading = false;
  variant: 'filled' | 'outlined' | 'ghost' | undefined = undefined;
}

describe('GlintButtonComponent', () => {
  it('should render with default variant from zone', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('glint-button') as HTMLElement;
    expect(btn.getAttribute('data-variant')).toBe('filled');
    expect(btn.getAttribute('data-severity')).toBe('primary');
  });

  it('should use explicit variant over zone default', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.componentInstance.variant = 'outlined';
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('glint-button') as HTMLElement;
    expect(btn.getAttribute('data-variant')).toBe('outlined');
  });

  it('should default variant from zone theme', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.componentInstance.zoneTheme = { defaultVariant: 'ghost' };
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('glint-button') as HTMLElement;
    expect(btn.getAttribute('data-variant')).toBe('ghost');
  });

  it('should show loading state with aria-busy', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.componentInstance.loading = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('glint-button') as HTMLElement;
    const nativeBtn = btn.querySelector('button') as HTMLButtonElement;
    expect(btn.getAttribute('data-loading')).toBeTruthy();
    expect(nativeBtn.getAttribute('aria-busy')).toBe('true');
    expect(btn.querySelector('.spinner')).toBeTruthy();
  });

  it('should set disabled state', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('glint-button') as HTMLElement;
    const nativeBtn = btn.querySelector('button') as HTMLButtonElement;
    expect(btn.classList.contains('disabled')).toBe(true);
    expect(nativeBtn.disabled).toBe(true);
  });

  it('should render projected content', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const content = fixture.nativeElement.querySelector('.content') as HTMLElement;
    expect(content.textContent?.trim()).toBe('Click me');
  });

  it('should default button type to "button"', async () => {
    TestBed.configureTestingModule({
      imports: [TestButtonHostComponent],
    });
    const fixture = TestBed.createComponent(TestButtonHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const nativeBtn = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(nativeBtn.type).toBe('button');
  });
});
