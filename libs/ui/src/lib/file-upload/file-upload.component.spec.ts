import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GlintFileUploadComponent } from './file-upload.component';

function createFile(name: string, size: number, type = 'text/plain'): File {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
}

function createMockFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] ?? null,
    [Symbol.iterator]: function* () {
      for (const file of files) yield file;
    },
  } as unknown as FileList;
  for (let i = 0; i < files.length; i++) {
    (fileList as Record<number, File>)[i] = files[i];
  }
  return fileList;
}

function triggerFileSelect(fixture: ComponentFixture<unknown>, files: File[]): void {
  const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
  const mockFileList = createMockFileList(files);
  Object.defineProperty(input, 'files', { value: mockFileList, configurable: true });
  input.dispatchEvent(new Event('change', { bubbles: true }));
  fixture.detectChanges();
}

// ---------- Test host: default values ----------
@Component({
  selector: 'glint-test-file-upload-default',
  standalone: true,
  imports: [GlintFileUploadComponent],
  template: `
    <glint-file-upload
      (selectFiles)="onSelect($event)"
      (removeFile)="onRemove($event)"
      (clear)="onClear()"
    />
  `,
})
class TestDefaultHostComponent {
  selectedFiles: File[] = [];
  removedFile: File | null = null;
  cleared = false;

  onSelect(files: File[]): void { this.selectedFiles = files; }
  onRemove(file: File): void { this.removedFile = file; }
  onClear(): void { this.cleared = true; }
}

// ---------- Test host: multiple ----------
@Component({
  selector: 'glint-test-file-upload-multiple',
  standalone: true,
  imports: [GlintFileUploadComponent],
  template: `
    <glint-file-upload
      [multiple]="true"
      (selectFiles)="onSelect($event)"
      (removeFile)="onRemove($event)"
    />
  `,
})
class TestMultipleHostComponent {
  selectedFiles: File[] = [];
  removedFile: File | null = null;

  onSelect(files: File[]): void { this.selectedFiles = files; }
  onRemove(file: File): void { this.removedFile = file; }
}

// ---------- Test host: accept ----------
@Component({
  selector: 'glint-test-file-upload-accept',
  standalone: true,
  imports: [GlintFileUploadComponent],
  template: `<glint-file-upload accept="image/*,.pdf" />`,
})
class TestAcceptHostComponent {}

// ---------- Test host: disabled ----------
@Component({
  selector: 'glint-test-file-upload-disabled',
  standalone: true,
  imports: [GlintFileUploadComponent],
  template: `<glint-file-upload [disabled]="true" />`,
})
class TestDisabledHostComponent {}

describe('GlintFileUploadComponent', () => {
  it('should render choose button with label', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.choose-btn');
    expect(btn).toBeTruthy();
    expect(btn.textContent.trim()).toBe('Choose');
  });

  it('should render drop zone', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const dropZone = fixture.nativeElement.querySelector('.drop-zone');
    expect(dropZone).toBeTruthy();
    expect(dropZone.textContent).toContain('Drag and drop files here');
  });

  it('should show file list after selection', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const file = createFile('test.txt', 100);
    triggerFileSelect(fixture, [file]);

    const fileItems = fixture.nativeElement.querySelectorAll('.file-item');
    expect(fileItems.length).toBe(1);
    expect(fileItems[0].textContent).toContain('test.txt');
  });

  it('should format file sizes correctly', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const file = createFile('big.txt', 1536, 'text/plain');
    triggerFileSelect(fixture, [file]);

    const sizeEl = fixture.nativeElement.querySelector('.file-size');
    expect(sizeEl).toBeTruthy();
    expect(sizeEl.textContent.trim()).toBe('1.5 KB');
  });

  it('should remove file on remove button click', () => {
    TestBed.configureTestingModule({ imports: [TestMultipleHostComponent] });
    const fixture = TestBed.createComponent(TestMultipleHostComponent);
    fixture.detectChanges();

    const file1 = createFile('a.txt', 10);
    const file2 = createFile('b.txt', 20);
    triggerFileSelect(fixture, [file1, file2]);

    let fileItems = fixture.nativeElement.querySelectorAll('.file-item');
    expect(fileItems.length).toBe(2);

    const removeBtn = fileItems[0].querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.click();
    fixture.detectChanges();

    fileItems = fixture.nativeElement.querySelectorAll('.file-item');
    expect(fileItems.length).toBe(1);
  });

  it('should clear all files on clear button', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const file = createFile('test.txt', 100);
    triggerFileSelect(fixture, [file]);

    const clearBtn = fixture.nativeElement.querySelector('.clear-btn');
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    const fileItems = fixture.nativeElement.querySelectorAll('.file-item');
    expect(fileItems.length).toBe(0);
    expect(fixture.componentInstance.cleared).toBe(true);
  });

  it('should emit selectFiles on file selection', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const file = createFile('test.txt', 100);
    triggerFileSelect(fixture, [file]);

    expect(fixture.componentInstance.selectedFiles.length).toBe(1);
    expect(fixture.componentInstance.selectedFiles[0].name).toBe('test.txt');
  });

  it('should emit removeFile on individual file remove', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const file = createFile('test.txt', 100);
    triggerFileSelect(fixture, [file]);

    const removeBtn = fixture.nativeElement.querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.removedFile).toBeTruthy();
    expect(fixture.componentInstance.removedFile?.name).toBe('test.txt');
  });

  it('should respect accept attribute on input', () => {
    TestBed.configureTestingModule({ imports: [TestAcceptHostComponent] });
    const fixture = TestBed.createComponent(TestAcceptHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.getAttribute('accept')).toBe('image/*,.pdf');
  });

  it('should respect multiple attribute on input', () => {
    TestBed.configureTestingModule({ imports: [TestMultipleHostComponent] });
    const fixture = TestBed.createComponent(TestMultipleHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.multiple).toBe(true);
  });

  it('should not interact when disabled', () => {
    TestBed.configureTestingModule({ imports: [TestDisabledHostComponent] });
    const fixture = TestBed.createComponent(TestDisabledHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-file-upload') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);

    const chooseBtn = fixture.nativeElement.querySelector('.choose-btn') as HTMLButtonElement;
    expect(chooseBtn.disabled).toBe(true);
  });

  it('should show drag highlight on dragover', () => {
    TestBed.configureTestingModule({ imports: [TestDefaultHostComponent] });
    const fixture = TestBed.createComponent(TestDefaultHostComponent);
    fixture.detectChanges();

    const dropZone = fixture.nativeElement.querySelector('.drop-zone') as HTMLElement;
    expect(dropZone.classList.contains('dragover')).toBe(false);

    const dragOverEvent = new Event('dragover', { bubbles: true });
    dropZone.dispatchEvent(dragOverEvent);
    fixture.detectChanges();

    expect(dropZone.classList.contains('dragover')).toBe(true);

    const dragLeaveEvent = new Event('dragleave', { bubbles: true });
    dropZone.dispatchEvent(dragLeaveEvent);
    fixture.detectChanges();

    expect(dropZone.classList.contains('dragover')).toBe(false);
  });
});
