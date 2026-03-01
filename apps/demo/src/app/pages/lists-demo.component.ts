import { Component, signal } from '@angular/core';
import {
  GlintDataViewComponent,
  GlintOrderListComponent,
  GlintPickListComponent,
  GlintScrollerComponent,
} from '@glint-ng/core';

interface Product {
  name: string;
  category: string;
  price: number;
}

@Component({
  selector: 'glint-lists-demo',
  standalone: true,
  imports: [
    GlintDataViewComponent,
    GlintOrderListComponent,
    GlintPickListComponent,
    GlintScrollerComponent,
  ],
  template: `
    <h2>Lists &amp; Data</h2>
    <p class="page-desc">Components for displaying, reordering, transferring, and virtually scrolling data.</p>

    <!-- DataView -->
    <div class="demo-section">
      <h3>DataView - List / Grid Toggle</h3>
      <glint-data-view [value]="products" layout="list" [paginator]="true" [rows]="4">
        <ng-template #listItem let-item>
          <div class="dv-list-row">
            <span class="dv-name">{{ item.name }}</span>
            <span class="dv-cat">{{ item.category }}</span>
            <span class="dv-price">\${{ item.price }}</span>
          </div>
        </ng-template>
        <ng-template #gridItem let-item>
          <div class="dv-grid-card">
            <div class="dv-grid-name">{{ item.name }}</div>
            <div class="dv-grid-cat">{{ item.category }}</div>
            <div class="dv-grid-price">\${{ item.price }}</div>
          </div>
        </ng-template>
      </glint-data-view>
    </div>

    <!-- OrderList -->
    <div class="demo-section">
      <h3>OrderList - Reorderable List</h3>
      <p class="section-desc">Select an item and use the arrow buttons or drag-and-drop to reorder.</p>
      <glint-order-list
        [value]="cities"
        header="Cities"
        field="name"
        filterBy="name"
        filterPlaceholder="Search cities..."
        (reorder)="onCitiesReorder($event)"
        (selectionChange)="onCitySelection($event)"
      />
      @if (orderListOutput) {
        <div class="output">{{ orderListOutput }}</div>
      }
    </div>

    <!-- PickList -->
    <div class="demo-section">
      <h3>PickList - Transfer Between Lists</h3>
      <p class="section-desc">Select items and use the transfer buttons or drag items between lists.</p>
      <glint-pick-list
        [source]="availableSkills()"
        [target]="assignedSkills()"
        sourceHeader="Available Skills"
        targetHeader="Assigned Skills"
        field="name"
        filterBy="name"
        [showSourceFilter]="true"
        [showTargetFilter]="true"
        (moveToTarget)="onMoveToTarget($event)"
        (moveToSource)="onMoveToSource($event)"
      />
      @if (pickListOutput) {
        <div class="output">{{ pickListOutput }}</div>
      }
    </div>

    <!-- Scroller (Virtual Scroll) -->
    <div class="demo-section">
      <h3>Virtual Scroller</h3>
      <p class="section-desc">Efficiently render 10,000 items using virtual scrolling.</p>
      <glint-scroller [items]="virtualItems" [itemSize]="48" scrollHeight="300px">
        <ng-template #item let-item>
          <div class="scroller-row">
            <span class="scroller-label">{{ item.label }}</span>
            <span class="scroller-value">{{ item.value }}</span>
          </div>
        </ng-template>
      </glint-scroller>
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white; border: 1px solid #e2e8f0; border-radius: 0.625rem;
      padding: 2rem; margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }
    .section-desc { color: #64748b; margin-block: 0 1rem; font-size: 0.875rem; }

    /* DataView list row */
    .dv-list-row {
      display: flex; align-items: center; gap: 1rem;
      padding: 0.75rem 1rem; border-block-end: 1px solid #f1f5f9;
    }
    .dv-name { font-weight: 600; flex: 1; }
    .dv-cat { color: #64748b; font-size: 0.875rem; min-width: 8rem; }
    .dv-price { font-weight: 600; color: #059669; }

    /* DataView grid card */
    .dv-grid-card {
      padding: 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem;
      display: flex; flex-direction: column; gap: 0.25rem;
    }
    .dv-grid-name { font-weight: 600; }
    .dv-grid-cat { color: #64748b; font-size: 0.8125rem; }
    .dv-grid-price { font-weight: 600; color: #059669; margin-block-start: 0.5rem; }

    /* Scroller rows */
    .scroller-row {
      display: flex; align-items: center; justify-content: space-between;
      padding-inline: 1rem; height: 48px; border-block-end: 1px solid #f1f5f9;
    }
    .scroller-label { font-weight: 500; }
    .scroller-value { color: #64748b; font-size: 0.875rem; }
  `,
})
export class ListsDemoComponent {
  products: Product[] = [
    { name: 'Wireless Mouse', category: 'Electronics', price: 29.99 },
    { name: 'Mechanical Keyboard', category: 'Electronics', price: 89.99 },
    { name: 'USB-C Hub', category: 'Accessories', price: 49.99 },
    { name: 'Monitor Stand', category: 'Furniture', price: 34.99 },
    { name: 'Desk Lamp', category: 'Lighting', price: 24.99 },
    { name: 'Webcam HD', category: 'Electronics', price: 59.99 },
    { name: 'Mouse Pad XL', category: 'Accessories', price: 19.99 },
    { name: 'Cable Organizer', category: 'Accessories', price: 12.99 },
    { name: 'Standing Desk Mat', category: 'Furniture', price: 44.99 },
    { name: 'Headphone Stand', category: 'Accessories', price: 22.99 },
    { name: 'Laptop Stand', category: 'Furniture', price: 39.99 },
    { name: 'Wireless Charger', category: 'Electronics', price: 19.99 },
  ];

