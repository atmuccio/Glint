import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  GlintColorPickerComponent,
  hsbToHex,
  hexToHsb,
  hsbToRgb,
  rgbToHsb,
  hexToRgb,
} from './colorpicker.component';

@Component({
  selector: 'glint-test-colorpicker-host',
  standalone: true,
  imports: [GlintColorPickerComponent, ReactiveFormsModule],
  template: `
    <glint-colorpicker
      [formControl]="ctrl"
      [disabled]="disabled"
      [inline]="inline"
      [format]="format"
    />
  `,
})
class TestHostComponent {
  ctrl = new FormControl('#ff0000');
  disabled = false;
  inline = false;
  format: 'hex' | 'rgb' | 'hsl' = 'hex';
}

describe('GlintColorPickerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent, OverlayModule],
    });
  });

  function createFixture(overrides?: Partial<TestHostComponent>) {
    const fixture = TestBed.createComponent(TestHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getSwatch(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.swatch-trigger') as HTMLButtonElement;
  }

  async function openPanel(fixture: ReturnType<typeof createFixture>) {
    getSwatch(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPanel() {
    return document.querySelector('.panel') as HTMLElement;
  }

  function getGradientArea() {
    return document.querySelector('.gradient-area') as HTMLElement;
  }

  function getHueStrip() {
    return document.querySelector('.hue-strip') as HTMLElement;
  }

  function getHexInput() {
    return document.querySelector('.hex-input') as HTMLInputElement;
  }

  function getPreview() {
    return document.querySelector('.color-preview') as HTMLElement;
  }

  // ── Color math unit tests ─────────────────────

  describe('color math', () => {
    it('should convert HSB to hex (pure red)', () => {
      expect(hsbToHex({ h: 0, s: 100, b: 100 })).toBe('#ff0000');
    });

    it('should convert HSB to hex (pure green)', () => {
      expect(hsbToHex({ h: 120, s: 100, b: 100 })).toBe('#00ff00');
    });

    it('should convert HSB to hex (pure blue)', () => {
      expect(hsbToHex({ h: 240, s: 100, b: 100 })).toBe('#0000ff');
    });

    it('should convert HSB to hex (white)', () => {
      expect(hsbToHex({ h: 0, s: 0, b: 100 })).toBe('#ffffff');
    });

    it('should convert HSB to hex (black)', () => {
      expect(hsbToHex({ h: 0, s: 0, b: 0 })).toBe('#000000');
    });

    it('should convert hex to HSB and back', () => {
      const hex = '#3366cc';
      const hsb = hexToHsb(hex);
      const result = hsbToHex(hsb);
      expect(result).toBe(hex);
    });

    it('should parse 3-char hex', () => {
      const rgb = hexToRgb('#f00');
      expect(rgb).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('#xyz')).toBeNull();
    });
  });

  // ── Rendering ─────────────────────────────────

  it('should render color swatch trigger', () => {
    const fixture = createFixture();
    const swatch = getSwatch(fixture);
    expect(swatch).toBeTruthy();
    expect(swatch.tagName.toLowerCase()).toBe('button');
  });

  it('should display current color in swatch', () => {
    const fixture = createFixture();
    const preview = fixture.nativeElement.querySelector('.swatch-preview') as HTMLElement;
    expect(preview).toBeTruthy();
    expect(preview.style.background).toBeTruthy();
  });

  // ── Open / Close ──────────────────────────────

  it('should open panel on swatch click', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = getPanel();
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('role')).toBe('application');
  });

  it('should close panel on Escape', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    expect(getPanel()).toBeTruthy();

    // CDK OverlayKeyboardDispatcher listens on document body keydown
    document.body.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });
    const swatch = getSwatch(fixture);
    // Disabled button won't fire click in some environments, but our toggle() guards
    swatch?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  // ── Panel content ─────────────────────────────

  it('should display hex input with current color', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const hexInput = getHexInput();
    expect(hexInput).toBeTruthy();
    expect(hexInput.value).toBe('#ff0000');
  });

  it('should update hex input when color changes via FormControl', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue('#00ff00');
    fixture.detectChanges();
    await openPanel(fixture);

    const hexInput = getHexInput();
    expect(hexInput.value).toBe('#00ff00');
  });

  it('should show gradient area and hue strip', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    expect(getGradientArea()).toBeTruthy();
    expect(getHueStrip()).toBeTruthy();
  });

  it('should show preview swatch in panel', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    expect(getPreview()).toBeTruthy();
  });

  // ── Hex input editing ─────────────────────────

  it('should parse hex input and update color', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const hexInput = getHexInput();
    hexInput.value = '#0000ff';
    hexInput.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('#0000ff');
  });

  // ── CVA ───────────────────────────────────────

  it('should work with FormControl (CVA write/read)', () => {
    const fixture = createFixture();
    // writeValue: the component should reflect the FormControl's initial value
    // We can verify by checking the swatch preview color
    const preview = fixture.nativeElement.querySelector('.swatch-preview') as HTMLElement;
    expect(preview.style.background).toContain('rgb(255, 0, 0)');
  });

  it('should set disabled state from FormControl', () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-colorpicker') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('should emit colorChange on color selection', async () => {
    const fixture = createFixture();
    const emitted: string[] = [];

    // Access the colorpicker component instance
    const picker = fixture.nativeElement.querySelector('glint-colorpicker');
    // Listen via the output
    const pickerComponent = fixture.debugElement.children[0].componentInstance as GlintColorPickerComponent;
    pickerComponent.colorChange.subscribe((val: string) => emitted.push(val));

    await openPanel(fixture);

    // Simulate hex input change
    const hexInput = getHexInput();
    hexInput.value = '#00ff00';
    hexInput.dispatchEvent(new Event('blur', { bubbles: true }));
    fixture.detectChanges();

    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[0]).toBe('#00ff00');
  });

  // ── Inline mode ───────────────────────────────

  it('should render inline when inline=true (no overlay)', () => {
    const fixture = createFixture({ inline: true });
    // Panel should be visible immediately without clicking
    const panel = fixture.nativeElement.querySelector('.panel') as HTMLElement;
    expect(panel).toBeTruthy();
    expect(panel.getAttribute('role')).toBe('application');

    // No trigger swatch in inline mode
    const swatch = fixture.nativeElement.querySelector('.swatch-trigger');
    expect(swatch).toBeFalsy();
  });
});
