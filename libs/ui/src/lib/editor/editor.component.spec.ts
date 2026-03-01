import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintEditorComponent } from './editor.component';

@Component({
  selector: 'glint-test-editor-host',
  standalone: true,
  imports: [GlintEditorComponent, ReactiveFormsModule],
  template: `
    <glint-editor
      [formControl]="ctrl"
      [placeholder]="placeholder"
      [showToolbar]="showToolbar"
      [disabled]="disabled"
      [readonly]="readonlyState"
      [height]="height"
      (textChange)="onTextChange($event)"
    />
  `,
})
class TestEditorHostComponent {
  ctrl = new FormControl('');
  placeholder = 'Type here...';
  showToolbar = true;
  disabled = false;
  readonlyState = false;
  height = '200px';
  lastTextChange = '';
  onTextChange(html: string) {
    this.lastTextChange = html;
  }
}

describe('GlintEditorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestEditorHostComponent],
    });
  });

  it('should render toolbar with formatting buttons', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const toolbar = fixture.nativeElement.querySelector('.editor-toolbar');
    expect(toolbar).toBeTruthy();

    const buttons = fixture.nativeElement.querySelectorAll('.toolbar-btn');
    expect(buttons.length).toBeGreaterThanOrEqual(9);

    // Check specific aria labels
    const ariaLabels = Array.from(buttons).map((btn) =>
      (btn as HTMLElement).getAttribute('aria-label')
    );
    expect(ariaLabels).toContain('Bold');
    expect(ariaLabels).toContain('Italic');
    expect(ariaLabels).toContain('Underline');
    expect(ariaLabels).toContain('Bullet list');
    expect(ariaLabels).toContain('Numbered list');
    expect(ariaLabels).toContain('Heading 1');
    expect(ariaLabels).toContain('Heading 2');
    expect(ariaLabels).toContain('Heading 3');
    expect(ariaLabels).toContain('Clear formatting');
  });

  it('should render editable content area', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent).toBeTruthy();
  });

  it('should have contenteditable attribute', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('contenteditable')).toBe('true');
  });

  it('should work with FormControl (CVA write/read)', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Write value from FormControl
    fixture.componentInstance.ctrl.setValue('<p>Hello</p>');
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector(
      '.editor-content'
    ) as HTMLDivElement;
    expect(editorContent.innerHTML).toBe('<p>Hello</p>');

    // Simulate user input to read value back
    editorContent.innerHTML = '<p>World</p>';
    editorContent.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('<p>World</p>');
  });

  it('should set disabled state from FormControl', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector(
      'glint-editor'
    ) as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('contenteditable')).toBe('false');
  });

  it('should hide toolbar when showToolbar is false', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.componentInstance.showToolbar = false;
    fixture.detectChanges();
    await fixture.whenStable();

    const toolbar = fixture.nativeElement.querySelector('.editor-toolbar');
    expect(toolbar).toBeFalsy();
  });

  it('should have textbox role', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('role')).toBe('textbox');
    expect(editorContent.getAttribute('aria-multiline')).toBe('true');
  });

  it('should emit textChange on input', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector(
      '.editor-content'
    ) as HTMLDivElement;
    editorContent.innerHTML = '<b>Test</b>';
    editorContent.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.lastTextChange).toBe('<b>Test</b>');
  });

  it('should set placeholder via data attribute', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('data-placeholder')).toBe(
      'Type here...'
    );
  });

  it('should hide toolbar when readonly', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.componentInstance.readonlyState = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const toolbar = fixture.nativeElement.querySelector('.editor-toolbar');
    expect(toolbar).toBeFalsy();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('contenteditable')).toBe('false');
    expect(editorContent.getAttribute('aria-readonly')).toBe('true');
  });

  it('should not be editable when disabled', async () => {
    const fixture = TestBed.createComponent(TestEditorHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const editorContent = fixture.nativeElement.querySelector('.editor-content');
    expect(editorContent.getAttribute('contenteditable')).toBe('false');
    expect(editorContent.getAttribute('aria-disabled')).toBe('true');

    // Toolbar should also be hidden when disabled
    const toolbar = fixture.nativeElement.querySelector('.editor-toolbar');
    expect(toolbar).toBeFalsy();
  });
});
