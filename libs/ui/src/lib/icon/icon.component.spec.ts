import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintIconComponent } from './icon.component';
import { provideGlintIcons } from './icon.registry';
import { provideGlintIconConfig } from './icon.config';
import { mapIcons, lucideToSvg } from './map-icons';

const STUB_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24"/></svg>';
const STUB_SVG_ALT =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>';

@Component({
  selector: 'glint-test-icon-host',
  standalone: true,
  imports: [GlintIconComponent],
  template: `<glint-icon [name]="name()" [svg]="svg()" [label]="label()" [size]="size()" [strokeWidth]="strokeWidth()" />`,
})
class TestIconHostComponent {
  name = signal<string | undefined>(undefined);
  svg = signal<string | undefined>(undefined);
  label = signal<string | undefined>(undefined);
  size = signal<string | undefined>(undefined);
  strokeWidth = signal<string | number | undefined>(undefined);
}

describe('GlintIconComponent', () => {
  describe('with registry', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestIconHostComponent],
        providers: [
          provideGlintIcons({ check: STUB_SVG, x: STUB_SVG_ALT }),
        ],
      });
    });

    it('should render registered icon by name', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<svg');
      expect(icon.innerHTML).toContain('<rect');
    });

    it('should render different icon when name changes', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      let icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<rect');

      fixture.componentInstance.name.set('x');
      fixture.detectChanges();

      icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<circle');
    });

    it('should render empty when name is not registered', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('nonexistent');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toBe('');
    });

    it('should set aria-hidden when no label', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set aria-label and remove aria-hidden when label provided', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.componentInstance.label.set('Checkmark');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.getAttribute('aria-label')).toBe('Checkmark');
      expect(icon.getAttribute('aria-hidden')).toBeNull();
    });
  });

  describe('with direct svg input', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestIconHostComponent],
      });
    });

    it('should render direct SVG string', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.svg.set(STUB_SVG);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<svg');
    });

    it('should prefer svg input over name', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.svg.set(STUB_SVG);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<rect');
    });
  });

  describe('with icon config', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestIconHostComponent],
        providers: [
          provideGlintIcons({ check: STUB_SVG }),
          provideGlintIconConfig({ size: '2rem', strokeWidth: 1.5 }),
        ],
      });
    });

    it('should apply config size as CSS variable', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.style.getPropertyValue('--glint-icon-size')).toBe('2rem');
    });

    it('should apply config strokeWidth as CSS variable', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.style.getPropertyValue('--glint-icon-stroke-width')).toBe('1.5');
    });

    it('should let input override config', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.componentInstance.size.set('3rem');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.style.getPropertyValue('--glint-icon-size')).toBe('3rem');
    });
  });

  describe('multiple providers', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestIconHostComponent],
        providers: [
          provideGlintIcons({ check: STUB_SVG, x: STUB_SVG }),
          provideGlintIcons({ x: STUB_SVG_ALT, plus: STUB_SVG_ALT }),
        ],
      });
    });

    it('should merge multiple icon providers', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      let icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<rect');

      fixture.componentInstance.name.set('plus');
      fixture.detectChanges();

      icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<circle');
    });

    it('should let later providers override earlier ones', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('x');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toContain('<circle');
    });
  });

  describe('no registry', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestIconHostComponent],
      });
    });

    it('should render empty when no registry and no svg', () => {
      const fixture = TestBed.createComponent(TestIconHostComponent);
      fixture.componentInstance.name.set('check');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('glint-icon') as HTMLElement;
      expect(icon.innerHTML).toBe('');
    });
  });
});

describe('mapIcons', () => {
  it('should transform icons using the provided function', () => {
    const input = { a: 1, b: 2 };
    const result = mapIcons(input, (val, name) => `${name}:${val}`);
    expect(result).toEqual({ a: 'a:1', b: 'b:2' });
  });
});

describe('lucideToSvg', () => {
  it('should produce valid SVG string from icon node', () => {
    const node: [string, Record<string, string | number>][] = [
      ['circle', { cx: '12', cy: '12', r: '10' }],
      ['line', { x1: '12', y1: '8', x2: '12', y2: '16' }],
    ];
    const svg = lucideToSvg(node);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 24 24"');
    expect(svg).toContain('width="100%"');
    expect(svg).toContain('height="100%"');
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('<circle cx="12" cy="12" r="10"/>');
    expect(svg).toContain('<line x1="12" y1="8" x2="12" y2="16"/>');
    expect(svg).toContain('</svg>');
  });

  it('should include stroke-width CSS variable reference', () => {
    const svg = lucideToSvg([['path', { d: 'M0 0' }]]);
    expect(svg).toContain('--glint-icon-stroke-width');
  });
});
