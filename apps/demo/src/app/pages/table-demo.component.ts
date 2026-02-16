import { Component, signal } from '@angular/core';
import {
  GlintTableComponent,
  GlintColumnDirective,
  GlintPaginatorComponent,
} from '@glint/ui';

const USERS: Record<string, unknown>[] = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { name: 'Carol White', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'David Brown', email: 'david@example.com', role: 'Editor', status: 'Active' },
  { name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', status: 'Active' },
  { name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', status: 'Inactive' },
  { name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', status: 'Active' },
  { name: 'Henry Wilson', email: 'henry@example.com', role: 'Viewer', status: 'Active' },
];

@Component({
  selector: 'glint-table-demo',
  standalone: true,
  imports: [
    GlintTableComponent,
    GlintColumnDirective,
    GlintPaginatorComponent,
  ],
  template: `
    <h2>Table</h2>
    <p class="page-desc">Data tables with sorting, striping, and pagination support.</p>

    <div class="demo-section">
      <h3>Basic Table</h3>
      <glint-table [data]="users">
        <ng-template glintColumn="name" header="Name" let-row>{{ row.name }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row.email }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row.role }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row.status }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Sortable Columns</h3>
      <glint-table [data]="users">
        <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>{{ row.name }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row.email }}</ng-template>
        <ng-template glintColumn="role" header="Role" [sortable]="true" let-row>{{ row.role }}</ng-template>
        <ng-template glintColumn="status" header="Status" [sortable]="true" let-row>{{ row.status }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Striped Table</h3>
      <glint-table [data]="users" [striped]="true">
        <ng-template glintColumn="name" header="Name" let-row>{{ row.name }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row.email }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row.role }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row.status }}</ng-template>
      </glint-table>
    </div>

    <div class="demo-section">
      <h3>Table with Paginator</h3>
      <glint-table [data]="pagedUsers()">
        <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>{{ row.name }}</ng-template>
        <ng-template glintColumn="email" header="Email" let-row>{{ row.email }}</ng-template>
        <ng-template glintColumn="role" header="Role" let-row>{{ row.role }}</ng-template>
        <ng-template glintColumn="status" header="Status" let-row>{{ row.status }}</ng-template>
      </glint-table>
      <glint-paginator
        [totalRecords]="users.length"
        [rows]="pageSize()"
        [first]="firstRecord()"
        (pageChange)="onPageChange($event)"
      />
    </div>
  `,
  styles: `
    :host { display: block; }
    h2 { margin-block: 0 0.25rem; font-size: 1.75rem; font-weight: 600; color: #1e293b; }
    .page-desc { color: #64748b; margin-block: 0 2rem; font-size: 1.25rem; }
    .demo-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 0.625rem;
      padding: 2rem;
      margin-block-end: 1.5rem;
    }
    .demo-section h3 { margin-block: 0 1rem; font-size: 1rem; font-weight: 600; color: #334155; }
    .row { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
  `,
})
export class TableDemoComponent {
  readonly users: Record<string, unknown>[] = USERS;

  pageSize = signal(3);
  firstRecord = signal(0);

  pagedUsers = signal<Record<string, unknown>[]>(this.users.slice(0, 3));

  onPageChange(event: { page: number; rows: number; first: number }): void {
    this.firstRecord.set(event.first);
    this.pageSize.set(event.rows);
    this.pagedUsers.set(this.users.slice(event.first, event.first + event.rows));
  }
}
