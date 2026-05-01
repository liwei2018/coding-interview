import type { Product, SkuSelection, Sku } from '@/types';

export const products: Record<number, Product> = {
  1: {
    id: 1,
    name: 'Echo Dot Smart Speaker (5th Gen)',
    brand: 'Amazon',
    description: 'Better sound, built-in Alexa, smart home control.',
    images: [
      'https://picsum.photos/seed/echo1/600/600',
      'https://picsum.photos/seed/echo2/600/600',
      'https://picsum.photos/seed/echo3/600/600',
      'https://picsum.photos/seed/echo4/600/600',
    ],
    media: [
      {
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
        poster: 'https://picsum.photos/seed/echo-video/600/600',
      },
      { type: 'image', url: 'https://picsum.photos/seed/echo1/600/600' },
      { type: 'image', url: 'https://picsum.photos/seed/echo2/600/600' },
      { type: 'image', url: 'https://picsum.photos/seed/echo3/600/600' },
      { type: 'image', url: 'https://picsum.photos/seed/echo4/600/600' },
    ],
    dimensions: [
      { key: 'size', name: 'Size', values: ['Small', 'Large'] },
      { key: 'color', name: 'Color', values: ['Charcoal', 'Glacier White', 'Deep Sea Blue'] },
      { key: 'capacity', name: 'Capacity', values: ['8GB', '16GB', '32GB'] },
    ],
    highlights: [
      'Deeper bass and clearer vocals than the previous generation',
      'Built-in temperature sensor for smart home automation',
      'Wi-Fi 6 and Bluetooth 5.0 for stable connectivity',
      'Hands-free Alexa controls lights, AC, and curtains',
      'Compact spherical design fits any desk or nightstand',
    ],
    specs: [
      { label: 'Brand', value: 'Amazon' },
      { label: 'Model', value: 'Echo Dot Gen5 (2024)' },
      { label: 'Speaker', value: '1.73" front-firing speaker' },
      { label: 'Connectivity', value: 'Wi-Fi 6 / Bluetooth 5.0' },
      { label: 'Microphone', value: '4-mic array with mute button' },
      { label: 'Size / Weight', value: '100 × 100 × 89 mm / 304 g' },
      { label: 'Warranty', value: '1-year limited' },
    ],
    detailSections: [
      {
        title: 'Richer Sound',
        paragraphs: [
          'Echo Dot 5th Gen features a redesigned speaker with deeper bass and clearer vocals.',
          'Volume is up to 2× louder than the previous generation, easily filling a 15–20 m² room.',
        ],
        image: 'https://picsum.photos/seed/echo-detail-1/800/420',
      },
      {
        title: 'Smart Home Hub',
        paragraphs: [
          'Built-in temperature sensor automates AC, fans, and other smart devices.',
          'Voice-control 140,000+ Alexa-compatible devices: bulbs, plugs, locks, robot vacuums.',
        ],
        image: 'https://picsum.photos/seed/echo-detail-2/800/420',
      },
      {
        title: 'Privacy Protection',
        paragraphs: [
          'One-tap microphone off; manually delete all voice recordings any time.',
          'All voice requests are end-to-end encrypted and never leave the device without consent.',
        ],
      },
    ],
    skus: [
      { size: 'Small', color: 'Charcoal', capacity: '8GB', price: 199, stock: 10 },
      { size: 'Small', color: 'Charcoal', capacity: '16GB', price: 249, stock: 5 },
      { size: 'Small', color: 'Charcoal', capacity: '32GB', price: 299, stock: 0 },
      { size: 'Small', color: 'Glacier White', capacity: '8GB', price: 209, stock: 8 },
      { size: 'Small', color: 'Glacier White', capacity: '16GB', price: 259, stock: 3 },
      { size: 'Small', color: 'Glacier White', capacity: '32GB', price: 309, stock: 6 },
      { size: 'Small', color: 'Deep Sea Blue', capacity: '8GB', price: 219, stock: 4 },
      { size: 'Small', color: 'Deep Sea Blue', capacity: '16GB', price: 269, stock: 2 },
      { size: 'Small', color: 'Deep Sea Blue', capacity: '32GB', price: 319, stock: 7 },
      { size: 'Large', color: 'Charcoal', capacity: '8GB', price: 299, stock: 12 },
      { size: 'Large', color: 'Charcoal', capacity: '16GB', price: 349, stock: 9 },
      { size: 'Large', color: 'Charcoal', capacity: '32GB', price: 399, stock: 1 },
      { size: 'Large', color: 'Glacier White', capacity: '8GB', price: 309, stock: 11 },
      { size: 'Large', color: 'Glacier White', capacity: '16GB', price: 359, stock: 0 },
      { size: 'Large', color: 'Glacier White', capacity: '32GB', price: 409, stock: 5 },
      { size: 'Large', color: 'Deep Sea Blue', capacity: '8GB', price: 319, stock: 6 },
      { size: 'Large', color: 'Deep Sea Blue', capacity: '16GB', price: 369, stock: 4 },
      { size: 'Large', color: 'Deep Sea Blue', capacity: '32GB', price: 419, stock: 3 },
    ],
  },
};

export function findSku(product: Product, selected: SkuSelection): Sku | undefined {
  return product.skus.find((s) =>
    product.dimensions.every(
      (d) => (s as Record<string, string | number>)[d.key] === selected[d.key],
    ),
  );
}

export function getProduct(id: number): Product {
  return products[id] || products[1];
}
