import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlintCardComponent, GlintCardHeaderDirective, GlintCardSubtitleDirective, GlintCardFooterDirective } from './card.component';

@Component({
  selector: 'glint-test-card-host',
  standalone: true,
  imports: [GlintCardComponent, GlintCardHeaderDirective, GlintCardSubtitleDirective, GlintCardFooterDirective],
  template: `
    <glint-card [variant]="variant">
      <div glintCardHeader>Header Text</div>
      <div glintCardSubtitle>Subtitle Text</div>
      <p>Body content</p>
      <div glintCardFooter>Footer Text</div>
    </glint-card>
  `,
})
class TestCardHostComponent {
  variant: 'flat' | 'elevated' | 'outlined' = 'flat';
}

describe('GlintCardComponent', () => {
  it('should render with flat variant by default', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('glint-card') as HTMLElement;
    expect(card.getAttribute('data-variant')).toBe('flat');
    expect(card.getAttribute('role')).toBeNull();
  });

  it('should render projected subtitle content', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const subtitle = fixture.nativeElement.querySelector('.glint-card-subtitle') as HTMLElement;
    expect(subtitle).toBeTruthy();
    expect(subtitle.textContent?.trim()).toBe('Subtitle Text');
  });

  it('should render projected header content', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.nativeElement.querySelector('.glint-card-header') as HTMLElement;
    expect(header).toBeTruthy();
    expect(header.textContent?.trim()).toBe('Header Text');
  });

  it('should render projected body content', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const body = fixture.nativeElement.querySelector('.body') as HTMLElement;
    expect(body).toBeTruthy();
    expect(body.textContent).toContain('Body content');
  });

  it('should render projected footer content', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const footer = fixture.nativeElement.querySelector('.glint-card-footer') as HTMLElement;
    expect(footer).toBeTruthy();
    expect(footer.textContent?.trim()).toBe('Footer Text');
  });

  it('should switch to elevated variant', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.componentInstance.variant = 'elevated';
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('glint-card') as HTMLElement;
    expect(card.getAttribute('data-variant')).toBe('elevated');
  });

  it('should switch to outlined variant', async () => {
    TestBed.configureTestingModule({
      imports: [TestCardHostComponent],
    });
    const fixture = TestBed.createComponent(TestCardHostComponent);
    fixture.componentInstance.variant = 'outlined';
    fixture.detectChanges();
    await fixture.whenStable();

    const card = fixture.nativeElement.querySelector('glint-card') as HTMLElement;
    expect(card.getAttribute('data-variant')).toBe('outlined');
  });
});
