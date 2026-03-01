import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * Avatar component for displaying user images, icons, or initials.
 *
 * @example
 * ```html
 * <glint-avatar image="/photo.jpg" label="John Doe" />
 * <glint-avatar label="JD" size="lg" />
 * <glint-avatar label="AB" shape="square" />
 * ```
 */
@Component({
  selector: 'glint-avatar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.aria-label]': 'label()',
    'role': 'img',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      font-family: var(--glint-font-family);
      font-weight: 600;
      font-size: 1rem;
      color: var(--glint-color-primary-contrast);
      background: var(--glint-color-primary);
      overflow: hidden;
      flex-shrink: 0;
      user-select: none;
    }

    :host([data-shape="circle"]) { border-radius: 50%; }
    :host([data-shape="square"]) { border-radius: var(--glint-border-radius); }

    :host([data-size="sm"]) {
      inline-size: 2rem;
      block-size: 2rem;
      font-size: 0.75rem;
    }
    :host([data-size="lg"]) {
      inline-size: 3.5rem;
      block-size: 3.5rem;
      font-size: 1.25rem;
    }
    :host([data-size="xl"]) {
      inline-size: 5rem;
      block-size: 5rem;
      font-size: 1.75rem;
    }

    img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
    }
  `,
  template: `
    @if (image()) {
      <img [src]="image()" [alt]="label()" />
    } @else {
      {{ initials() }}
    }
  `,
})
export class GlintAvatarComponent {
  /** Image URL */
  image = input('');
  /** Label (used for alt text and initials) */
  label = input('');
  /** Size variant */
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  /** Shape variant */
  shape = input<'circle' | 'square'>('circle');

  protected initials = computed(() => {
    const label = this.label();
    if (!label) return '?';
    const parts = label.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return label.slice(0, 2).toUpperCase();
  });
}
