import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintBreadcrumbComponent, GlintBreadcrumbItem } from './breadcrumb.component';

@Component({
  selector: 'glint-test-breadcrumb-host',
  standalone: true,
  imports: [GlintBreadcrumbComponent],
  template: `<glint-breadcrumb [items]="items" [separator]="separator" (itemClick)="onItemClick($event)" />`,
})
class TestBreadcrumbHostComponent {
  items: GlintBreadcrumbItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Products', url: '/products' },
    { label: 'Widget' },
  ];
  separator = '/';
  clickedItem: GlintBreadcrumbItem | null = null;
  onItemClick(item: GlintBreadcrumbItem): void {
    this.clickedItem = item;
  }
}

describe('GlintBreadcrumbComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestBreadcrumbHostComponent] });
  });

  it('should render all items', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(3);
  });

  it('should render links for non-last items with URLs', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].textContent?.trim()).toBe('Home');
  });

  it('should render last item as text with aria-current="page"', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(current.textContent?.trim()).toBe('Widget');
  });

  it('should render separators', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const seps = fixture.nativeElement.querySelectorAll('.separator');
    expect(seps.length).toBe(2);
    expect(seps[0].textContent?.trim()).toBe('/');
  });

  it('should have navigation role', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('glint-breadcrumb');
    expect(nav.getAttribute('role')).toBe('navigation');
  });

  it('should not have aria-current on non-last items', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('a');
    links.forEach((link: HTMLElement) => {
      expect(link.getAttribute('aria-current')).toBeFalsy();
    });
  });

  it('should have aria-label on the nav element', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('glint-breadcrumb');
    expect(nav.getAttribute('aria-label')).toBe('Breadcrumb');
  });

  it('should emit itemClick on link click', () => {
    const fixture = TestBed.createComponent(TestBreadcrumbHostComponent);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a') as HTMLAnchorElement;
    link.click();
    expect(fixture.componentInstance.clickedItem?.label).toBe('Home');
  });
});
