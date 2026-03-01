import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintOrderListComponent } from './order-list.component';

@Component({
  selector: 'glint-test-order-list-host',
  standalone: true,
  imports: [GlintOrderListComponent],
  template: `
    <glint-order-list
      [value]="items"
      [header]="header"
      [field]="field"
      [filterBy]="filterBy"
      [disabled]="disabled"
      (reorder)="onReorder($event)"
      (selectionChange)="onSelection($event)"
    />
  `,
})
class TestOrderListHostComponent {
  items: unknown[] = ['Apple', 'Banana', 'Cherry', 'Date'];
  header = '';
  field = '';
  filterBy = '';
  disabled = false;
  reorderedItems: unknown[] = [];
  selectedItems: unknown[] = [];
  onReorder(items: unknown[]): void {
    this.reorderedItems = items;
  }
  onSelection(items: unknown[]): void {
    this.selectedItems = items;
  }
}

@Component({
  selector: 'glint-test-order-list-objects',
  standalone: true,
  imports: [GlintOrderListComponent],
  template: `
    <glint-order-list
      [value]="items"
      field="name"
      [filterBy]="filterBy"
      (reorder)="onReorder($event)"
      (selectionChange)="onSelection($event)"
    />
  `,
})
class TestOrderListObjectsHostComponent {
  items = [
    { name: 'Alice', id: 1 },
    { name: 'Bob', id: 2 },
    { name: 'Charlie', id: 3 },
  ];
  filterBy = '';
  reorderedItems: unknown[] = [];
  selectedItems: unknown[] = [];
  onReorder(items: unknown[]): void {
    this.reorderedItems = items;
  }
  onSelection(items: unknown[]): void {
    this.selectedItems = items;
  }
}

describe('GlintOrderListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestOrderListHostComponent, TestOrderListObjectsHostComponent],
    });
  });

  it('should render list items', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    expect(items.length).toBe(4);
    expect(items[0].textContent.trim()).toBe('Apple');
    expect(items[1].textContent.trim()).toBe('Banana');
    expect(items[2].textContent.trim()).toBe('Cherry');
    expect(items[3].textContent.trim()).toBe('Date');
  });

  it('should render header', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.componentInstance.header = 'Fruits';
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header.textContent.trim()).toBe('Fruits');
  });

  it('should display field value for objects', () => {
    const fixture = TestBed.createComponent(TestOrderListObjectsHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    expect(items[0].textContent.trim()).toBe('Alice');
    expect(items[1].textContent.trim()).toBe('Bob');
    expect(items[2].textContent.trim()).toBe('Charlie');
  });

  it('should select item on click', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[1].click();
    fixture.detectChanges();
    expect(items[1].classList.contains('selected')).toBe(true);
    expect(fixture.componentInstance.selectedItems).toEqual(['Banana']);
  });

  it('should move item up with move up button', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();

    // Select Banana (index 1)
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[1].click();
    fixture.detectChanges();

    // Click move up
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    const moveUpBtn = buttons[1]; // Move up is second button
    moveUpBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.reorderedItems).toEqual(['Banana', 'Apple', 'Cherry', 'Date']);
  });

  it('should move item down with move down button', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();

    // Select Banana (index 1)
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[1].click();
    fixture.detectChanges();

    // Click move down
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    const moveDownBtn = buttons[2]; // Move down is third button
    moveDownBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.reorderedItems).toEqual(['Apple', 'Cherry', 'Banana', 'Date']);
  });

  it('should move item to top', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();

    // Select Cherry (index 2)
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[2].click();
    fixture.detectChanges();

    // Click move to top
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    const moveToTopBtn = buttons[0];
    moveToTopBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.reorderedItems).toEqual(['Cherry', 'Apple', 'Banana', 'Date']);
  });

  it('should move item to bottom', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();

    // Select Banana (index 1)
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[1].click();
    fixture.detectChanges();

    // Click move to bottom
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    const moveToBottomBtn = buttons[3];
    moveToBottomBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.reorderedItems).toEqual(['Apple', 'Cherry', 'Date', 'Banana']);
  });

  it('should emit reorder after move', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();

    // Select Apple (index 0)
    const items = fixture.nativeElement.querySelectorAll('.list-item');
    items[0].click();
    fixture.detectChanges();

    // Click move down
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.reorderedItems.length).toBe(4);
    expect(fixture.componentInstance.reorderedItems[0]).toBe('Banana');
    expect(fixture.componentInstance.reorderedItems[1]).toBe('Apple');
  });

  it('should have listbox role', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="listbox"]');
    expect(list).toBeTruthy();
  });

  it('should not interact when disabled', () => {
    const fixture = TestBed.createComponent(TestOrderListHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-order-list');
    expect(host.classList.contains('disabled')).toBe(true);

    // Buttons should be disabled because nothing is selected and pointer-events are none
    const buttons = fixture.nativeElement.querySelectorAll('.controls button');
    for (const btn of buttons) {
      expect(btn.disabled).toBe(true);
    }
  });

  it('should filter items when filterBy is set', () => {
    const fixture = TestBed.createComponent(TestOrderListObjectsHostComponent);
    fixture.componentInstance.filterBy = 'name';
    fixture.detectChanges();

    // Filter input should be visible
    const filterInput = fixture.nativeElement.querySelector('.filter-input') as HTMLInputElement;
    expect(filterInput).toBeTruthy();

    // Type filter text
    filterInput.value = 'Al';
    filterInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.list-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent.trim()).toBe('Alice');
  });
});
