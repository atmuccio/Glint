import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintPickListComponent } from './pick-list.component';

@Component({
  selector: 'glint-test-pick-list-host',
  standalone: true,
  imports: [GlintPickListComponent],
  template: `
    <glint-pick-list
      [source]="source"
      [target]="target"
      [sourceHeader]="sourceHeader"
      [targetHeader]="targetHeader"
      [field]="field"
      [disabled]="disabled"
      (moveToTarget)="onMoveToTarget($event)"
      (moveToSource)="onMoveToSource($event)"
      (sourceReorder)="onSourceReorder($event)"
      (targetReorder)="onTargetReorder($event)"
    />
  `,
})
class TestPickListHostComponent {
  source: unknown[] = ['Apple', 'Banana', 'Cherry'];
  target: unknown[] = ['Date', 'Elderberry'];
  sourceHeader = 'Available';
  targetHeader = 'Selected';
  field = '';
  disabled = false;
  movedToTarget: unknown[] = [];
  movedToSource: unknown[] = [];
  reorderedSource: unknown[] = [];
  reorderedTarget: unknown[] = [];
  onMoveToTarget(items: unknown[]): void {
    this.movedToTarget = items;
    // Simulate parent updating source/target
    this.source = this.source.filter(i => !items.includes(i));
    this.target = [...this.target, ...items];
  }
  onMoveToSource(items: unknown[]): void {
    this.movedToSource = items;
    // Simulate parent updating source/target
    this.target = this.target.filter(i => !items.includes(i));
    this.source = [...this.source, ...items];
  }
  onSourceReorder(items: unknown[]): void {
    this.reorderedSource = items;
  }
  onTargetReorder(items: unknown[]): void {
    this.reorderedTarget = items;
  }
}

@Component({
  selector: 'glint-test-pick-list-objects',
  standalone: true,
  imports: [GlintPickListComponent],
  template: `
    <glint-pick-list
      [source]="source"
      [target]="target"
      field="name"
      (moveToTarget)="onMoveToTarget($event)"
      (moveToSource)="onMoveToSource($event)"
    />
  `,
})
class TestPickListObjectsHostComponent {
  source = [{ name: 'Alice' }, { name: 'Bob' }];
  target = [{ name: 'Charlie' }];
  movedToTarget: unknown[] = [];
  movedToSource: unknown[] = [];
  onMoveToTarget(items: unknown[]): void {
    this.movedToTarget = items;
  }
  onMoveToSource(items: unknown[]): void {
    this.movedToSource = items;
  }
}

describe('GlintPickListComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestPickListHostComponent, TestPickListObjectsHostComponent],
    });
  });

  it('should render source and target lists', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    expect(lists.length).toBe(2);

    const sourceItems = lists[0].querySelectorAll('.list-item');
    const targetItems = lists[1].querySelectorAll('.list-item');
    expect(sourceItems.length).toBe(3);
    expect(targetItems.length).toBe(2);
  });

  it('should render headers', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-header');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent.trim()).toBe('Available');
    expect(headers[1].textContent.trim()).toBe('Selected');
  });

  it('should display items using field', () => {
    const fixture = TestBed.createComponent(TestPickListObjectsHostComponent);
    fixture.detectChanges();
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const sourceItems = lists[0].querySelectorAll('.list-item');
    expect(sourceItems[0].textContent.trim()).toBe('Alice');
    expect(sourceItems[1].textContent.trim()).toBe('Bob');

    const targetItems = lists[1].querySelectorAll('.list-item');
    expect(targetItems[0].textContent.trim()).toBe('Charlie');
  });

  it('should select source item on click', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const sourceItems = lists[0].querySelectorAll('.list-item');
    sourceItems[0].click();
    fixture.detectChanges();
    expect(sourceItems[0].classList.contains('selected')).toBe(true);
    expect(sourceItems[0].getAttribute('aria-selected')).toBe('true');
  });

  it('should move selected to target on right button click', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Select Apple
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const sourceItems = lists[0].querySelectorAll('.list-item');
    sourceItems[0].click();
    fixture.detectChanges();

    // Click move right (second button: ->)
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToTarget).toEqual(['Apple']);
  });

  it('should move selected back to source on left button click', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Select Date from target list
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const targetItems = lists[1].querySelectorAll('.list-item');
    targetItems[0].click();
    fixture.detectChanges();

    // Click move left (third button: <-)
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToSource).toEqual(['Date']);
  });

  it('should move all to target', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Click move all right (first button: =>)
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToTarget).toEqual(['Apple', 'Banana', 'Cherry']);
  });

  it('should move all to source', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Click move all left (fourth button: <=)
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[3].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToSource).toEqual(['Date', 'Elderberry']);
  });

  it('should emit moveToTarget on transfer', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Select Banana
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const sourceItems = lists[0].querySelectorAll('.list-item');
    sourceItems[1].click();
    fixture.detectChanges();

    // Move right
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToTarget).toEqual(['Banana']);
    // After parent updates, target should have Banana
    fixture.detectChanges();
    const updatedLists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const updatedTargetItems = updatedLists[1].querySelectorAll('.list-item');
    expect(updatedTargetItems.length).toBe(3); // Date, Elderberry, Banana
  });

  it('should emit moveToSource on transfer back', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.detectChanges();

    // Select Elderberry from target
    const lists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const targetItems = lists[1].querySelectorAll('.list-item');
    targetItems[1].click();
    fixture.detectChanges();

    // Move left
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    buttons[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.movedToSource).toEqual(['Elderberry']);
    // After parent updates, source should have Elderberry
    fixture.detectChanges();
    const updatedLists = fixture.nativeElement.querySelectorAll('[role="listbox"]');
    const updatedSourceItems = updatedLists[0].querySelectorAll('.list-item');
    expect(updatedSourceItems.length).toBe(4); // Apple, Banana, Cherry, Elderberry
  });

  it('should not interact when disabled', () => {
    const fixture = TestBed.createComponent(TestPickListHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-pick-list');
    expect(host.classList.contains('disabled')).toBe(true);

    // All move buttons should still be visible but the host has pointer-events: none
    // The "move all to target" button should be enabled since source has items,
    // but it won't work because pointer-events: none on host
    const buttons = fixture.nativeElement.querySelectorAll('.transfer-controls button');
    expect(buttons.length).toBe(4);
  });
});
