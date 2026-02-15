import { ApplicationRef, Component, inject, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintStyleZoneComponent } from './style-zone.component';
import { ZONE_THEME } from '../tokens/zone-theme.token';
import { DEFAULT_ZONE_THEME, ZoneTheme } from '../tokens/zone-theme.model';
import { GlintColor } from '../palette/colors/index';
import { ZONE_INHERIT } from '../tokens/zone-inherit';
import { CSSColor } from '../types/branded';

@Component({
  selector: 'glint-test-consumer',
  standalone: true,
  template: `<span>{{ zoneTheme().colorPrimary }}</span>`,
})
class TestConsumerComponent {
  zoneTheme: Signal<ZoneTheme> = inject(ZONE_THEME);
}

@Component({
  selector: 'glint-test-host',
  standalone: true,
  imports: [GlintStyleZoneComponent, TestConsumerComponent],
  template: `
    <glint-style-zone [theme]="theme">
      <glint-test-consumer />
    </glint-style-zone>
  `,
})
class TestHostComponent {
  theme: Partial<ZoneTheme> = {};
}

@Component({
  selector: 'glint-test-nested',
  standalone: true,
  imports: [GlintStyleZoneComponent, TestConsumerComponent],
  template: `
    <glint-style-zone [theme]="outerTheme">
      <glint-style-zone [theme]="innerTheme">
        <glint-test-consumer />
      </glint-style-zone>
    </glint-style-zone>
  `,
})
class TestNestedComponent {
  outerTheme: Partial<ZoneTheme> = {};
  innerTheme: Partial<ZoneTheme> = {};
}

describe('GlintStyleZoneComponent', () => {
  it('should set CSS custom properties on host element', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.theme = { colorPrimary: GlintColor.Red.S500 };
    fixture.detectChanges();
    await fixture.whenStable();

    const zoneEl = fixture.nativeElement.querySelector('glint-style-zone') as HTMLElement;
    expect(zoneEl.style.getPropertyValue('--glint-color-primary')).toBe(GlintColor.Red.S500);
  });

  it('should have display: contents on host', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const zoneEl = fixture.nativeElement.querySelector('glint-style-zone') as HTMLElement;
    expect(getComputedStyle(zoneEl).display).toBe('contents');
  });

  it('should provide resolved theme via DI', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.theme = { colorPrimary: GlintColor.Indigo.S500 };
    fixture.detectChanges();
    await fixture.whenStable();

    const consumer = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(consumer.textContent).toBe(GlintColor.Indigo.S500);
  });

  it('should merge nested zones correctly', async () => {
    TestBed.configureTestingModule({
      imports: [TestNestedComponent],
    });
    const fixture = TestBed.createComponent(TestNestedComponent);
    fixture.componentInstance.outerTheme = {
      colorPrimary: GlintColor.Blue.S500,
      colorSurface: GlintColor.Slate.S900,
    };
    fixture.componentInstance.innerTheme = {
      colorPrimary: GlintColor.Green.S500,
    };
    fixture.detectChanges();
    await fixture.whenStable();

    const consumer = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(consumer.textContent).toBe(GlintColor.Green.S500);
  });

  it('should use DEFAULT_ZONE_THEME when no theme is provided', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const consumer = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(consumer.textContent).toBe(DEFAULT_ZONE_THEME.colorPrimary);
  });

  it('should remove CSS property when ZONE_INHERIT is used', async () => {
    TestBed.configureTestingModule({
      imports: [GlintStyleZoneComponent],
    });
    const fixture = TestBed.createComponent(GlintStyleZoneComponent);

    // Set initial theme with a color
    fixture.componentRef.setInput('theme', { colorPrimary: GlintColor.Red.S500 });
    fixture.detectChanges();
    await fixture.whenStable();

    const zoneEl = fixture.nativeElement as HTMLElement;
    expect(zoneEl.style.getPropertyValue('--glint-color-primary')).toBe(GlintColor.Red.S500);

    // Now change to ZONE_INHERIT — should remove the property
    fixture.componentRef.setInput('theme', { colorPrimary: ZONE_INHERIT as CSSColor });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(zoneEl.style.getPropertyValue('--glint-color-primary')).toBe('');
  });

  it('should only set locally overridden CSS properties', async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
    });
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.componentInstance.theme = { colorPrimary: GlintColor.Red.S500 };
    fixture.detectChanges();
    await fixture.whenStable();

    const zoneEl = fixture.nativeElement.querySelector('glint-style-zone') as HTMLElement;
    expect(zoneEl.style.getPropertyValue('--glint-color-primary')).toBe(GlintColor.Red.S500);
    expect(zoneEl.style.getPropertyValue('--glint-color-surface')).toBe('');
  });

  it('should work outside any zone with default theme', async () => {
    TestBed.configureTestingModule({
      imports: [TestConsumerComponent],
    });
    const fixture = TestBed.createComponent(TestConsumerComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const span = fixture.nativeElement.querySelector('span') as HTMLElement;
    expect(span.textContent).toBe(DEFAULT_ZONE_THEME.colorPrimary);
  });
});
