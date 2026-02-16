import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintDrawerComponent } from './drawer.component';

@Component({
  selector: 'glint-test-drawer-host',
  standalone: true,
  imports: [GlintDrawerComponent],
  template: `
    <glint-drawer #drawer header="Settings" position="right">
      <p>Drawer content</p>
    </glint-drawer>
  `,
})
class TestDrawerHostComponent {
  drawer = viewChild.required<GlintDrawerComponent>('drawer');
}

describe('GlintDrawerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestDrawerHostComponent] });
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should open drawer', async () => {
    const fixture = TestBed.createComponent(TestDrawerHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.drawer().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const container = document.querySelector('.drawer-container');
    expect(container).toBeTruthy();
    fixture.componentInstance.drawer().close();
    fixture.detectChanges();
  });

  it('should show header when provided', async () => {
    const fixture = TestBed.createComponent(TestDrawerHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.drawer().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const title = document.querySelector('.drawer-title');
    expect(title?.textContent?.trim()).toBe('Settings');
    fixture.componentInstance.drawer().close();
    fixture.detectChanges();
  });

  it('should close on close button click', async () => {
    const fixture = TestBed.createComponent(TestDrawerHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.drawer().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const btn = document.querySelector('.drawer-close') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const container = document.querySelector('.drawer-container');
    expect(container).toBeNull();
  });

  it('should render content', async () => {
    const fixture = TestBed.createComponent(TestDrawerHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.drawer().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const body = document.querySelector('.drawer-body');
    expect(body?.textContent).toContain('Drawer content');
    fixture.componentInstance.drawer().close();
    fixture.detectChanges();
  });
});