  cities = [
    { name: 'San Francisco' },
    { name: 'London' },
    { name: 'Tokyo' },
    { name: 'Paris' },
    { name: 'Sydney' },
    { name: 'Berlin' },
    { name: 'Toronto' },
    { name: 'Singapore' },
  ];

  availableSkills = signal([
    { name: 'TypeScript' },
    { name: 'Angular' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'Python' },
    { name: 'GraphQL' },
    { name: 'Docker' },
    { name: 'Kubernetes' },
  ]);

  assignedSkills = signal<{ name: string }[]>([
    { name: 'HTML' },
    { name: 'CSS' },
  ]);

  virtualItems = Array.from({ length: 10000 }, (_, i) => ({
    label: `Item #${i + 1}`,
    value: `Value ${(i * 17 + 3) % 1000}`,
  }));

  orderListOutput = '';
  pickListOutput = '';

  onCitiesReorder(items: unknown[]): void {
    this.cities = items as { name: string }[];
    const names = this.cities.map(c => c.name).join(', ');
    this.orderListOutput = `Reordered: ${names}`;
  }

  onCitySelection(selected: unknown[]): void {
    const names = (selected as { name: string }[]).map(c => c.name).join(', ');
    this.orderListOutput = `Selected: ${names || '(none)'}`;
  }

  onMoveToTarget(items: unknown[]): void {
    const moved = items as { name: string }[];
    this.availableSkills.update(src => src.filter(s => !moved.includes(s)));
    this.assignedSkills.update(tgt => [...tgt, ...moved]);
    const names = moved.map(s => s.name).join(', ');
    this.pickListOutput = `Moved to assigned: ${names}`;
  }

  onMoveToSource(items: unknown[]): void {
    const moved = items as { name: string }[];
    this.assignedSkills.update(tgt => tgt.filter(s => !moved.includes(s)));
    this.availableSkills.update(src => [...src, ...moved]);
    const names = moved.map(s => s.name).join(', ');
    this.pickListOutput = `Moved back to available: ${names}`;
  }
}
