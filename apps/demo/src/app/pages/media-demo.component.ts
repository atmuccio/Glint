import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
  GlintImageComponent,
  GlintImageCompareComponent,
  GlintCarouselComponent,
  GlintGalleriaComponent,
} from '@glint-ng/core';
import type { GlintGalleriaImage } from '@glint-ng/core';

@Component({
  selector: 'glint-media-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    GlintImageComponent,
    GlintImageCompareComponent,
    GlintCarouselComponent,
    GlintGalleriaComponent,
  ],
  template: `
    <h2>Media</h2>
    <p class="page-desc">Image previews, comparison sliders, carousels, and galleries.</p>

    <div class="demo-section">
      <h3>Image</h3>
      <p class="section-desc">Basic image display. Click the preview-enabled image to open a fullscreen overlay.</p>
      <div class="row">
        <div class="image-card">
          <span class="image-label">Basic</span>
          <glint-image
            src="https://picsum.photos/seed/glint1/400/300"
            alt="Nature landscape"
            width="200px"
          />
        </div>
        <div class="image-card">
          <span class="image-label">With Preview (click to enlarge)</span>
          <glint-image
            src="https://picsum.photos/seed/glint2/400/300"
            alt="Mountain scenery"
            width="200px"
            [preview]="true"
          />
        </div>
        <div class="image-card">
          <span class="image-label">Custom Size</span>
          <glint-image
            src="https://picsum.photos/seed/glint3/600/200"
            alt="Wide panorama"
            width="300px"
            height="100px"
          />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h3>Image Compare</h3>
      <p class="section-desc">Drag the slider or use arrow keys to compare two images side by side.</p>
      <div style="max-inline-size: 600px;">
        <glint-image-compare
          leftSrc="https://picsum.photos/seed/glint-before/600/400"
          rightSrc="https://picsum.photos/seed/glint-after/600/400"
          leftAlt="Before editing"
          rightAlt="After editing"
          [initialPosition]="50"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>Carousel</h3>
      <p class="section-desc">Content slider showing multiple items with navigation and indicators.</p>
      <glint-carousel [value]="carouselItems" [numVisible]="3" [numScroll]="1" [circular]="true">
        <ng-template #item let-product>
          <div class="carousel-card">
            <img [src]="product.image" [alt]="product.name" class="carousel-image" />
            <div class="carousel-card-body">
              <h4 class="carousel-card-title">{{ product.name }}</h4>
              <p class="carousel-card-text">{{ product.description }}</p>
              <span class="carousel-card-price">{{ product.price }}</span>
            </div>
          </div>
        </ng-template>
      </glint-carousel>
    </div>

    <div class="demo-section">
      <h3>Carousel (Single Item)</h3>
      <p class="section-desc">Full-width carousel with one visible item at a time.</p>
      <div style="max-inline-size: 600px;">
        <glint-carousel [value]="heroSlides" [numVisible]="1" [numScroll]="1" [circular]="true" [autoplayInterval]="4000">
          <ng-template #item let-slide>
            <div class="hero-slide">
              <img [src]="slide.image" [alt]="slide.title" class="hero-image" />
              <div class="hero-overlay">
                <h4 class="hero-title">{{ slide.title }}</h4>
                <p class="hero-subtitle">{{ slide.subtitle }}</p>
              </div>
            </div>
          </ng-template>
        </glint-carousel>
      </div>
    </div>

    <div class="demo-section">
      <h3>Galleria with Thumbnails</h3>
      <p class="section-desc">Image gallery with thumbnail navigation and prev/next controls.</p>
      <div style="max-inline-size: 600px;">
        <glint-galleria
          [images]="galleriaImages"
          [showThumbnails]="true"
          thumbnailsPosition="bottom"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>Galleria with Indicators</h3>
      <p class="section-desc">Compact gallery using dot indicators instead of thumbnails.</p>
      <div style="max-inline-size: 600px;">
        <glint-galleria
          [images]="galleriaImages"
          [showThumbnails]="false"
          [showIndicators]="true"
          [circular]="true"
        />
      </div>
    </div>

    <div class="demo-section">
      <h3>Galleria with Fullscreen</h3>
      <p class="section-desc">Click the fullscreen icon on the image to open a fullscreen lightbox.</p>
      <div style="max-inline-size: 600px;">
        <glint-galleria
          [images]="galleriaImages"
          [showThumbnails]="true"
          [fullscreen]="true"
          thumbnailsPosition="bottom"
        />
      </div>
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
    .section-desc { color: #64748b; font-size: 0.875rem; margin-block: -0.5rem 1rem; }
    .row { display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-start; }
    .stack { display: flex; flex-direction: column; gap: 1rem; }
    .output { margin-block-start: 1rem; padding: 0.75rem 1rem; background: #f8fafc;
      border: 1px solid #e2e8f0; border-radius: 6px; font-size: 0.875rem; color: #64748b; }

    .image-card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .image-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 500;
    }

    .carousel-card {
      margin-inline: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }
    .carousel-image {
      display: block;
      inline-size: 100%;
      block-size: 10rem;
      object-fit: cover;
    }
    .carousel-card-body {
      padding: 0.75rem;
    }
    .carousel-card-title {
      margin: 0 0 0.25rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
    }
    .carousel-card-text {
      margin: 0 0 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.4;
    }
    .carousel-card-price {
      font-size: 0.875rem;
      font-weight: 700;
      color: #3b82f6;
    }

    .hero-slide {
      position: relative;
      border-radius: 0.5rem;
      overflow: hidden;
    }
    .hero-image {
      display: block;
      inline-size: 100%;
      block-size: 18rem;
      object-fit: cover;
    }
    .hero-overlay {
      position: absolute;
      inset-block-end: 0;
      inset-inline: 0;
      padding: 1.5rem;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      color: white;
    }
    .hero-title {
      margin: 0 0 0.25rem;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .hero-subtitle {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.9;
    }
  `,
})
export class MediaDemoComponent {
  carouselItems = [
    {
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling over-ear headphones.',
      price: '$299',
      image: 'https://picsum.photos/seed/product1/400/300',
    },
    {
      name: 'Smart Watch',
      description: 'Fitness tracking with heart rate monitor.',
      price: '$199',
      image: 'https://picsum.photos/seed/product2/400/300',
    },
    {
      name: 'Bluetooth Speaker',
      description: 'Portable waterproof speaker with deep bass.',
      price: '$79',
      image: 'https://picsum.photos/seed/product3/400/300',
    },
    {
      name: 'Camera Lens',
      description: '50mm f/1.4 prime lens for portraits.',
      price: '$449',
      image: 'https://picsum.photos/seed/product4/400/300',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Cherry MX switches with RGB backlighting.',
      price: '$149',
      image: 'https://picsum.photos/seed/product5/400/300',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 hub with HDMI, USB 3.0, and SD card reader.',
      price: '$59',
      image: 'https://picsum.photos/seed/product6/400/300',
    },
  ];

