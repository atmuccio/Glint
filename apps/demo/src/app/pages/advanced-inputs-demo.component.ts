import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GlintInputMaskComponent,
  GlintInputOtpComponent,
  GlintFloatLabelComponent,
  GlintInputGroupComponent,
  GlintInputGroupAddonDirective,
  GlintInputComponent,
  GlintKnobComponent,
} from '@glint-ng/core';

@Component({
  selector: 'glint-advanced-inputs-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    GlintInputMaskComponent,
    GlintInputOtpComponent,
    GlintFloatLabelComponent,
    GlintInputGroupComponent,
    GlintInputGroupAddonDirective,
    GlintInputComponent,
    GlintKnobComponent,
  ],
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
    .label-text {
      margin-block: 0 0.25rem; font-size: 0.875rem; font-weight: 500; color: #475569;
    }
    .knob-row { display: flex; gap: 2rem; flex-wrap: wrap; align-items: flex-start; }
    .knob-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
  `,
  template: `
    <h2>Advanced Inputs</h2>
    <p class="page-desc">Masked inputs, OTP fields, floating labels, input groups, and knobs.</p>

    <!-- ── Input Mask ─────────────────────────────── -->
    <div class="demo-section">
      <h3>Input Mask</h3>

      <div class="stack">
        <div>
          <p class="label-text">Phone mask</p>
          <glint-input-mask
            mask="(999) 999-9999"
            placeholder="(___) ___-____"
            [formControl]="phoneCtrl"
          />
          <div class="output">Value: {{ phoneCtrl.value || '(empty)' }}</div>
        </div>

        <div>
          <p class="label-text">Date mask</p>
          <glint-input-mask
            mask="99/99/9999"
            placeholder="MM/DD/YYYY"
            [formControl]="dateMaskCtrl"
          />
          <div class="output">Value: {{ dateMaskCtrl.value || '(empty)' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Input OTP ──────────────────────────────── -->
    <div class="demo-section">
      <h3>Input OTP</h3>

      <div class="stack">
        <div>
          <p class="label-text">Default (4 digits)</p>
          <glint-input-otp [formControl]="otpCtrl" />
          <div class="output">Value: {{ otpCtrl.value || '(empty)' }}</div>
        </div>

        <div>
          <p class="label-text">Custom length (6 digits, integer only)</p>
          <glint-input-otp [length]="6" [integerOnly]="true" [formControl]="otp6Ctrl" />
          <div class="output">Value: {{ otp6Ctrl.value || '(empty)' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Float Label ────────────────────────────── -->
    <div class="demo-section">
      <h3>Float Label</h3>

      <div class="stack">
        <div>
          <p class="label-text">Wrapping a GlintInput</p>
          <glint-float-label>
            <glint-input placeholder=" " [formControl]="floatInputCtrl" />
            <label>Username</label>
          </glint-float-label>
          <div class="output">Value: {{ floatInputCtrl.value || '(empty)' }}</div>
        </div>

        <div>
          <p class="label-text">Wrapping a native input</p>
          <glint-float-label>
            <input type="email" placeholder=" " [formControl]="floatEmailCtrl" />
            <label>Email Address</label>
          </glint-float-label>
          <div class="output">Value: {{ floatEmailCtrl.value || '(empty)' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Input Group ────────────────────────────── -->
    <div class="demo-section">
      <h3>Input Group</h3>

      <div class="stack">
        <div>
          <p class="label-text">Prefix addon</p>
          <glint-input-group>
            <span glintInputGroupAddon>$</span>
            <glint-input placeholder="Amount" [formControl]="amountCtrl" />
          </glint-input-group>
          <div class="output">Value: {{ amountCtrl.value || '(empty)' }}</div>
        </div>

        <div>
          <p class="label-text">Suffix addon</p>
          <glint-input-group>
            <glint-input placeholder="Website" [formControl]="websiteCtrl" />
            <span glintInputGroupAddon>.com</span>
          </glint-input-group>
          <div class="output">Value: {{ websiteCtrl.value || '(empty)' }}</div>
        </div>

        <div>
          <p class="label-text">Prefix + suffix combo</p>
          <glint-input-group>
            <span glintInputGroupAddon>https://</span>
            <glint-input placeholder="example" [formControl]="urlCtrl" />
            <span glintInputGroupAddon>.org</span>
          </glint-input-group>
          <div class="output">Value: {{ urlCtrl.value || '(empty)' }}</div>
        </div>
      </div>
    </div>

    <!-- ── Knob ───────────────────────────────────── -->
    <div class="demo-section">
      <h3>Knob</h3>

      <div class="knob-row">
        <div class="knob-item">
          <p class="label-text">Basic</p>
          <glint-knob [formControl]="knobCtrl" />
          <div class="output">Value: {{ knobCtrl.value }}</div>
        </div>

        <div class="knob-item">
          <p class="label-text">Min/Max/Step (0-360, step 15)</p>
          <glint-knob
            [min]="0"
            [max]="360"
            [step]="15"
            [size]="120"
            valueTemplate="{value}deg"
            [formControl]="angleCtrl"
          />
          <div class="output">Value: {{ angleCtrl.value }}deg</div>
        </div>

        <div class="knob-item">
          <p class="label-text">Read-only</p>
          <glint-knob
            [formControl]="readonlyKnobCtrl"
            [readonly]="true"
            [size]="100"
            valueTemplate="{value}%"
          />
        </div>
      </div>
    </div>
  `,
})
export class AdvancedInputsDemoComponent {
  // ── Input Mask ─────────────────────────────────
  phoneCtrl = new FormControl('');
  dateMaskCtrl = new FormControl('');

  // ── Input OTP ──────────────────────────────────
  otpCtrl = new FormControl('');
  otp6Ctrl = new FormControl('');

  // ── Float Label ────────────────────────────────
  floatInputCtrl = new FormControl('');
  floatEmailCtrl = new FormControl('');

  // ── Input Group ────────────────────────────────
  amountCtrl = new FormControl('');
  websiteCtrl = new FormControl('');
  urlCtrl = new FormControl('');

  // ── Knob ───────────────────────────────────────
  knobCtrl = new FormControl(50);
  angleCtrl = new FormControl(90);
  readonlyKnobCtrl = new FormControl(75);
}
