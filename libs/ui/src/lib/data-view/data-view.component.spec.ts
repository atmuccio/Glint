import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintDataViewComponent } from './data-view.component';


@Component({
  selector: 'glint-test-data-view-host',
  standalone: true,
  imports: [GlintDataViewComponent],
  template: `
    <glint-data-view [value]="items" [layout]="layout" [paginator]="paginator" [rows]="rows">
      <ng-template #listItem let-item>
        <div class="list-item-content">{{ item.name }}</div>
      </ng-template>
      <ng-template #gridItem let-item>
        <div class="grid-item-content">{{ item.name }}</div>
      </ng-template>
    </glint-data-view>
  `,
})
class TestDataViewHostComponent {
  items: { name: string }[] = [
    { name: 'Alpha' },
    { name: 'Beta' },
    { name: 'Charlie' },
    { name: 'Delta' },
    { name: 'Echo' },
  ];
  layout: 'list' | 'grid' = 'list';
  paginator = false;
  rows = 10;
}

@Component({
  selector: 'glint-test-data-view-empty',
  standalone: true,
  imports: [GlintDataViewComponent],
  template: `
    <glint-data-view [value]="items" [emptyMessage]="emptyMsg">
      <ng-template #listItem let-item>
        <div>{{ item }}</div>
      </ng-template>
    </glint-data-view>
  `,
})
class TestDataViewEmptyHostComponent {
  items: unknown[] = [];
  emptyMsg = 'No records found';
}

describe('GlintDataViewComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestDataViewHostComponent, TestDataViewEmptyHostComponent],
    });
  });

  it('should render list layout by default', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-data-view');
    expect(host.getAttribute('data-layout')).toBe('list');
    const listContainer = fixture.nativeElement.querySelector('.content-list');
    expect(listContainer).toBeTruthy();
    const gridContainer = fixture.nativeElement.querySelector('.content-grid');
    expect(gridContainer).toBeFalsy();
  });

  it('should render grid layout when layout is grid', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.componentInstance.layout = 'grid';
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-data-view');
    expect(host.getAttribute('data-layout')).toBe('grid');
    const gridContainer = fixture.nativeElement.querySelector('.content-grid');
    expect(gridContainer).toBeTruthy();
    const listContainer = fixture.nativeElement.querySelector('.content-list');
    expect(listContainer).toBeFalsy();
  });

  it('should render items using list template', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.list-item-content');
    expect(items.length).toBe(5);
    expect(items[0].textContent.trim()).toBe('Alpha');
    expect(items[4].textContent.trim()).toBe('Echo');
  });

  it('should render items using grid template', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.componentInstance.layout = 'grid';
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.grid-item-content');
    expect(items.length).toBe(5);
    expect(items[0].textContent.trim()).toBe('Alpha');
  });

  it('should show empty message when value is empty', () => {
    const fixture = TestBed.createComponent(TestDataViewEmptyHostComponent);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.empty');
    expect(empty).toBeTruthy();
    expect(empty.textContent.trim()).toBe('No records found');
  });

  it('should paginate data when paginator is true', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.componentInstance.paginator = true;
    fixture.componentInstance.rows = 2;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.list-item-content');
    expect(items.length).toBe(2);
    expect(items[0].textContent.trim()).toBe('Alpha');
    expect(items[1].textContent.trim()).toBe('Beta');
  });

  it('should show paginator when paginator is true', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.componentInstance.paginator = true;
    fixture.componentInstance.rows = 2;
    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('glint-paginator');
    expect(paginator).toBeTruthy();
  });

  it('should not show paginator when paginator is false', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();
    const paginator = fixture.nativeElement.querySelector('glint-paginator');
    expect(paginator).toBeFalsy();
  });

  it('should toggle layout when layout buttons are clicked', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();

    // Initially list
    expect(fixture.nativeElement.querySelector('.content-list')).toBeTruthy();

    // Click grid button
    const buttons = fixture.nativeElement.querySelectorAll('.layout-btn');
    buttons[1].click(); // Grid button
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.content-grid')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.content-list')).toBeFalsy();

    // Click list button
    buttons[0].click(); // List button
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.content-list')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.content-grid')).toBeFalsy();
  });

  it('should have ARIA roles on list container and items', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="list"]');
    expect(list).toBeTruthy();

    const listItems = fixture.nativeElement.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(5);
  });

  it('should have ARIA roles on grid container and items', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.componentInstance.layout = 'grid';
    fixture.detectChanges();

    const list = fixture.nativeElement.querySelector('[role="list"]');
    expect(list).toBeTruthy();

    const listItems = fixture.nativeElement.querySelectorAll('[role="listitem"]');
    expect(listItems.length).toBe(5);
  });

  it('should have radiogroup with radio buttons for layout toggle', () => {
    const fixture = TestBed.createComponent(TestDataViewHostComponent);
    fixture.detectChanges();

    const radiogroup = fixture.nativeElement.querySelector('[role="radiogroup"]');
    expect(radiogroup).toBeTruthy();

    const radios = fixture.nativeElement.querySelectorAll('[role="radio"]');
    expect(radios.length).toBe(2);
    expect(radios[0].getAttribute('aria-checked')).toBe('true');
    expect(radios[1].getAttribute('aria-checked')).toBe('false');
  });
});
