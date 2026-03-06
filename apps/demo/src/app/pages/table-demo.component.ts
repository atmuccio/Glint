import { Component, signal } from '@angular/core';
import {
  GlintTableComponent,
  GlintColumnDirective,
  GlintTableEmptyDirective,
  GlintPaginatorComponent,
} from '@glint-ng/core';

const USERS: Record<string, unknown>[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Viewer', status: 'Active' },
];

@Component({
  selector: 'glint-table-demo',
  standalone: true,
  imports: [
    GlintTableComponent,
    GlintColumnDirective,
    GlintTableEmptyDirective,
    GlintPaginatorComponent,
  ],
  template: `
    <h2>Table</h2>
    <p class="page-desc">Data tables with sorting, selection, pagination, and custom empty states.</p>

    <div class="demo-section">
      <h3>Basic Table</h3>
      <glint-table [data]="users">
        <ng-template glintColumn="name" header="Name" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row['role'] }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row['status'] }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Sortable Columns</h3>
      <glint-table [data]="users">
        <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" [sortable]="true" let-row>{{ row['role'] }}</ng-template>
        <ng-template glintColumn="status" header="Status" [sortable]="true" let-row>{{ row['status'] }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Multi-Select</h3>
      <p class="section-desc">Click rows or use checkboxes to select. Header checkbox toggles all.</p>
      <glint-table
        [data]="users"
        selectionMode="multiple"
        [(selection)]="multiSelection"
        trackBy="id"
        (rowClick)="lastRowClick.set($event)"
      >
        <ng-template glintColumn="name" header="Name" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row['role'] }}</ng-template>
      </glint-table>
      <p class="selection-info">Selected: {{ multiSelection().length }} row(s)</p>
    </div>

    <div class="demo-section">
      <h3>Single Select</h3>
      <p class="section-desc">Only one row can be selected at a time using radio buttons.</p>
      <glint-table
        [data]="users.slice(0, 4)"
        selectionMode="single"
        [(selection)]="singleSelection"
        trackBy="id"
      >
        <ng-template glintColumn="name" header="Name" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row['role'] }}</ng-template>
      </glint-table>
      @if (singleSelection().length) {
        <p class="selection-info">Selected: {{ singleSelection()[0]['name'] }}</p>
      }
    </div>

    <div class="demo-section">
      <h3>Custom Empty State</h3>
      <glint-table [data]="emptyData">
        <ng-template glintColumn="name" header="Name" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintTableEmpty>
          <div class="custom-empty-state">
            <span class="empty-icon">&#128269;</span>
            <p>No users found matching your criteria.</p>
            <p class="empty-hint">Try adjusting your filters or adding new records.</p>
          </div>
        </ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Striped Table</h3>
      <glint-table [data]="users" [striped]="true">
        <ng-template glintColumn="name" header="Name" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row['role'] }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row['status'] }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Table with Paginator</h3>
      <glint-table [data]="pagedUsers()">
        <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>{{ row['name'] }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row['email'] }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row['role'] }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row['status'] }}</ng-template>
      </glint-table>
      <glint-paginator
        [totalRecords]="users.length"
        [rows]="pageSize()"
        [first]="firstRecord()"
        (pageChange)="onPageChange($event)"
      />
    </div>
  `,
  host: { class: 'demo-page' },
  styles: `
    :host { display: block; }
    .selection-info {
      margin-block-start: 0.75rem;
      font-size: 0.875rem;
      color: #475569;
      font-weight: 500;
    }
    .custom-empty-state {
      text-align: center;
      padding: 2rem;
      color: #64748b;
    }
    .custom-empty-state .empty-icon {
      font-size: 2.5rem;
      display: block;
      margin-block-end: 0.75rem;
    }
    .custom-empty-state p { margin: 0; }
    .custom-empty-state .empty-hint {
      font-size: 0.875rem;
      margin-block-start: 0.5rem;
      color: #94a3b8;
    }
  `,
})
export class TableDemoComponent {
  readonly users: Record<string, unknown>[] = USERS;
  readonly emptyData: Record<string, unknown>[] = [];

  multiSelection = signal<Record<string, unknown>[]>([]);
  singleSelection = signal<Record<string, unknown>[]>([]);
  lastRowClick = signal<Record<string, unknown> | null>(null);

  pageSize = signal(3);
  firstRecord = signal(0);

  pagedUsers = signal<Record<string, unknown>[]>(this.users.slice(0, 3));

  onPageChange(event: { page: number; rows: number; first: number }): void {
    this.firstRecord.set(event.first);
    this.pageSize.set(event.rows);
    this.pagedUsers.set(this.users.slice(event.first, event.first + event.rows));
  }
}