  heroSlides = [
    {
      title: 'Explore the Mountains',
      subtitle: 'Discover breathtaking views and hidden trails in the wilderness.',
      image: 'https://picsum.photos/seed/hero1/800/400',
    },
    {
      title: 'Urban Architecture',
      subtitle: 'Modern design meets timeless craftsmanship in the city skyline.',
      image: 'https://picsum.photos/seed/hero2/800/400',
    },
    {
      title: 'Ocean Horizons',
      subtitle: 'Relax by the shore and let the waves wash away your worries.',
      image: 'https://picsum.photos/seed/hero3/800/400',
    },
    {
      title: 'Forest Canopy',
      subtitle: 'Walk among ancient trees and experience the serenity of nature.',
      image: 'https://picsum.photos/seed/hero4/800/400',
    },
  ];

  galleriaImages: GlintGalleriaImage[] = [
    {
      src: 'https://picsum.photos/seed/gallery1/800/600',
      alt: 'Mountain landscape at sunrise',
      thumbnailSrc: 'https://picsum.photos/seed/gallery1/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery2/800/600',
      alt: 'City skyline at dusk',
      thumbnailSrc: 'https://picsum.photos/seed/gallery2/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery3/800/600',
      alt: 'Tropical beach with palm trees',
      thumbnailSrc: 'https://picsum.photos/seed/gallery3/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery4/800/600',
      alt: 'Autumn forest path',
      thumbnailSrc: 'https://picsum.photos/seed/gallery4/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery5/800/600',
      alt: 'Snowy mountain peak',
      thumbnailSrc: 'https://picsum.photos/seed/gallery5/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery6/800/600',
      alt: 'Desert sand dunes',
      thumbnailSrc: 'https://picsum.photos/seed/gallery6/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery7/800/600',
      alt: 'Waterfall in rainforest',
      thumbnailSrc: 'https://picsum.photos/seed/gallery7/160/120',
    },
    {
      src: 'https://picsum.photos/seed/gallery8/800/600',
      alt: 'Northern lights over lake',
      thumbnailSrc: 'https://picsum.photos/seed/gallery8/160/120',
    },
  ];
}
